import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class DirectMessageService {
  constructor(private readonly prisma: PrismaService) {}
  async sendDm(threadId: string, senderId: string, text: string) {
    return this.prisma.dMMessage.create({
      data: { text, senderId, threadId },
      select: {
        id: true,
        thread: { select: { initiatorId: true, participantId: true } },
      },
    });
  }
  async getUserThreads(userId: string) {
    const data = await this.prisma.dMThread.findMany({
      where: { OR: [{ initiatorId: userId }, { participantId: userId }] },
      select: {
        id: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { text: true },
        },
        initiator: {
          select: { id: true, avatar: true, fullName: true, username: true },
        },
        participant: {
          select: { id: true, avatar: true, fullName: true, username: true },
        },
      },
    });
    return data.map((thread) => {
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
    try {
      const { id } = await this.prisma.dMThread.findFirstOrThrow({
        where: {
          id: threadId,
          OR: [{ initiatorId: userId }, { participantId: userId }],
        },
        select: { id: true },
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
    throw new UnauthorizedException();
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
    } catch (error) {
      console.log(error);
    }
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
