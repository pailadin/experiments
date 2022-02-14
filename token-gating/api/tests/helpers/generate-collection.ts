import faker from 'faker';
import ObjectId, { ObjectType } from '../../library/object-id';

export default function () {
  return {
    id: ObjectId.generate(ObjectType.COLLECTION).buffer,
    contractAddress: faker.finance.ethereumAddress(),
  };
}
