import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { newChannelType } from '../types';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async joinPrivateChannel(
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
    });
    return (await channels).map((channel) => {
      delete channel['password'];
      delete channel['createdAt'];
      delete channel['updatedAt'];
      return channel;
    });
  }
}
