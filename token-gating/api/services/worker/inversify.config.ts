import 'reflect-metadata';
import { Container } from 'inversify';
import mongoose from 'mongoose';
import ms from 'ms';
import { container as workerContainer } from './src/inversify.config';
import { TYPES } from './types';
import logger from './library/logger';

const globalContainer = new Container();

globalContainer.bind<typeof logger>(TYPES.logger).toConstantValue(logger);
globalContainer.bind(TYPES.MONGODB_URI).toConstantValue(process.env.MONGODB_URI || 'mongodb://localhost/token_gating');
globalContainer.bind(TYPES.MONGODB_POOL_SIZE).toConstantValue(parseInt(process.env.MONGODB_POOL_SIZE || '5', 10));
globalContainer.bind(TYPES.ENV).toConstantValue(process.env.ENV || process.env.NODE_ENV || 'staging');

globalContainer.bind(TYPES.mongoose)
  .toDynamicValue(async (ctx) => mongoose.createConnection(ctx.container.get(TYPES.MONGODB_URI), {
    readPreference: 'secondaryPreferred',
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: ms('5m'),
    connectTimeoutMS: ms('5m'),
  })).inSingletonScope();

const container = Container.merge(
  globalContainer,
  workerContainer,

) as Container;

export { container };
