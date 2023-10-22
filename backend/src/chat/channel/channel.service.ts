import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { newChannelType } from '../types';
import { compareSync, hashSync } from 'bcrypt';
import { ChannelUserRole } from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessagesOnChannel(channelId: string, userId: string) {
    if (!(await this.isUserBelongsToChannel(userId, channelId)))
      throw new UnauthorizedException();
    return (
      await this.prisma.messages.findMany({
        where: {
          channelId,
          AND: [
            { User: { wasBlocked: { none: { blocker_id: userId } } } },
            { User: { blocked: { none: { blocked_id: userId } } } },
          ],
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 20,
      })
    ).map((message) => {
      return {
        id: message.id,
        senderId: message.userId,
        text: message.text,
      };
    });
  }
  async discoverNewChannels(userId: string, query: string) {
    const channels = await this.prisma.channel.findMany({
      where: {
        users: { none: { userId } },
        type: { not: 'PRIVATE' },
        name: { contains: query },
      },
      take: 6,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        avatar: true,
        name: true,
        type: true,
        topic: true,
        _count: { select: { users: true } },
      },
    });
    return channels.map((channel) => {
      return {
        id: channel.id,
        name: channel.name,
        avatar: channel.avatar,
        type: channel.type,
        topic: channel.topic,
        members: channel._count.users,
      };
    });
  }
  async getChannelData(id: string, myId: string) {
    try {
      const channel = await this.prisma.channel.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          topic: true,
          avatar: true,
          type: true,
          _count: { select: { users: true } },
          users: {
            where: {
              userId: myId,
            },
            select: { role: true, banedAt: true, mutedAt: true },
          },
        },
      });

      return {
        id: channel.id,
        name: channel.name,
        topic: channel.topic,
        avatar: channel.avatar,
        type: channel.type,
        members: channel._count.users,
        myRole: channel.users[0].role,
        amIBaned: channel.users[0].banedAt != null,
        amIMuted: channel.users[0].mutedAt != null,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getChannelUsers(myId: string, id: string) {
    const userData = await this.prisma.channel.findFirst({
      where: { id },
      select: {
        users: {
          where: {
            banedAt: null,
          },
          select: {
            mutedAt: true,
            role: true,
            User: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!userData) throw new NotFoundException();
    // const response: any[] = [];
    // userData.users.forEach((user) =>
    //   response.push({
    //     ...user.User,
    //     role: user.role,
    //     isMuted: user.mutedAt !== null,
    //   }),
    // );
    // console.log(response);
    return userData.users.map((user) => {
      return {
        ...user.User,
        role: user.role,
        isMuted: user.mutedAt !== null,
      };
    });
  }

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
    throw new Error("you can't upgrade the user grade");
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
    throw new UnauthorizedException(["you can't kick the user"]);
  }
  async banUserFromChannel(channelId: string, userId: string, adminId: string) {
    try {
      const { role } = await this.prisma.channelsOnUsers.findFirstOrThrow({
        where: { userId: adminId, channelId, role: { not: 'MEMBER' } },
        select: { role: true },
      });
      await this.prisma.channelsOnUsers.update({
        where: {
          userId_channelId: { channelId, userId },
          role:
            role === 'ADMINISTRATOR'
              ? { in: ['MEMBER', 'MODERATOR'] }
              : 'MEMBER',
        },
        data: { banedAt: new Date() },
      });
      return;
    } catch (error) {
      console.error(error);
    }
    throw new Error("you can't ban the user");
  }

  async muteUserFromOnChannel(
    channelId: string,
    userId: string,
    adminId: string,
  ) {
    try {
      const { role } = await this.prisma.channelsOnUsers.findFirstOrThrow({
        where: { userId: adminId, channelId, role: { not: 'MEMBER' } },
        select: { role: true },
      });
      await this.prisma.channelsOnUsers.update({
        where: {
          userId_channelId: { channelId, userId },
          role:
            role === 'ADMINISTRATOR'
              ? { in: ['MEMBER', 'MODERATOR'] }
              : 'MEMBER',
        },
        data: { mutedAt: new Date() },
      });
      return;
    } catch (error) {
      console.error(error);
    }
    throw new Error("you can't mute the user");
  }
  async unmuteUserFromOnChannel(
    channelId: string,
    userId: string,
    adminId: string,
  ) {
    try {
      const { role } = await this.prisma.channelsOnUsers.findFirstOrThrow({
        where: { userId: adminId, channelId, role: { not: 'MEMBER' } },
        select: { role: true },
      });
      await this.prisma.channelsOnUsers.update({
        where: {
          userId_channelId: { channelId, userId },
          role:
            role === 'ADMINISTRATOR'
              ? { in: ['MEMBER', 'MODERATOR'] }
              : 'MEMBER',
        },
        data: { mutedAt: null },
      });
      return;
    } catch (error) {
      console.error(error);
    }
    throw new Error("you can't mute the user");
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
    throw new UnauthorizedException(['the password is wrong']);
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
          banedAt: null,
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
    const channels = await this.prisma.channel.findMany({
      where: { users: { some: { User: { id: userId } } } },
      orderBy: { updatedAt: 'asc' },
      select: {
        id: true,
        name: true,
        topic: true,
        avatar: true,
        type: true,
        _count: { select: { users: true } },
        Messages: {
          select: {
            createdAt: true,
          },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
        users: {
          where: {
            userId,
          },
          select: { role: true, banedAt: true, mutedAt: true },
        },
      },
    });

    channels.sort((channel1, channel2) => {
      return (
        (channel2.Messages[0]?.createdAt.getTime() ?? 0) -
        (channel1.Messages[0]?.createdAt.getTime() ?? 0)
      );
    });

    return channels.map((channel) => {
      return {
        id: channel.id,
        name: channel.name,
        topic: channel.topic,
        avatar: channel.avatar,
        type: channel.type,
        members: channel._count.users,
        myRole: channel.users[0].role,
        amIBaned: channel.users[0].banedAt !== null,
        amIMuted: channel.users[0].mutedAt !== null,
      };
    });
  }

  async isUserBelongsToChannel(userId: string, channelId: string) {
    return (
      (await this.prisma.channelsOnUsers.count({
        where: { userId, channelId, banedAt: null },
      })) > 0
    );
  }

  async isUserMuted(userId: string, channelId: string) {
    return (
      (await this.prisma.channelsOnUsers.count({
        where: { userId, channelId, mutedAt: null },
      })) > 0
    );
  }

  async createMessage(userId: string, channelId: string, message: string) {
    return await this.prisma.messages.create({
      data: {
        userId,
        channelId,
        text: message,
      },
      select: {
        id: true,
      },
    });
  }
}
