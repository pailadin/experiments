import faker from 'faker';
import ObjectId, { ObjectType } from '../../library/object-id';
import { ID } from '../../types';

export default function (collectionID: ID, tokenId?: string | null) {
  return {
    id: ObjectId.generate(ObjectType.OWNERSHIP).buffer,
    collectionID,
    tokenID: tokenId || faker.datatype.number({
      min: 0,
      max: 1000,
    }).toString(),
    owner: faker.finance.ethereumAddress(),
    timestamp: faker.datatype.number({
      min: 0,
      max: 1000,
    }),
  };
}
