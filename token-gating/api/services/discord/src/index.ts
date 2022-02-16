/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { inject, injectable } from 'inversify';
import Logger from '@highoutput/logger';
import Queue from 'p-queue';
import { TYPES as ACCOUNT_TYPES } from '../../account/types';
import { TYPES as GLOBAL_TYPES } from '../../../types';
import { TYPES as WORKER_TYPES } from '../../worker/types';
// import { TYPES } from '../../worker/src/types';
import { WorkerService } from '../../worker/src';
// import OwnershipController from '../../worker/src/controllers/ownership';
import HolderAccountController from '../../account/controllers/holder-account';

@injectable()
export class DiscordService {
  @inject(GLOBAL_TYPES.logger) private logger!: Logger;

  @inject(WORKER_TYPES.WorkerService) private workerService!: WorkerService;

  // @inject(TYPES.OwnershipController) private ownershipController!: OwnershipController;

  @inject(ACCOUNT_TYPES.HolderAccountController) private holderAccountController!: HolderAccountController;

  // @inject(GLOBAL_TYPES.BOT_TOKEN) private BOT_TOKEN!: string;

  private localQueue: Queue;

  constructor() {
    this.localQueue = new Queue({ concurrency: 1, interval: 200, intervalCap: 1 });
  }

  async start() {
    this.logger.info('DiscordService => starting');

    this.workerService.eventHandler.on('transfer', async (contractAddress) => {
      this.logger.info(`Event Changed: ${contractAddress}`);
      return this.localQueue.add(async () => {
        await this.holderAccountController.findHolderAccount({ filter: { } });
      });
    });

    this.logger.info('DiscordService => started');
  }

  async stop() {
    this.logger.info('DiscordService => stopping');
    this.workerService.eventHandler.removeAllListeners();
    this.logger.info('DiscordService => stopped');
  }
}
