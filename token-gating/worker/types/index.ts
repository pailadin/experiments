export * from './node';
export * from './etherscan';
export * from './event';
export * from './collection';
export * from './ownership';

export const TYPES = {
  MONGODB_URI: Symbol.for('MONGODB_URI'),
  MONGODB_POOL_SIZE: Symbol.for('MONGODB_POOL_SIZE'),
  ENV: Symbol.for('ENV'),
  WorkerService: Symbol.for('WorkerService'),
  mongoose: Symbol.for('mongoose'),
  logger: Symbol.for('logger'),
};

export type InputData<TInput> = { data: TInput };
