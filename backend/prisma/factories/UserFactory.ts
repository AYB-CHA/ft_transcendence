import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { Factory } from './Factory';

export default class UserFactory extends Factory<Prisma.UserCreateInput> {
  generate() {
    return this.fakeUser();
  }

  private fakeUser(): Prisma.UserCreateInput {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      id: faker.string.uuid(),
      fullName: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      username: faker.internet.userName({ firstName, lastName }),
      avatar: faker.image.avatar(),
      optSecret:
        '24785432585e344763615a26492a3f6645374d7371507a4d735e716e4e666b57',
    };
  }
}
