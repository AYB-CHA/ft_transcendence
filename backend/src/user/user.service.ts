import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
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
import { User } from '@prisma/client';

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

    return await this.prisma.user.update({
      where: { id },
      data: {
        avatar: userData.avatar,
        fullName: userData.fullName,
      },
    });
  }

  async createUser(userData: RegisterUserType): Promise<User> {
    const secret = se.generateSecret({});

    return await this.prisma.user.create({
      data: {
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar,
        optSecret: secret.hex,
      },
    });
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
        optSecret: includeSensitives,
        is2FAEnabled: true,
        status: true,
      },
    });

    return {
      id: data.id,
      avatar: data.avatar,
      email: data.email,
      fullName: data.fullName,
      username: data.username,
      otpSecret: data.optSecret ?? undefined,
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

  findUserByEmail(email: string) {
    return this.prisma.user.findFirstOrThrow({ where: { email } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    return user;
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
    const cookies = Cookie.parse(client.handshake.headers.cookie ?? '');

    console.log(cookies);
    

    try {
      const payload = this.jwtService.verify(cookies.accessToken ?? '');
      
      
      return payload.id as string;
    } catch {}
    return null;
  }
  async check2FA(id: string, tfaCode: string) {
    const user = await this.findUser(id, true);

    console.log(user.otpSecret, tfaCode, 'check2FA');
    if (
      !se.totp.verify({
        secret: user.otpSecret,
        token: tfaCode,
        encoding: 'hex',
      })
    ) {
      throw new BadRequestException(['invalid 2FA code']);
    }
  }
}
