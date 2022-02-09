import { ParameterizedContext } from 'koa';
import { AccountRole, AdminAccount } from '../../types';
import BasicDataLoader from '../../library/basic-data-loader';
import { AccountService } from '../account';

export const TYPES = {
  PORT: Symbol.for('PORT'),
  ORIGIN_URL: Symbol.for('ORIGIN_URL'),
  SCHEME: Symbol.for('SCHEME'),
  BASE_URL: Symbol.for('BASE_URL'),
};

export type Context = ParameterizedContext<{
  claims: {
    sub: string;
    role: AccountRole;
  };
  user: Pick<AdminAccount, 'id' | 'role'>;
}> & {
  services: {
    account: AccountService;
  };
  config: {
    MONGODB_URI: string,
    JWT_SECRET: Buffer;
    BASE_URL: string;
    ENV: 'staging' | 'production'
  };
  fetch: typeof fetch,
  loaders: {
    adminAccount: BasicDataLoader<AdminAccount>;
  }
};
