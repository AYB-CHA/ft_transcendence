import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ChannelType, newChannelType } from '../types';
import { Channel } from '@prisma/client';
import { hashSync } from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async createChannel(channelData: newChannelType, userId: string) {
    console.log(channelData);
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
