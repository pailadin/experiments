import getPort from 'get-port';
import { Connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import temp from 'temp';
import { Client } from 'discord.js';
import { WorkerService } from '../../src/index';
import { container } from '../../inversify.config';
import { TYPES as GLOBAL_TYPES } from '../../types';
import { TYPES } from '../../src/types';
import logger from '../../library/logger';

temp.track();

export type Context = {
  workerService: WorkerService;
  port: number;
  mongod: MongoMemoryServer;
  client: Client;
};

export async function setup(this: Context, preStart = () => <void>undefined) {
  container.snapshot();

  this.mongod = await MongoMemoryServer.create();

  const port = await getPort();

  this.port = port;

  container.rebind(TYPES.PORT).toConstantValue(port);
  container
    .rebind(GLOBAL_TYPES.MONGODB_URI)
    .toConstantValue(this.mongod.getUri());

  preStart();

  this.workerService = container.get<WorkerService>(GLOBAL_TYPES.WorkerService);

  try {
    await this.workerService.start();
    this.client = this.workerService.clientBot;
  } catch (err) {
    logger.error(err as Error);
    throw err;
  }
}

export async function teardown(this: Context) {
  await this.workerService.stop();

  const mongoose = await container.get<Promise<Connection>>(GLOBAL_TYPES.mongoose);
  await mongoose.close();

  await this.mongod.stop();

  container.restore();
}

export { container };
