import { injectable, inject } from 'inversify';
import AdminAccountController from './controllers/admin-account';
import { TYPES } from './types';

@injectable()
export class AccountService {
  @inject(TYPES.AdminAccountController) readonly adminAccountController!: AdminAccountController;
}
