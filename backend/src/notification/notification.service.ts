import { PrismaService } from 'src/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { Notification } from './types';
import { $Enums } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  storeNotification(notification: Notification) {
    return this.prisma.notification.create({
      data: notification,
    });
  }

  async findNotifications(userId: string) {
    const result = await this.prisma.notification.findMany({
      where: { receiverId: userId },
      select: {
        type: true,
        link: true,
        read: true,
        id: true,
        sender: { select: { fullName: true } },
        channel: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    function generateDescription(
      type: $Enums.NotificationType,
      sender: string,
      channelId?: string,
    ) {
      switch (type) {
        case 'CHANNEL_INVITATION':
          return `${sender} sent you a request to join ${channelId} Channel.`;
        case 'FRIEND_INVITAION':
          return `${sender} sent you a friend request.`;
        case 'GAME_INVITAION':
          return `${sender} challenges you for a game. Be brave and accept the challenge.`;
      }
    }

    return Promise.all(
      result.map((item) => {
        return {
          ...item,
          sender: undefined,
          channel: undefined,
          description: generateDescription(
            item.type,
            item.sender.fullName,
            item.channel?.name,
          ),
        };
      }),
    );
  }

  clearNotifications(userId: string) {
    return this.prisma.notification.deleteMany({
      where: { receiverId: userId },
    });
  }

  markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.update({
      where: { receiverId: userId, id: notificationId },
      data: { read: true },
    });
  }
}
