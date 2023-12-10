import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { compareSync, hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserSearchEntity } from './types.d';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

import * as Cookie from 'cookie';
import * as se from 'speakeasy';

import {
  RegisterUserType,
  UpdateUserPasswordType,
  UpdateUserType,
} from 'src/types';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async enable2FA(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { is2FAEnabled: true },
    });
  }

  async disable2FA(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { is2FAEnabled: false },
    });
  }

  async blockUser(my_id: string, id: string) {
    try {
      if (my_id === id) throw new Error();
      await this.prisma.userBlock.create({
        data: { blocked_id: id, blocker_id: my_id },
      });
      return '';
    } catch (error) {}
    throw new BadRequestException(["you can't block user."]);
  }

  async usersHasBlockRelation(userTwoId: string, userOneId: string) {
    return (
      (await this.prisma.userBlock.count({
        where: {
          OR: [
            { AND: [{ blocked_id: userOneId }, { blocker_id: userTwoId }] },
            { AND: [{ blocked_id: userTwoId }, { blocker_id: userOneId }] },
          ],
        },
      })) > 0
    );
  }

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
    this.validateUniquenessOfEmailAndUsername(
      userData.username,
      userData.email,
      id,
    );
    if (userData.password && (await this.findUser(id)).passwordless) {
      throw new BadRequestException(["you can't change your password"]);
    }

    if (
      userData.password &&
      userData.password !== userData.passwordConfirmation
    )
      throw new BadRequestException(['confirmation password does not match']);
    const password = userData.password
      ? hashSync(userData?.password, 10)
      : null;
    return await this.prisma.user.update({
      where: { id },
      data: {
        avatar: userData.avatar,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        password,
      },
    });
  }

  async createUser(userData: RegisterUserType) {
    // bcrypt
    const password = userData.password
      ? hashSync(userData?.password, 10)
      : null;

    const avatar = new URL(this.config.get('BACKEND_BASEURL'));

    avatar.pathname = `/public/avatars/${Math.ceil(Math.random() * 7)}.png`;

    const secret = se.generateSecret({});

    return (
      await this.prisma.user.create({
        data: {
          fullName: userData.fullName,
          email: userData.email,
          username: userData.username,
          password,
          avatar: avatar.toString(),
          optSecret: secret.hex,
          authProvider: userData.authProvider,
          githubId:
            userData.authProvider === 'GITHUB'
              ? userData.providerId
              : undefined,
          ftId:
            userData.authProvider === 'FT' ? userData.providerId : undefined,
        },
        select: {
          id: true,
        },
      })
    ).id;
  }

  async updatePassword(userPasswords: UpdateUserPasswordType, id: string) {
    const user = await this.findUser(id, true);
    if (compareSync(userPasswords.oldPassword, user.password)) {
      await this.prisma.user.update({
        where: { id },
        data: { password: hashSync(userPasswords.newPassword, 10) },
      });
      return;
    }
    throw new BadRequestException(["old password doesn't match you password"]);
  }

  async findUser(id: string, includeSensitives: boolean = false) {
    const data = await this.prisma.user.findFirstOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        avatar: true,
        email: true,
        fullName: true,
        username: true,
        password: includeSensitives,
        optSecret: includeSensitives,
        is2FAEnabled: true,
        authProvider: true,
        status: true,
      },
    });

    return {
      id: data.id,
      avatar: data.avatar,
      email: data.email,
      fullName: data.fullName,
      username: data.username,
      password: data.password ?? undefined,
      otpSecret: data.optSecret ?? undefined,
      passwordless: data.authProvider != null,
      is2FAEnabled: data.is2FAEnabled,
      status: data.status,
    };
  }

  findUserByEmailOrUsername(usernameOrEmail: string) {
    return this.prisma.user.findFirstOrThrow({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
    });
  }

  findUserByUsername(username: string) {
    return this.prisma.user.findFirstOrThrow({ where: { username } });
  }

  findUserByProviderId(id: number, provider: 'FT' | 'GITHUB') {
    return this.prisma.user.findFirstOrThrow({
      where: {
        authProvider: provider,
        githubId: provider === 'GITHUB' ? id : undefined,
        ftId: provider === 'FT' ? id : undefined,
      },
    });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findFirstOrThrow({ where: { email } });
  }

  findUsers(
    userId: string,
    query: string | undefined = '',
  ): Promise<UserSearchEntity> {
    return this.prisma.$queryRaw`
      SELECT
        u. "id", f. "id" "requestId", u. "username", u. "avatar", u. "fullName",
        CASE
          WHEN f. "senderId" = ${userId} OR f. "receiverId" = ${userId} THEN
            CASE
              WHEN f. "isPending" = FALSE THEN 'FRIEND'
              ELSE CASE
                WHEN f. "receiverId" = ${userId} THEN 'PENDING-RECEIVER'
                WHEN f. "senderId"   = ${userId} THEN 'PENDING-SENDER'
              END
            END
          ELSE 'NONE'
        END "status"
      FROM "User" u
      LEFT JOIN "Friendship" f ON (u.id = f. "senderId" OR u.id = f. "receiverId") AND
          (f. "senderId" = ${userId} OR f. "receiverId" = ${userId})
      WHERE u.id != ${userId}
        AND (u."fullName" ILIKE '%' || ${query} || '%'
          OR u."username" ILIKE '%' || ${query} || '%')
      LIMIT 10
    `;
  }

  getClientIdFromSocket(client: Socket) {
    const authHeader = Cookie.parse(client.handshake.headers.cookie ?? '');
    try {
      const payload = this.jwtService.verify(authHeader.access_token ?? '');
      return payload.sub as string;
    } catch {}
    return null;
  }
}
