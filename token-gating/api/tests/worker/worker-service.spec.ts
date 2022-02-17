/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */

import R from 'ramda';
import CollectionRepository from '../../services/worker/src/repositories/collection';
import { Context as FixtureContext, setup, teardown } from '../helpers/fixture';
import { TYPES } from '../../services/worker/src/types';
import { TYPES as GLOBAL_TYPES, CollectionStatus, Collection } from '../../types';
import { container } from '../../inversify.config';
import ObjectId, { ObjectType } from '../../library/object-id';
import { WorkerService } from '../../services/worker/src/index';
import OwnershipRepository from '../../services/worker/src/repositories/ownership';
import generateOwnership from '../helpers/generate-ownership';
import { sortByTokenID } from '../helpers/utils';
import { getEtherScanData } from '../helpers/etherscan';

type Context = FixtureContext & {
  collectionRepository: CollectionRepository;
  ownershipRepository: OwnershipRepository;
  workerService: WorkerService;
  contractAddress: string;
  collection: Collection;
  apiKey: string;
  blockSize: number;

};

describe.only('Worker Service Test', () => {
  beforeEach(async function (this: Context) {
    await setup.apply(this);

    this.apiKey = container.get<string>(TYPES.ETHERSCAN_KEY);
    this.collectionRepository = container.get<CollectionRepository>(TYPES.CollectionRepository);
    this.ownershipRepository = container.get<OwnershipRepository>(TYPES.OwnershipRepository);
    this.workerService = container.get<WorkerService>(GLOBAL_TYPES.WorkerService);
    this.contractAddress = '0x06012c8cf97bead5deae237070f9587f8e7a266d';
    this.blockSize = 1000;
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

  test('should update the owner of token ', async function (this: Context) {
    this.blockSize = 1;

    const etherScanData = await getEtherScanData({
      contractAddress: this.contractAddress,
      apikey: this.apiKey,
      blockSize: this.blockSize,
    });

    const previousOwnership = generateOwnership(this.collection.id, R.head(etherScanData.result)!.tokenID);

    await this.workerService.syncCollection({
      collection: this.collection.id,
      priority: true,
      blockSize: this.blockSize,
    });

    const currentOwnership = await this.ownershipRepository.findOne({
      filter: {
        tokenID: previousOwnership.tokenID,
      },
    });

    expect(currentOwnership).not.toBeNull();
    expect(currentOwnership!.tokenID).toEqual(previousOwnership.tokenID);
    expect(currentOwnership!.owner).not.toEqual(previousOwnership.owner);
  });

  test('should update ownership table', async function (this: Context) {
    this.blockSize = 10;
    const etherScanData = await getEtherScanData({
      contractAddress: this.contractAddress,
      apikey: this.apiKey,
      blockSize: this.blockSize,
    });

    const transactions = R.uniqBy(R.prop('tokenID'))(etherScanData.result);

    let currentOwnerships = await Promise.all(R.times(async (index) => {
      const ownership = generateOwnership(this.collection.id);
      return this.ownershipRepository.create({
        id: ownership.id,
        data: {
          ...ownership,
          tokenID: transactions[index].tokenID,
        },
      });
    })(transactions.length));

    currentOwnerships = currentOwnerships.sort(sortByTokenID);

    const idList = currentOwnerships.map((ownership) => ownership.id);

    await this.workerService.syncCollection({
      collection: this.collection.id,
      priority: true,
      blockSize: this.blockSize,
    });

    let updatedOwnerships = await this.ownershipRepository.find({
      filter: {
        id: {
          $in: idList,
        },
      },
    });

    updatedOwnerships = updatedOwnerships.sort(sortByTokenID);

    updatedOwnerships = updatedOwnerships.filter((ownership, index) => {
      const previousOwnership = currentOwnerships[index];

      if (ownership.tokenID === previousOwnership.tokenID && ownership.owner !== previousOwnership.owner) { return true; }

      return false;
    });

    expect(currentOwnerships.length).toEqual(updatedOwnerships.length);
  });

  test.skip('should update the collection by single contract address', async function (this: Context) {
    this.blockSize = 10000;
    await this.workerService.syncCollection({
      collection: this.collection.id,
      priority: true,
      blockSize: this.blockSize,
    });

    const etherScanData = await getEtherScanData({
      contractAddress: this.contractAddress,
      apikey: this.apiKey,
      blockSize: this.blockSize,
    });

    const latestEvent = R.head(etherScanData.result);

    const collectionData = await this.collectionRepository.findOne({
      id: this.collection.id,
    });

    expect(latestEvent).toBeDefined();
    expect(collectionData).not.toBeNull();
    expect(collectionData!.blockNumber).toEqual(latestEvent!.blockNumber);
    expect(collectionData!.status).toEqual(CollectionStatus.UPDATED);
  });
});
