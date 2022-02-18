import Bluebird from 'bluebird';
import cron from 'node-cron';
import { CollectionStatus, TYPES as GLOBAL_TYPES } from '../../types';
import { TYPES } from './src/types';
import CollectionRepository from './src/repositories/collection';
import { container } from '../../inversify.config';
import { WorkerService } from './src';
import logger from '../../library/logger';

let cronJob: cron.ScheduledTask | null = null;

export async function startSync() {
  logger.info('Worker Update Service => Starting');

  const workerService = container.get<WorkerService>(GLOBAL_TYPES.WorkerService);
  const collectionRepository = container.get<CollectionRepository>(TYPES.CollectionRepository);

  cronJob = cron.schedule('0 */1 * * * *', async () => {
    const collections = await collectionRepository.find({
      filter: {
        status: CollectionStatus.UPDATED,
      },
    });

    await Bluebird.map(collections, async (collection) => {
      logger.info(`Worker Update Service => ${collection.contractAddress}`);
      await workerService.syncCollection({
        collection: collection.id,
        priority: false,
      });
    }, {
      concurrency: 1,
    });
  }, {
    scheduled: true,

  });

  logger.info('Worker Update Service => Started');
}

export async function stopSync() {
  logger.info('Worker Update Service => Stopping');

  if (cronJob) { cronJob.stop(); }

  logger.info('Worker Update Service => Stopped');
}
