/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import Queue from 'p-queue';
import { inject, injectable } from 'inversify';
import Logger from '@highoutput/logger';
import axios from 'axios';
import R from 'ramda';
import Bluebird from 'bluebird';
// import EventEmitter from 'events';
import EventEmitter from 'events';
import {
  TYPES as GLOBAL_TYPES,
  ID,
  Event,
  EtherScanObject,
  CollectionStatus,
} from '../types';
import { TYPES } from './types';
import CollectionRepository from './repositories/collection';
import OwnershipRepository from './repositories/ownership';
import ObjectId, { ObjectType } from '../library/object-id';

@injectable()
export class WorkerService {
  @inject(TYPES.ETHERSCAN_KEY) private readonly etherscanKey!: string;

  @inject(GLOBAL_TYPES.logger) private readonly logger!: Logger;

  @inject(TYPES.CollectionRepository) private readonly collectionRepository!: CollectionRepository;

  @inject(TYPES.OwnershipRepository) private readonly ownershipRepository!: OwnershipRepository;

  static localQueue : Queue;

  public eventHandler : EventEmitter;

  constructor() {
    WorkerService.localQueue = new Queue({ concurrency: 1, interval: 200, intervalCap: 1 });

    this.eventHandler = new EventEmitter();

    process.on('uncaughtException', async (error) => {
      this.logger.critical(error);
    });

    process.on('uncaughtExceptionMonitor', async (error) => {
      this.logger.critical(error);
    });

    process.on('unhandledRejection', async (error) => {
      this.logger.critical(error || 'unhandledRejection');
    });
  }

  async getEtherScanData(
    params: {
      contractAddress: string,
      batchSize?: number | null,
      startBlock?: string | null,
      endBlock?: string | null,
  },
  ):Promise<EtherScanObject> {
    const etherScanResponse = await axios.post('https://api.etherscan.io/api', {}, {
      params: {
        module: 'account',
        action: 'tokennfttx',
        contractaddress: params.contractAddress,
        page: 1,
        offset: params.batchSize ? params.batchSize : 10000,
        startblock: params.startBlock,
        endblock: params.endBlock,
        sort: 'desc',
        apikey: this.etherscanKey,
      },
    });

    return etherScanResponse.data;
  }

  async retrieveEvents(
    params: {
    collection: ID,
    contractAddress: string,
    batchSize?: number | null,
    startBlock?: string | null,
    endBlock?: string | null,

   },
  ): Promise<Event[]> {
    const { collection } = params;

    const etherScanData = await this.getEtherScanData({
      ...params,
    });

    const events = etherScanData.result.map((transaction) => {
      const {
        from, contractAddress, to, tokenID, blockNumber,
      } = transaction;

      let sender = from;

      if (sender === '0x0000000000000000000000000000000000000000') { sender = contractAddress; }

      return {

        sender,
        receiver: to,
        tokenID,
        collection,
        blockNumber,

      } as Event;
    });

    this.eventHandler.emit('transfer', events);

    return events;
  }

  async digestEvents(events: Event[]) {
    await Bluebird.map(events, async (event, index) => {
      const {
        blockNumber,
        collection,
        receiver,
        tokenID,
      } = event;

      const ownership = await this.ownershipRepository.findOne({
        filter: {
          tokenID,
        },
      });

      if (ownership) {
        if (ownership.blockNumber < event.blockNumber) {
          await this.ownershipRepository.updateOne({
            filter: {
              tokenID,
            },
            data: {
              owner: receiver,
              blockNumber,
            },
          });
        }
      } else {
        await this.ownershipRepository.create({
          id: ObjectId.generate(ObjectType.OWNERSHIP).buffer,
          data: {
            blockNumber,
            tokenID,
            collectionID: collection,
            owner: receiver,
          },
        });
      }
    });
  }

  async syncCollection(collection: ID, priority: boolean, batchSize?: number | null) {
    this.logger.info('syncCollection');

    const collectionData = await this.collectionRepository.findOne({
      id: collection,
    });

    if (!collectionData) { throw new Error('Collection does not exist'); }

    await WorkerService.localQueue.add(async () => {
      const startBlock = collectionData.blockNumber;
      let currentBlock = '0';
      let latestBlock : string | null = null;
      while (true) {
        const events = await this.retrieveEvents({

          collection,
          contractAddress: collectionData.contractAddress,
          startBlock,
          endBlock: currentBlock === '0' ? null : currentBlock,
          batchSize,
        });

        if (events.length === 0) {
          this.logger.warn('Contract Address has no events.');
          break;
        }

        await this.digestEvents(events);

        const latestEvent = R.head(events);

        if (!latestBlock && latestEvent) {
          latestBlock = latestEvent.blockNumber;
        }

        const event = R.last(events);
        currentBlock = event ? event.blockNumber : '0';

        if (events.length < 10000) {
          break;
        }
      }

      await this.collectionRepository.updateOne({
        id: collection,
        data: {
          blockNumber: latestBlock || '0',
          status: latestBlock ? CollectionStatus.UPDATED : CollectionStatus.INITIALIZING,
        },
      });
    }, {
      priority: priority ? 1 : 0,
    });
  }

  async startSync() {
    const collections = await this.collectionRepository.find({
      filter: {},
    });

    await Bluebird.map(collections, async (collection) => {
      await this.syncCollection(collection.id, true);
    }, {
      concurrency: 1,
    });
  }

  async start() {
    this.logger.info('Starting Worker Service');
    await this.startSync();
    this.logger.info('Worker Service Started');
  }

  async stop() {
    this.logger.info('Stopping Worker Service');
    this.logger.info('Worker Service Stopped');
  }
}
