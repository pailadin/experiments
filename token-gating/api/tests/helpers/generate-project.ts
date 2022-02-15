import faker from 'faker';
import { DateTime } from 'luxon';
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
    discordAccessToken: faker.git.commitSha(),
    discordRefreshToken: faker.git.commitSha(),
    discordTokenExpiration: DateTime.now().plus({ days: 1 }).toMillis().toString(),
    adminAccount: ObjectId.generate(ObjectType.ADMIN).buffer,
  };
}
