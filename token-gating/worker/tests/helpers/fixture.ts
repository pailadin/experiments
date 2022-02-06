import getPort from 'get-port';
import { MongoMemoryServer } from 'mongodb-memory-server';
import temp from 'temp';
import { Connection } from 'mongoose';
import { container } from '../../inversify.config';
import { TYPES as GLOBAL_TYPES } from '../../types';
import { TYPES } from '../../src/types';

temp.track();

export type Context = {
  port: number;
  mongod: MongoMemoryServer;
  mongoose: Connection;
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

  this.mongoose = await container.get<Promise<Connection>>(GLOBAL_TYPES.mongoose);
}

export async function teardown(this: Context) {
  await this.mongoose.close();

  await this.mongod.stop();

  container.restore();
}

export { container };
