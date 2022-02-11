import { injectable, inject } from 'inversify';
import AdminAccountController from './controllers/admin-account';
import HolderAccountController from './controllers/holder-account';
import { TYPES } from './types';

@injectable()
export class AccountService {
  @inject(TYPES.AdminAccountController) readonly adminAccountController!: AdminAccountController;

  @inject(TYPES.HolderAccountController) readonly holderAccountController!: HolderAccountController;
}
