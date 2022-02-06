/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */

import R from 'ramda';
import sinon from 'sinon';
import CollectionRepository from '../src/repositories/collection';
import { Context as FixtureContext, setup, teardown } from './helpers/fixture';
import { TYPES } from '../src/types';
import { TYPES as GLOBAL_TYPES, CollectionStatus, Collection } from '../types';
import { container } from '../inversify.config';
import ObjectId, { ObjectType } from '../library/object-id';
import { WorkerService } from '../src/index';
import OwnershipRepository from '../src/repositories/ownership';

type Context = FixtureContext & {
  collectionRepository: CollectionRepository;
  ownershipRepository: OwnershipRepository;
  workerService: WorkerService;
  contractAddress: string;
  collection: Collection;

};

describe('Worker Service Test', () => {
  beforeEach(async function (this: Context) {
    await setup.apply(this);

    this.collectionRepository = container.get<CollectionRepository>(TYPES.CollectionRepository);
    this.ownershipRepository = container.get<OwnershipRepository>(TYPES.OwnershipRepository);
    this.workerService = container.get<WorkerService>(GLOBAL_TYPES.WorkerService);
    this.contractAddress = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

    this.collection = await this.collectionRepository.create({
      id: ObjectId.generate(ObjectType.COLLECTION).buffer,
      data: {
        contractAddress: this.contractAddress,
        status: CollectionStatus.INITIALIZING,
      },
    });
  });

  afterEach(async function (this: Context) {
    await Promise.all([
      this.collectionRepository.clear(),
      this.ownershipRepository.clear(),
    ]);
    await teardown.apply(this);
  });

  test('should update the ownership table by single contract address', async function (this: Context) {
    await this.workerService.syncCollection(this.collection.id, true, 100);

    const etherScanData = await this.workerService.getEtherScanData({
      contractAddress: this.contractAddress,
      batchSize: 1,
    });

    const latestEvent = R.head(etherScanData.result);

    const collectionData = await this.collectionRepository.findOne({
      id: this.collection.id,
    });

    expect(latestEvent).toBeDefined();
    expect(collectionData).not.toBeNull();
    expect(latestEvent!.blockNumber).toEqual(collectionData!.blockNumber);
  });

  test('should emit OnEvent when retrieving events ', async function (this: Context) {
    const spy = sinon.spy();

    this.workerService.eventHandler.on('OnEvent', spy);

    await this.workerService.syncCollection(this.collection.id, true, 1);

    const etherScanData = await this.workerService.getEtherScanData({
      contractAddress: this.contractAddress,
      batchSize: 1,
    });

    const latestEvent = R.head(etherScanData.result);

    const collectionData = await this.collectionRepository.findOne({
      id: this.collection.id,
    });

    expect(latestEvent).toBeDefined();
    expect(collectionData).not.toBeNull();
    expect(spy.calledOnce).toEqual(true);
  });

  test('should update the owner of token ', async function (this: Context) {
    const etherScanData = await this.workerService.getEtherScanData({
      contractAddress: this.contractAddress,
      batchSize: 1,
    });

    const latestEvent = R.head(etherScanData.result)!;

    const previousOwner = await this.ownershipRepository.create({
      id: ObjectId.generate(ObjectType.OWNERSHIP).buffer,
      data: {
        blockNumber: '0',
        owner: '0xddb783186cebd9eb000af5e6a01ffde9ea6e5356',
        collectionID: this.collection.id,
        tokenID: latestEvent.tokenID,
      },
    });

    await this.workerService.syncCollection(this.collection.id, true, 1);

    const currentOwner = await this.ownershipRepository.findOne({
      filter: {
        tokenID: previousOwner.tokenID,
      },
    });

    expect(currentOwner!.owner).not.toEqual(previousOwner.owner);
  });
});
