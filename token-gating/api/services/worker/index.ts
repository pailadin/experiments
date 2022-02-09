import Bluebird from 'bluebird';
import { CollectionStatus, TYPES as GLOBAL_TYPES } from './types';
import { TYPES } from './src/types';
import CollectionRepository from './src/repositories/collection';
import { container } from './inversify.config';
import { WorkerService } from './src';
import logger from './library/logger';

async function startSync() {
  logger.info('Starting Worker Service');

  const workerService = container.get<WorkerService>(GLOBAL_TYPES.WorkerService);
  const collectionRepository = container.get<CollectionRepository>(TYPES.CollectionRepository);
  const collections = await collectionRepository.find({
    filter: {
      status: CollectionStatus.UPDATED,
    },
  });

  await Bluebird.map(collections, async (collection) => {
    await workerService.syncCollection(collection.id, false);
  }, {
    concurrency: 1,
  });

  logger.info('Worker Service Started');
}

startSync();
