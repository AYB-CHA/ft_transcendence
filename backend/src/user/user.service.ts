import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { RegisterUserType } from 'src/types';
import { genSaltSync, hashSync } from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userData: RegisterUserType) {
    // bcrypt
    const password = userData.password
      ? hashSync(userData?.password, 10)
      : null;

    const avatar = `${Math.ceil(Math.random() * 7)}.png`;

    return (
      await this.prisma.user.create({
        data: {
          ...userData,
          password,
          avatar,
        },
        select: {
          id: true,
        },
      })
    ).id;
  }

  async findUser(id: string) {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async findUserByEmailOrUsername(usernameOrEmail: string) {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
    });
  }

  async findUserByUsername(username: string) {
    return await this.prisma.user.findFirstOrThrow({ where: { username } });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findFirstOrThrow({ where: { email } });
  }
}
