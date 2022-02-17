/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import Queue from 'p-queue';
import { inject, injectable } from 'inversify';
import Logger from '@highoutput/logger';
import axios from 'axios';
import R from 'ramda';
import { delay } from 'bluebird';
import ms from 'ms';
import withQuery from 'with-query';
import fetch from 'node-fetch';
import EventEmitter from 'events';
import {
  TYPES as GLOBAL_TYPES,
  ID,
  Event,
  EtherScanObject,
  CollectionStatus,
  Transaction,
} from '../../../types';
import { TYPES } from './types';
import CollectionController from './controllers/collection';
import OwnershipController from './controllers/ownership';
import ObjectId, { ObjectType } from '../../../library/object-id';

@injectable()
export class WorkerService {
  @inject(TYPES.ETHERSCAN_KEY) private readonly etherscanKey!: string;

  @inject(GLOBAL_TYPES.logger) private logger!: Logger;

  @inject(TYPES.CollectionController) readonly collectionController!: CollectionController;

  @inject(TYPES.OwnershipController) readonly ownershipController!: OwnershipController;

  @inject(GLOBAL_TYPES.ENV) private readonly ENV!: string;

  private static localQueue: Queue | null;

  public eventHandler: EventEmitter;

  public etherScanNetwork : string | null = null;

  constructor() {
    if (!WorkerService.localQueue) {
      WorkerService.localQueue = new Queue({ concurrency: 1, interval: 200, intervalCap: 1 });
    }

    this.eventHandler = new EventEmitter();
  }

  async getEtherScanData(
    params: {
      contractAddress: string,
      blockSize?: number | null,
      startBlock?: string | null,
      endBlock?: string | null,
  },
  ):Promise<EtherScanObject> {
    const fetchEtherScan = async () => {
      let retriesLeft = 5;

      const url = `https://api${this.etherScanNetwork}.etherscan.io/api`;

      const urlParams = {
        module: 'account',
        action: 'tokennfttx',
        contractaddress: params.contractAddress,
        page: 1,
        offset: params.blockSize ? params.blockSize : 10000,
        startblock: params.startBlock,
        endblock: params.endBlock,
        sort: 'desc',
        apikey: this.etherscanKey,
      };

      const queryParams = withQuery(url, urlParams);

      this.logger.info(queryParams);

      while (retriesLeft > 0) {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
          controller.abort();
        }, ms('1m'));

        try {
          const response = await fetch(queryParams, {
            method: 'POST',
            signal: controller.signal,
          });

          if (response.status >= 400 || response.status >= 500) { throw new Error(`Status: ${response.status} => ${response.statusText}`); }

          const etherScanResponse:EtherScanObject = await response.json();

          if (etherScanResponse.status === '0') { throw new Error(`Status: ${etherScanResponse.status} => ${etherScanResponse.message}`); }

          return etherScanResponse;
        } catch (e) {
          this.logger.warn((e as Error).message);

          retriesLeft -= 1;

          if (retriesLeft === 0) {
            this.logger.warn(`Max Retries Reached: ${retriesLeft}`);
            return {
              status: '0',
              message: 'not ok',
              result: [],
            };
          }

          await delay(ms('1s'));

          this.logger.warn(`Execute Retries Left: ${retriesLeft}`);
        } finally {
          clearTimeout(timeout);
        }
      }

      return {
        status: '0',
        message: 'not ok',
        result: [],
      };
    };

    return fetchEtherScan();
  }

  async retrieveEvents(
    params: {
    collection: ID,
    contractAddress: string,
    blockSize?: number | null,
    startBlock?: string | null,
    endBlock?: string | null,

   },
  ): Promise<Event[]> {
    const { collection } = params;

    const etherScanData = await this.getEtherScanData({
      ...params,
    });

    if (etherScanData.status === '0') { return []; }

    return etherScanData.result.map((transaction) => {
      const {
        from, contractAddress, to, tokenID, timeStamp, blockNumber,
      } = transaction;

      let sender = from;

      if (sender === '0x0000000000000000000000000000000000000000') { sender = contractAddress; }

      return {

        sender,
        receiver: to,
        tokenID,
        collection,
        blockNumber,
        timestamp: Number(timeStamp),

      };
    });
  }

  private async digestEvents(events: Event[], _batchSize?: number | null) {
    let tokenIDList = R.uniq(events.map((event) => event.tokenID));

    let ownerships = await this.ownershipController.findOwnerships({
      filter: {
        tokenID: {
          $in: tokenIDList,
        },
      },
    });

    const batchSize = _batchSize || 10000;

    let batch : Record<string, unknown>[] = [];
    let startTimestamp = 0;

    for (const event of events) {
      const {
        collection,
        receiver,
        tokenID,
        timestamp,
      } = event;

      const ownership = ownerships.find((ownershipData) => ownershipData.tokenID === tokenID);

      if (startTimestamp === 0) { startTimestamp = timestamp; }

      if (ownership) {
        if (ownership.timestamp < event.timestamp) {
          batch.push({
            updateOne: {
              filter: { tokenID },
              update: {
                $set: {
                  ...ownership,
                  owner: receiver.toLowerCase(),
                  timestamp,
                },
              },
            },
          });
        }
      } else {
        batch.push({
          insertOne: {
            document: {
              _id: ObjectId.generate(ObjectType.OWNERSHIP).buffer,
              timestamp,
              tokenID,
              collectionID: collection,
              owner: receiver.toLowerCase(),
              createdAt: new Date(),
            },
          },
        });
      }

      if (batch.length >= batchSize) {
        await this.ownershipController.bulkWrite(batch);
        this.logger.info(`BulkWrite(BATCH): timestamp => ${startTimestamp}-${timestamp} batchLen => ${batch.length}`);
        startTimestamp = timestamp;
        batch = [];
      }

      await delay(1);
    }

    if (batch.length > 0) {
      await this.ownershipController.bulkWrite(batch);
      this.logger.info(`BulkWrite(FINAL): timestamp => ${startTimestamp}-${R.last(events)?.timestamp} batchLen => ${batch.length}`);
      batch = [];
    }

    ownerships = [];
    tokenIDList = [];
  }

  async syncCollection(params: {
    collection: ID;
    priority: boolean;
    blockSize?: number | null;
    batchSize?: number | null;
  }) {
    const collectionData = await this.collectionController.findOneCollection({
      id: params.collection,
    });

    if (!collectionData) { throw new Error('Collection does not exist'); }

    if (!WorkerService.localQueue) { throw new Error('localQueue is not initialized'); }

    this.etherScanNetwork = this.ENV === 'staging' ? '-rinkeby' : '';

    this.logger.info(`EtherScan URL: https://api${this.etherScanNetwork}.etherscan.io/api`);
    this.logger.info(`syncCollection(${collectionData.status}) ${collectionData.contractAddress} Started`);

    await WorkerService.localQueue.add(async () => {
      let startBlock = collectionData.blockNumber === '0' ? undefined : collectionData.blockNumber;

      if (!startBlock) {
        const initResponse = await axios.post(`https://api${this.etherScanNetwork}.etherscan.io/api`, {}, {
          params: {
            module: 'account',
            action: 'tokennfttx',
            contractaddress: collectionData.contractAddress,
            sort: 'asc',
            page: 1,
            offset: 1,
            apikey: this.etherscanKey,
          },
          timeout: ms('1m'),
        });

        const firstBlock = R.head(initResponse.data.result) as unknown as Transaction;

        if (firstBlock) {
          startBlock = firstBlock.blockNumber;
        }
      }

      let currentBlock: string | undefined;
      let latestBlock : string | null = null;
      const maxBlock = params.blockSize || 10000;
      this.logger.info(`ContractAddress: ${collectionData.contractAddress}`);
      while (true) {
        const events: Event[] = await this.retrieveEvents({

          collection: collectionData.id,
          contractAddress: collectionData.contractAddress,
          startBlock,
          endBlock: currentBlock,
          blockSize: maxBlock,
        });

        if (events.length === 0) {
          this.logger.warn('Contract Address has no events.');
          break;
        }

        const latestEvent = R.head(events);

        if (!latestBlock && latestEvent) {
          latestBlock = latestEvent.blockNumber;
        }

        this.logger.info(`LatestBlock: ${latestBlock} StartBlock: ${startBlock} EndBlock: ${currentBlock} EventSize: ${events.length}`);

        await this.digestEvents(events, params.batchSize);

        const event = R.last(events);
        currentBlock = event ? event.blockNumber : '0';

        R.uniqBy(R.prop('tokenID'))(events);

        this.eventHandler.emit('transfer', collectionData.contractAddress);

        if (events.length < 10000) {
          break;
        }
      }

      await this.collectionController.updateOneCollection({
        filter: {
          id: collectionData.id,
        },
        data: {
          blockNumber: latestBlock || '0',
          status: latestBlock ? CollectionStatus.UPDATED : CollectionStatus.INITIALIZING,
        },
      });
    }, {
      priority: params.priority ? 1 : 0,
    });

    this.logger.info(`syncCollection(${collectionData.status}) ${collectionData.contractAddress}  Complete`);
    this.logger.info(`${collectionData.contractAddress}: UPDATED`);
  }
}
