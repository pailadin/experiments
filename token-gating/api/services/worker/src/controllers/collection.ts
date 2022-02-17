import { injectable, inject } from 'inversify';
import R from 'ramda';
import {
  ID,
  Collection,
  InputData,
} from '../../../../types';
import { FilterQuery } from '../../../../library/repository';
import { TYPES } from '../types';
import CollectionRepository from '../repositories/collection';

@injectable()
export default class CollectionController {
  @inject(TYPES.CollectionRepository) private readonly collectionRepository!: CollectionRepository;

  async collectionExists(params: { filter: FilterQuery<Collection> }): Promise<Boolean> {
    return this.collectionRepository.exists(params);
  }

  async createCollection(params: { id: ID } & InputData<Pick<Collection, 'contractAddress'>>): Promise<Collection> {
    const document = await this.collectionRepository.create(params);

    return {
      ...document,
    };
  }

  async findOneCollection(params: { id: ID }): Promise<Collection | null>;

  async findOneCollection(params: { filter: FilterQuery<Collection> }): Promise<Collection | null>;

  async findOneCollection(params: { id?: ID; filter?: FilterQuery<Collection> }): Promise<Collection | null> {
    const document = await this.collectionRepository.findOne(params as never);

    if (!document) {
      return null;
    }

    return {
      ...document,
    };
  }

  async updateOneCollection(params: { filter: FilterQuery<Collection> }
    & InputData<Partial<Pick<Collection, 'contractAddress' | 'blockNumber' | 'status' >>>): Promise<Collection | null> {
    const document = await this.collectionRepository.updateOne(params);
    if (!document) return null;
    return document;
  }

  async findCollections(
    params: { filter: FilterQuery<Collection> },
  ): Promise<Collection[]> {
    return R.map((item) => ({
      ...item,
    }), await this.collectionRepository.find(params));
  }
}
