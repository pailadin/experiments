import getPort from 'get-port';
import supertest, { SuperTest, Test } from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import temp from 'temp';
import { Connection } from 'mongoose';
import { container } from '../../inversify.config';
import { TYPES as GLOBAL_TYPES } from '../../types';
import { TYPES as API_TYPES } from '../../services/api/types';
import { ApiService } from '../../services/api';
import logger from '../../library/logger';

temp.track();

export type Context = {
  apiService: ApiService;
  request: SuperTest<Test>;
  port: number;
  mongod: MongoMemoryServer;
  mongoose: Connection;
};

export async function setup(this: Context, preStart = () => <void>undefined) {
  container.snapshot();

  this.mongod = await MongoMemoryServer.create();

  const port = await getPort();

  this.port = port;

  container.rebind(API_TYPES.PORT).toConstantValue(port);
  container
    .rebind(GLOBAL_TYPES.MONGODB_URI)
    .toConstantValue(this.mongod.getUri());

  preStart();

  this.mongoose = await container.get<Promise<Connection>>(GLOBAL_TYPES.mongoose);

  this.apiService = container.get<ApiService>(GLOBAL_TYPES.ApiService);

  this.request = supertest(`http://localhost:${port}`);

  try {
    await this.apiService.start();
  } catch (err) {
    logger.error(err as Error);
    throw err;
  }
}

export async function teardown(this: Context) {
  await this.apiService.stop();

  await this.mongoose.close();

  await this.mongod.stop();

  container.restore();
}

export { container };
