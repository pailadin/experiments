/* retrigger build x26 */

import { Connection } from 'mongoose';
import { container } from './inversify.config';
import logger from './library/logger';
import { ApiService } from './services/api';
import { TYPES } from './types';

async function start() {
  logger.info(process.env);

  logger.info('starting');

  await container.get<ApiService>(TYPES.ApiService).start();

  logger.info('started');
}

async function stop() {
  logger.info('stopping');

  await container.get<ApiService>(TYPES.ApiService).stop();

  const mongoose = await container.get<Promise<Connection>>(TYPES.mongoose);

  await mongoose.close();

  logger.info('stopped');
}

start();

process.on('beforeExit', async () => {
  await stop();
});

process.on('uncaughtException', async (error) => {
  logger.critical(error);
});

process.on('uncaughtExceptionMonitor', async (error) => {
  logger.critical(error);
});

process.on('unhandledRejection', async (error) => {
  logger.critical(error || 'unhandledRejection');
});
