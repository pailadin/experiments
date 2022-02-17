import { injectable, inject } from 'inversify';
import R from 'ramda';
import {
  ID,
  Ownership,
  InputData,
} from '../../../../types';
import { FilterQuery } from '../../../../library/repository';
import { TYPES } from '../types';
import OwnershipRepository from '../repositories/ownership';

@injectable()
export default class OwnershipController {
  @inject(TYPES.OwnershipRepository) private readonly ownershipRepository!: OwnershipRepository;

  async ownershipExists(params: { filter: FilterQuery<Ownership> }): Promise<Boolean> {
    return this.ownershipRepository.exists(params);
  }

  async createOwnership(params: { id: ID } & InputData<Pick<Ownership, 'collectionID' | 'tokenID' |
  'owner' | 'timestamp'>>): Promise<Ownership> {
    const document = await this.ownershipRepository.create(params);

    return {
      ...document,
    };
  }

  async findOneOwnership(params: { id: ID }): Promise<Ownership | null>;

  async findOneOwnership(params: { filter: FilterQuery<Ownership> }): Promise<Ownership | null>;

  async findOneOwnership(params: { id?: ID; filter?: FilterQuery<Ownership> }): Promise<Ownership | null> {
    const document = await this.ownershipRepository.findOne(params as never);

    if (!document) {
      return null;
    }

    return {
      ...document,
    };
  }

  async bulkWrite(instructions: Record<string, unknown>[]): Promise<unknown> {
    const model = await this.ownershipRepository.model;

    return model.bulkWrite(instructions);
  }

  async findOwnerships(
    params: { filter: FilterQuery<Ownership> },
  ): Promise<Ownership[]> {
    return R.map((item) => ({
      ...item,
    }), await this.ownershipRepository.find(params));
  }
}
