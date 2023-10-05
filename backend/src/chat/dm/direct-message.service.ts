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
