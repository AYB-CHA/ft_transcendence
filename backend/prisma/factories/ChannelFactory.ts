import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { Factory } from './Factory';

import { hashSync } from 'bcrypt';

export default class ChannelFactory extends Factory<Prisma.ChannelCreateInput> {
  generate() {
    return this.fakeChannel();
  }

  private fakeChannel(): Prisma.ChannelCreateInput {
    const channelType = ['PRIVATE', 'PUBLIC', 'PROTECTED'].at(
      Math.floor(Math.random() * 3),
    ) as 'PRIVATE' | 'PUBLIC' | 'PROTECTED';

    return {
      id: faker.string.uuid(),
      avatar: faker.image.avatar(),
      name: faker.company.name(),
      topic: faker.word.words(4),
      type: channelType,
      password: channelType === 'PROTECTED' ? hashSync('password', 10) : null,
    };
  }
}
