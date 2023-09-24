import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { newChannelType } from '../types';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async createChannel(channelData: newChannelType, userId: string) {
    return await this.prisma.channel.create({
      data: {
        ...channelData,
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
    return await channels;
  }
}
