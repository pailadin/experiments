import 'reflect-metadata';
import { Container } from 'inversify';
import cryptoRandomString from 'crypto-random-string';
import { TYPES as GLOBAL_TYPES } from '../../types';
import { TYPES } from './types';
import { AccountService } from './index';

import AdminAccountRepository from './repositories/admin-account';
import AdminAccountController from './controllers/admin-account';

const container = new Container();

container.bind(GLOBAL_TYPES.cryptoRandomString).toFunction(cryptoRandomString);
container.bind(TYPES.AdminAccountRepository).to(AdminAccountRepository).inSingletonScope();
container.bind(TYPES.AdminAccountController).to(AdminAccountController).inSingletonScope();

container.bind(GLOBAL_TYPES.AccountService).to(AccountService).inSingletonScope();

export { container };
