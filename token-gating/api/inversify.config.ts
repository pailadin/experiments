import 'reflect-metadata';
import { Container } from 'inversify';
import mongoose from 'mongoose';
import ms from 'ms';
import { container as apiContainer } from './services/api/inversify.config';
import { container as accountContainer } from './services/account/inversify.config';
import { container as projectContainer } from './services/project/inversify.config';
import { container as workerContainer } from './services/worker/src/inversify.config';
import { container as discordContainer } from './services/discord/inversify.config';
import { TYPES } from './types';
import logger from './library/logger';
import retrievePage from './library/retrieve-page';

const globalContainer = new Container();
globalContainer.bind(TYPES.JWT_SECRET).toConstantValue(Buffer.from(
  process.env.JWT_SECRET || 'c372ec1add5b42bd14423ac2dbacde0d',
  'hex',
));
globalContainer.bind(TYPES.retrievePage).toFunction(retrievePage);
globalContainer.bind<typeof logger>(TYPES.logger).toConstantValue(logger);
globalContainer.bind(TYPES.MONGODB_URI).toConstantValue(process.env.MONGODB_URI || 'mongodb://localhost/token-gating');
globalContainer.bind(TYPES.MONGODB_POOL_SIZE).toConstantValue(parseInt(process.env.MONGODB_POOL_SIZE || '5', 10));
globalContainer.bind(TYPES.ENV).toConstantValue(process.env.ENV || 'staging');

globalContainer.bind(TYPES.CLIENT_ID).toConstantValue(process.env.CLIENT_ID || '942737934946287617');
globalContainer.bind(TYPES.CLIENT_SECRET).toConstantValue(process.env.CLIENT_SECRET || 'GqNj6xXF_g3IWxyVLwVBkTugW5w0Ycw_');
globalContainer.bind(TYPES.REDIRECT_URI).toConstantValue(process.env.REDIRECT_URI || 'http://localhost:3000/api/discord');
globalContainer.bind(TYPES.BOT_TOKEN).toConstantValue(process.env.BOT_TOKEN);

globalContainer.bind(TYPES.mongoose)
  .toDynamicValue(async (ctx) => mongoose.createConnection(ctx.container.get(TYPES.MONGODB_URI), {
    readPreference: 'secondaryPreferred',
    socketTimeoutMS: ms('5m'),
    maxPoolSize: ctx.container.get(TYPES.MONGODB_POOL_SIZE),
  })).inSingletonScope();

const container = Container.merge(
  globalContainer,
  apiContainer,
  accountContainer,
  projectContainer,
  workerContainer,
  discordContainer,
) as Container;

export { container };
