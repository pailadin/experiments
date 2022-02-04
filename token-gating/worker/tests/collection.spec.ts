/* eslint-disable no-console */

import CollectionRepository from '../src/repositories/collection';
import { Context as FixtureContext, setup, teardown } from './helpers/fixture';
import { TYPES } from '../src/types';
import { container } from '../inversify.config';
import ObjectId, { ObjectType } from '../library/object-id';
import { CollectionStatus } from '../types';

type Context = FixtureContext & {
  collectionRepository: CollectionRepository;
};

describe('Collection Test', () => {
  beforeEach(async function (this: Context) {
    await setup.apply(this);

    this.collectionRepository = container.get<CollectionRepository>(TYPES.CollectionRepository);
  });

  afterEach(async function (this: Context) {
    await Promise.all([
      this.collectionRepository.clear(),
    ]);
    await teardown.apply(this);
  });

  test('should get list of collection', async function (this: Context) {
    await this.collectionRepository.create({
      id: ObjectId.generate(ObjectType.COLLECTION).buffer,
      data: {
        contractAddress: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
        status: CollectionStatus.INITIALIZING,
      },
    });

    const collections = await this.collectionRepository.find({
      filter: {},
    });

    expect(collections.length).toEqual(1);
  });

  test('should get list of events', async function (this: Context) {
    const id = ObjectId.generate(ObjectType.COLLECTION).buffer;
    await this.collectionRepository.create({
      id,
      data: {
        contractAddress: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
        status: CollectionStatus.INITIALIZING,
      },
    });

    await this.workerService.syncCollection(id);
    expect(true);
  });
});
