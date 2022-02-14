import { injectable, inject } from 'inversify';
import R from 'ramda';
import {
  ID,
  AccountRole,
  HolderAccount,
  InputData,
} from '../../../types';
import { FilterQuery } from '../../../library/repository';
import { TYPES } from '../types';
import HolderAccountRepository from '../repositories/holder-account';

@injectable()
export default class HolderAccountController {
  @inject(TYPES.HolderAccountRepository) private readonly holderAccountRepository!: HolderAccountRepository;

  async holderAccountExists(params: { filter: FilterQuery<HolderAccount> }): Promise<Boolean> {
    return this.holderAccountRepository.exists(params);
  }

  async createHolderAccount(params: { id: ID } & InputData<Pick<HolderAccount,
    'ethereumAddress' |'discordId'>>): Promise<HolderAccount> {
    const document = await this.holderAccountRepository.create(params);

    return {
      ...document,
      role: AccountRole.HOLDER,
    };
  }

  async findOneHolderAccount(params: { id: ID }): Promise<HolderAccount | null>;

  async findOneHolderAccount(params: { filter: FilterQuery<HolderAccount> }): Promise<HolderAccount | null>;

  async findOneHolderAccount(params: { id?: ID; filter?: FilterQuery<HolderAccount> }): Promise<HolderAccount | null> {
    const document = await this.holderAccountRepository.findOne(params as never);

    if (!document) {
      return null;
    }

    return {
      ...document,
      role: AccountRole.HOLDER,
    };
  }

  async findHolderAccount(
    params: { filter: FilterQuery<HolderAccount> },
  ): Promise<HolderAccount[]> {
    return R.map((item) => ({
      ...item,
      role: AccountRole.HOLDER,
    }), await this.holderAccountRepository.find(params));
  }
}
