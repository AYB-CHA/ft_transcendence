import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { newChannelType } from '../types';
import { compareSync, hashSync } from 'bcrypt';
import { ChannelType, ChannelUserRole } from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}
  async upgradeUserGrade(
    channelId: string,
    adminId: string,
    userId: string,
    grade: ChannelUserRole,
  ) {
    try {
      await this.prisma.channelsOnUsers.findFirstOrThrow({
        where: {
          channelId,
          userId: adminId,
          role: 'ADMINISTRATOR',
        },
        select: { userId: true },
      });
      await this.prisma.channelsOnUsers.update({
        where: {
          userId_channelId: { channelId, userId },
          role: { not: 'ADMINISTRATOR' },
        },
        data: {
          role: grade,
        },
      });
      return;
    } catch (error) {
      console.error(error);
    }
    throw new UnauthorizedException(["you can't upgrade the user grade"]);
  }
  async kickUserFromChannel(
    channelId: string,
    userId: string,
    adminId: string,
  ) {
    try {
      const { role } = await this.prisma.channelsOnUsers.findFirstOrThrow({
        where: { userId: adminId, channelId, role: { not: 'MEMBER' } },
        select: { role: true },
      });
      await this.prisma.channelsOnUsers.delete({
        where: {
          userId_channelId: { channelId, userId },
          role:
            role === 'ADMINISTRATOR'
              ? { in: ['MEMBER', 'MODERATOR'] }
              : 'MEMBER',
        },
      });
      return;
    } catch (error) {
      console.error(error);
    }
    throw new UnauthorizedException(["you can't kick user"]);
  }
  async deleteChannelByOwner(channelId: string, userId: string) {
    try {
      await this.prisma.channel.delete({
        where: {
          id: channelId,
          users: {
            some: {
              userId,
              role: 'ADMINISTRATOR',
            },
          },
        },
      });
      return;
    } catch (error) {
      console.error(error);
    }
    throw new UnauthorizedException(["You can't delete this channel"]);
  }

  async joinProtectedChannel(
    channelId: string,
    password: string,
    userId: string,
  ) {
    let channel: { password: string } | null = null;
    try {
      channel = await this.prisma.channel.findFirstOrThrow({
        where: {
          id: channelId,
          type: 'PROTECTED',
          users: { none: { userId } },
        },
        select: {
          password: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(['no channel found']);
    }

    if (compareSync(password, channel.password)) {
      await this.prisma.channelsOnUsers.create({
        data: {
          channelId,
          userId,
        },
      });
      return;
    }
    throw new BadRequestException(['the password is wrong']);
  }

  async joinChannel(channelId: string, userId: string) {
    if (
      (await this.prisma.channel.count({
        where: {
          id: channelId,
          type: 'PUBLIC',
          users: { none: { userId } },
        },
      })) > 0
    ) {
      await this.prisma.channelsOnUsers.create({
        data: {
          channelId,
          userId,
        },
      });
      return;
    }
    throw new BadRequestException(['no channel found']);
  }

  async leaveChannel(channelId: string, userId: string) {
    try {
      await this.prisma.channelsOnUsers.delete({
        where: {
          userId_channelId: {
            channelId,
            userId,
          },
        },
      });
      return;
    } catch (error) {
      console.error(error);
    }
    throw new BadRequestException(['no channel found']);
  }

  async createChannel(channelData: newChannelType, userId: string) {
    if (channelData.type === 'protected' && !channelData.password)
      throw new BadRequestException([
        'protected channels should have a password',
      ]);
    if (channelData.type !== 'protected' && channelData.password)
      throw new BadRequestException([
        "public and protected channels can't have a password",
      ]);

    return await this.prisma.channel.create({
      data: {
        ...channelData,
        password: channelData.password
          ? hashSync(channelData.password, 10)
          : null,
        type: channelData.type.toUpperCase() as
          | 'PUBLIC'
          | 'PRIVATE'
          | 'PROTECTED',
        users: {
          create: { userId, role: 'ADMINISTRATOR' },
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        type: true,
      },
    });
  }

  async getUserChannels(userId: string) {
    const channels = this.prisma.channel.findMany({
      where: { users: { some: { User: { id: userId } } } },
      select: {
        id: true,
        type: true,
        avatar: true,
        name: true,
        topic: true,
        users: { where: { role: 'ADMINISTRATOR' }, select: { userId: true } },
      },
    });
    return (await channels).map((channel) => {
      const newChannel: {
        id: string;
        name: string;
        avatar: string;
        topic: string;
        type: ChannelType;
        isAdmin?: boolean;
        users: {
          userId: string;
        }[];
      } = channel;

      if (newChannel.users.filter((user) => user.userId === userId).length > 0)
        newChannel.isAdmin = true;
      delete newChannel['users'];
      return newChannel;
    });
  }
}
