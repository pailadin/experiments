import faker from 'faker';
import ObjectId, { ObjectType } from '../../library/object-id';
import { AccountRole } from '../../types';

export default function () {
  return {
    id: ObjectId.generate(ObjectType.ADMIN).buffer,
    emailAddress: faker.internet.email(),
    role: AccountRole.ADMIN,
  };
}
