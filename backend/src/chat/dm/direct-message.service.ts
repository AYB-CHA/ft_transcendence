import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DirectMessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getUserThreadsUnreadMessages(id: string) {
    return {
      count: await this.prisma.dMMessage.count({
        where: {
          thread: { OR: [{ initiatorId: id }, { participantId: id }] },
          NOT: [{ senderId: id }],
          seen: false,
        },
      }),
    };
  }

  async makeOnline(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { status: 'ONLINE' },
      select: { id: true },
    });
  }

  async makeOffline(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { status: 'OFFLINE' },
      select: { id: true },
    });
  }

  async sendDm(threadId: string, senderId: string, text: string) {
    if (
      await this.userService.usersHasBlockRelation(
        senderId,
        await this.getThreadOtherUserId(threadId, senderId),
      )
    )
      throw new Error();

    return await this.prisma.dMMessage.create({
      data: { text, senderId, threadId },
      select: {
        id: true,
        thread: { select: { initiatorId: true, participantId: true } },
      },
    });
  }

  async getThreadOtherUser(userOneId: string, threadId: string) {
    return await this.prisma.user.findFirst({
      where: { id: await this.getThreadOtherUserId(threadId, userOneId) },
      select: { id: true, avatar: true, username: true, fullName: true },
    });
  }

  async getThreadOtherUserId(threadId: string, userOneId: string) {
    try {
      const thread = await this.prisma.dMThread.findFirstOrThrow({
        where: { id: threadId },
      });
      let userId = thread.initiatorId;
      if (userId === userOneId) userId = thread.participantId;
      return userId;
    } catch {
      throw new NotFoundException();
    }
  }

  async getUserThreads(userId: string) {
    const data = await this.prisma.dMThread.findMany({
      where: {
        OR: [{ initiatorId: userId }, { participantId: userId }],
      },
      select: {
        id: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { text: true, createdAt: true },
        },
        initiator: {
          select: {
            id: true,
            avatar: true,
            fullName: true,
            username: true,
            status: true,
          },
        },
        participant: {
          select: {
            id: true,
            avatar: true,
            fullName: true,
            username: true,
            status: true,
          },
        },
      },
    });
    data.sort((thread1, thread2) => {
      return (
        (thread2.messages[0]?.createdAt.getTime() ?? 0) -
        (thread1.messages[0]?.createdAt.getTime() ?? 0)
      );
    });
    return data
      .filter((thread) => thread.messages.length)
      .map((thread) => {
        let user = thread.initiator;
        if (user.id === userId) user = thread.participant;
        let message = null;
        if (thread.messages.length) message = thread.messages[0];
        return {
          id: thread.id,
          user,
          message,
        };
      });
  }

  async getOldMessages(userId: string, threadId: string) {
    if (
      await this.userService.usersHasBlockRelation(
        userId,
        await this.getThreadOtherUserId(threadId, userId),
      )
    )
      throw new ForbiddenException();

    try {
      const { id } = await this.prisma.dMThread.findFirstOrThrow({
        where: {
          id: threadId,
          OR: [{ initiatorId: userId }, { participantId: userId }],
        },
        select: { id: true },
      });
      await this.prisma.dMMessage.updateMany({
        where: {
          threadId,
          NOT: [{ senderId: userId }],
        },
        data: { seen: true },
      });
      return await this.prisma.dMMessage.findMany({
        where: { threadId: id },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          senderId: true,
          text: true,
        },
      });
    } catch (error) {}
    throw new ForbiddenException();
  }

  async getThreadID(initiatorId: string, userId: string) {
    try {
      const thread = await this.prisma.dMThread.findFirstOrThrow({
        where: {
          OR: [
            { initiatorId, participantId: userId },
            { initiatorId: userId, participantId: initiatorId },
          ],
        },
        select: { id: true },
      });
      return { id: thread.id };
    } catch {}

    return {
      id: (
        await this.prisma.dMThread.create({
          data: { initiatorId, participantId: userId },
          select: { id: true },
        })
      ).id,
    };
  }
}
