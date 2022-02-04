/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import Queue from 'p-queue';
import { inject, injectable } from 'inversify';
import Logger from '@highoutput/logger';
import axios from 'axios';
import { Client, Intents } from 'discord.js';
import {
  TYPES as GLOBAL_TYPES,
  ID,
  Event,
  EtherScanObject,
} from '../types';
import { TYPES } from './types';
import CollectionRepository from './repositories/collection';

@injectable()
export class WorkerService {
  @inject(TYPES.localQueue) private readonly localQueue!: Queue;

  @inject(TYPES.ETHERSCAN_KEY) private readonly etherscanKey!: string;

  @inject(GLOBAL_TYPES.logger) private readonly logger!: Logger;

  @inject(TYPES.CollectionRepository) private readonly collectionRepository!: CollectionRepository;

  public clientBot : Client;

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
          startblock: startBlock || '',
          endblock: endBlock || '',
          sort: 'desc',
          apikey: this.etherscanKey,
        },
      });

      const etherScanData = etherScanResponse.data as EtherScanObject;

      return etherScanData.result.map((transaction) => {
        let sender = transaction.from;

        if (sender === '0x0000000000000000000000000000000000000000') { sender = transaction.contractAddress; }

        return {

          sender,
          receiver: transaction.to,
          tokenID: transaction.tokenID,
          collection,

        } as Event;
      });
    }, {
      priority: isPriority ? 1 : 0,
    });
  }

  digestEvents(events: Event[]) {
    this.logger.info('digestEvents');
  }

  async syncCollection(collection: ID) {
    this.logger.info('syncCollection');

    let eventLength = 0;
    const initialEvent = await this.retrieveEvents(collection, '0', null, true);

    eventLength = initialEvent.length;

    if (eventLength < 10000) {
      this.digestEvents(initialEvent);
    } else {
      while (eventLength >= 10000) {
        const events = await this.retrieveEvents(collection, '0', null, true);
        this.digestEvents(events);
        eventLength = events.length;
      }
    }
  }

  async start() {
    this.logger.info('starting');
    this.localQueue.add(async () => {
      this.logger.info({
        etherscanKey: this.etherscanKey,
      });
    });
    await this.clientBot.login('OTM1NjkxNDY2ODE3Mjk0Mzc2.YfCUlQ.XyJ454J83zXjWv2iWq2QavV6GEg');
    this.logger.info('started');
  }

  async stop() {
    this.logger.info('stopping');
    this.localQueue.onIdle();
    this.clientBot.destroy();
    this.logger.info('stopped');
  }
}
