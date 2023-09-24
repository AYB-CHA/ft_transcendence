import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { newChannelType } from '../types';
import { hashSync } from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async joinChannel(channelId: string, userId: string) {
    try {
      await this.prisma.channel.findFirstOrThrow({
        where: {
          id: channelId,
          type: 'PUBLIC',
        },
      });

      return await this.prisma.channelsOnUsers.create({
        data: {
          channelId,
          userId,
        },
        select: {
          Channel: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(['no channel found']);
    }
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
        password: hashSync(channelData.password, 10),
        type: channelData.type.toUpperCase() as
          | 'PUBLIC'
          | 'PRIVATE'
          | 'PROTECTED',
        users: {
          create: { userId, role: 'ADMINISTRATOR' },
        },
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
