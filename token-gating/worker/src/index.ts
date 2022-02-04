/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import Queue from 'p-queue';
import { inject, injectable } from 'inversify';
import Logger from '@highoutput/logger';
import axios from 'axios';
import { Client, Intents } from 'discord.js';
import R from 'ramda';
import Bluebird from 'bluebird';
import cron from 'node-cron';
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
  @inject(TYPES.localQueue) private readonly localQueue!: Queue;

  @inject(TYPES.ETHERSCAN_KEY) private readonly etherscanKey!: string;

  @inject(GLOBAL_TYPES.logger) private readonly logger!: Logger;

  @inject(TYPES.CollectionRepository) private readonly collectionRepository!: CollectionRepository;

  @inject(TYPES.OwnershipRepository) private readonly ownershipRepository!: OwnershipRepository;

  public clientBot : Client;

  private cronJob: cron.ScheduledTask | null = null;

  constructor() {
    this.clientBot = new Client({
      intents: [Intents.FLAGS.GUILDS],

    });
    this.clientBot.on('ready', () => {
      if (!this.clientBot.user) {
        throw new Error('Unable to login');
      } else {
        this.logger.info(`${this.clientBot.user.username} has Logged In`);
      }
    });

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

  async retrieveEvents(
    collection: ID,
    startBlock: string | null,
    endBlock: string | null,
    isPriority: boolean,
  ): Promise<Event[]> {
    this.logger.info('retrieveEvents');

    const targetCollection = await this.collectionRepository.findOne({
      id: collection,
    });

    if (!targetCollection) { throw new Error('Collection does not exist'); }

    return this.localQueue.add(async () => {
      const etherScanResponse = await axios.post('https://api.etherscan.io/api', {}, {
        params: {
          module: 'account',
          action: 'tokennfttx',
          contractaddress: targetCollection.contractAddress,
          page: 1,
          offset: 10000,
          startblock: startBlock || '',
          endblock: endBlock || '',
          sort: 'desc',
          apikey: this.etherscanKey,
        },
      });

      const etherScanData = etherScanResponse.data as EtherScanObject;

      return etherScanData.result.map((transaction) => {
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
    }, {
      priority: isPriority ? 1 : 0,

    });
  }

  async digestEvents(events: Event[]) {
    this.logger.info('digestEvents');

    await Bluebird.map(events, async (event) => {
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
            },
          });
        }
      } else {
        await this.ownershipRepository.create({
          id: ObjectId.generate(ObjectType.OWNERSHIP).buffer,
          data: {
            blockNumber,
            tokenID,
            collection,
            owner: receiver,
          },
        });
      }
    });
  }

  async syncCollection(collection: ID) {
    this.logger.info('syncCollection');

    let events = await this.retrieveEvents(collection, '0', null, true);

    const latestEvent = R.head(events);

    const latestBlockNumber = latestEvent ? latestEvent.blockNumber : '0';

    if (events.length < 10000) {
      await this.digestEvents(events);
    } else {
      while (events.length >= 10000) {
        if (events) {
          const lastEvent = R.last(events);
          events = await this.retrieveEvents(collection, '0', lastEvent ? lastEvent.blockNumber : null, true);
          await this.digestEvents(events);
        }
      }
      if (events.length > 0) {
        const lastEvent = R.last(events);
        events = await this.retrieveEvents(collection, '0', lastEvent ? lastEvent.blockNumber : null, true);
        await this.digestEvents(events);
      }
    }

    await this.collectionRepository.updateOne({
      id: collection,
      data: {
        blockNumber: latestBlockNumber,
      },
    });
  }

  async startSync() {
    const collections = await this.collectionRepository.find({
      filter: {},
    });

    await Bluebird.map(collections, async (collection) => {
      await this.syncCollection(collection.id);
    });

    this.cronJob = cron.schedule('0 */20 * * * *', async () => {
      await Bluebird.map(collections, async (collection) => {
        const events = await this.retrieveEvents(collection.id, collection.blockNumber, null, false);

        const latestEvent = R.head(events);

        const latestBlockNumber = latestEvent ? latestEvent.blockNumber : '0';

        await this.digestEvents(events);

        await this.collectionRepository.updateOne({
          id: collection.id,
          data: {
            status: CollectionStatus.UPDATED,
            blockNumber: latestBlockNumber,
          },
        });
      });
    }, {
      scheduled: true,

    });
  }

  async start() {
    this.logger.info('Starting Worker Service');
    await this.clientBot.login('OTM1NjkxNDY2ODE3Mjk0Mzc2.YfCUlQ.XyJ454J83zXjWv2iWq2QavV6GEg');
    await this.startSync();
    this.logger.info('Worker Service Started');
  }

  async stop() {
    this.logger.info('Stopping Worker Service');
    this.localQueue.onIdle();
    this.clientBot.destroy();
    if (this.cronJob) {
      this.cronJob.stop();
    }
    this.logger.info('Worker Service Stopped');
  }
}
