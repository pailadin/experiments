import { injectable, inject } from 'inversify';
import R from 'ramda';
import {
  ID,
  AccountRole,
  AdminAccount,
  InputData,
} from '../../../types';
import { FilterQuery } from '../../../library/repository';
import { TYPES } from '../types';
import AdminAccountRepository from '../repositories/admin-account';

@injectable()
export default class AdminAccountController {
  @inject(TYPES.AdminAccountRepository) private readonly adminAccountRepository!: AdminAccountRepository;

  async adminAccountExists(params: { filter: FilterQuery<AdminAccount> }): Promise<Boolean> {
    return this.adminAccountRepository.exists(params);
  }

  async createAdminAccount(params: { id: ID } & InputData<Pick<AdminAccount, 'emailAddress'>>): Promise<AdminAccount> {
    const document = await this.adminAccountRepository.create(params);

    return {
      ...document,
      role: AccountRole.ADMIN,
    };
  }

  async findOneAdminAccount(params: { id: ID }): Promise<AdminAccount | null>;

  async findOneAdminAccount(params: { filter: FilterQuery<AdminAccount> }): Promise<AdminAccount | null>;

  async findOneAdminAccount(params: { id?: ID; filter?: FilterQuery<AdminAccount> }): Promise<AdminAccount | null> {
    const document = await this.adminAccountRepository.findOne(params as never);

    if (!document) {
      return null;
    }

    return {
      ...document,
      role: AccountRole.ADMIN,
    };
  }

  async findAdminAccount(
    params: { filter: FilterQuery<AdminAccount> },
  ): Promise<AdminAccount[]> {
    return R.map((item) => ({
      ...item,
      role: AccountRole.ADMIN,
    }), await this.adminAccountRepository.find(params));
  }
}
