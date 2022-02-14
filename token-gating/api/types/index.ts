export * from './node';
export * from './account';
export * from './collection';
export * from './ownership';
export * from './admin-account';
export * from './project';

export const TYPES = {
  MONGODB_URI: Symbol.for('MONGODB_URI'),
  JWT_SECRET: Symbol.for('JWT_SECRET'),
  MONGODB_POOL_SIZE: Symbol.for('MONGODB_POOL_SIZE'),
  ENV: Symbol.for('ENV'),
  mongoose: Symbol.for('mongoose'),
  fetch: Symbol.for('fetch'),
  logger: Symbol.for('logger'),
  cryptoRandomString: Symbol.for('cryptoRandomString'),
  ApiService: Symbol.for('ApiService'),
  AccountService: Symbol.for('AccountService'),
  ProjectService: Symbol.for('ProjectService'),
  retrievePage: Symbol.for('retrievePage'),
};

export type Connection<TNode> = {
  totalCount?: number;
  edges: {
    node: TNode;
    cursor: Buffer;
  }[];
  pageInfo: {
    startCursor: Buffer | null;
    endCursor: Buffer | null;
    hasNextPage: boolean;
  }
};

export type InputData<TInput> = { data: TInput };
