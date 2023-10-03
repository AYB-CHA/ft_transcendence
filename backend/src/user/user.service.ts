import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import {
  RegisterUserType,
  UpdateUserPasswordType,
  UpdateUserType,
} from 'src/types';
import { compareSync, hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
  // the third param is provided if you want to exclude a user from the check (useful in the updates).
  async validateUniquenessOfEmailAndUsername(
    username: string,
    email: string,
    userId?: string,
  ) {
    if (
      (await this.prisma.user.count({
        where: { AND: [{ username }, { NOT: [{ id: userId }] }] },
      })) > 0
    )
      throw new BadRequestException(['username is already taken']);
    if (
      (await this.prisma.user.count({
        where: { AND: [{ email }, { NOT: [{ id: userId }] }] },
      })) > 0
    )
      throw new BadRequestException([
        'an account with the same email is already registered',
      ]);
  }

  async updateUser(id: string, userData: UpdateUserType) {
    return await this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async createUser(userData: RegisterUserType) {
    // bcrypt
    const password = userData.password
      ? hashSync(userData?.password, 10)
      : null;

    const avatar = new URL(this.config.get('BACKEND_BASEURL'));

    avatar.pathname = `/public/avatars/${Math.ceil(Math.random() * 7)}.png`;

    return (
      await this.prisma.user.create({
        data: {
          ...userData,
          password,
          avatar: avatar.toString(),
        },
        select: {
          id: true,
        },
      })
    ).id;
  }

  async updatePassword(userPasswords: UpdateUserPasswordType, id: string) {
    const user = await this.findUser(id);
    if (compareSync(userPasswords.oldPassword, user.password)) {
      await this.prisma.user.update({
        where: { id },
        data: { password: hashSync(userPasswords.newPassword, 10) },
      });
      return;
    }
    throw new BadRequestException(["old password doesn't match you password"]);
  }

  async findUser(id: string) {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        avatar: true,
        email: true,
        fullName: true,
        username: true,
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
