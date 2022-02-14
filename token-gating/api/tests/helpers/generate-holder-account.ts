import faker from 'faker';
import ObjectId, { ObjectType } from '../../library/object-id';
import { AccountRole } from '../../types';

export default function () {
  return {
    id: ObjectId.generate(ObjectType.HOLDER).buffer,
    ethereumAddress: faker.finance.ethereumAddress(),
    discordId: `93569146681729437${faker.datatype.number({
      min: 1,
      max: 9,
    })}`,
    role: AccountRole.HOLDER,
  };
}
