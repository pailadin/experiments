/* retrigger build x26 */

import { Connection } from 'mongoose';

import { container } from './inversify.config';
import logger from './library/logger';
import { ApiService } from './services/api';
import { DiscordService } from './services/discord';
import { startSync, stopSync } from './services/worker';
import { TYPES as GLOBAL_TYPES } from './types';

async function start() {
  logger.info(process.env);
  await container.get<DiscordService>(GLOBAL_TYPES.DiscordService).start();
  await container.get<ApiService>(GLOBAL_TYPES.ApiService).start();
  await startSync();
}

async function stop() {
  await container.get<ApiService>(GLOBAL_TYPES.ApiService).stop();
  await container.get<DiscordService>(GLOBAL_TYPES.DiscordService).stop();
  await stopSync();

  const mongoose = await container.get<Promise<Connection>>(GLOBAL_TYPES.mongoose);

  await mongoose.close();
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
