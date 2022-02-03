import Queue from 'p-queue';
import { inject, injectable } from 'inversify';
import Logger from '@highoutput/logger';

import { Client, Intents } from 'discord.js';
import {
  TYPES as GLOBAL_TYPES,
} from '../types';
import { TYPES } from './types';

@injectable()
export class WorkerService {
  @inject(TYPES.localQueue) private readonly localQueue!: Queue;

  @inject(GLOBAL_TYPES.logger) private readonly logger!: Logger;

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
  }

  async start() {
    this.logger.info('starting');
    await this.clientBot.login('OTM1NjkxNDY2ODE3Mjk0Mzc2.YfCUlQ.XyJ454J83zXjWv2iWq2QavV6GEg');
    this.logger.info('started');
  }

  async stop() {
    this.logger.info('stopping');

    this.localQueue.onIdle();
    this.clientBot.removeAllListeners();
    this.clientBot.destroy();
    this.logger.info('stopped');
  }
}
