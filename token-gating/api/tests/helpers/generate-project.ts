import faker from 'faker';
import ObjectId, { ObjectType } from '../../library/object-id';

export default function () {
  return {
    id: ObjectId.generate(ObjectType.PROJECT).buffer,
    name: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    contractAddress: faker.finance.ethereumAddress(),
    discordGuild: `93569146681729437${faker.datatype.number({
      min: 1,
      max: 9,
    })}`,
    discordChannel: `93957398493935619${faker.datatype.number({
      min: 1,
      max: 9,
    })}`,
    discordRoleId: `93957398493935619${faker.datatype.number({
      min: 1,
      max: 9,
    })}`,
    adminAccount: ObjectId.generate(ObjectType.ADMIN).buffer,
  };
}
