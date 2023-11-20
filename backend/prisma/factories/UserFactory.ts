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
      password: hashSync('password', 10),
      avatar: faker.image.avatar(),
      optSecret: 'TODO',
    };
  }
}