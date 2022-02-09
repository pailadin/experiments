import 'reflect-metadata';
import { Container } from 'inversify';
import mongoose from 'mongoose';
import ms from 'ms';
import { TYPES } from './types';
import logger from './library/logger';

const container = new Container();

container.bind<typeof logger>(TYPES.logger).toConstantValue(logger);
container.bind(TYPES.MONGODB_URI).toConstantValue(process.env.MONGODB_URI || 'mongodb://localhost/token_gating');
container.bind(TYPES.MONGODB_POOL_SIZE).toConstantValue(parseInt(process.env.MONGODB_POOL_SIZE || '5', 10));
container.bind(TYPES.ENV).toConstantValue(process.env.ENV || process.env.NODE_ENV || 'staging');

container.bind(TYPES.mongoose)
  .toDynamicValue(async (ctx) => mongoose.createConnection(ctx.container.get(TYPES.MONGODB_URI), {
    readPreference: 'secondaryPreferred',
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: ms('5m'),
  })).inSingletonScope();

export { container };
