import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { FriendEntity } from './types';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async addFriend(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new ForbiddenException("You can't send yourself an invitation");
    }

    const friendshipExists = await this.prisma.friendship.count({
      where: {
        OR: [
          { senderId: userId, receiverId: targetId },
          { senderId: targetId, receiverId: userId },
        ],
      },
    });

    if (friendshipExists > 0) {
      throw new ForbiddenException('An invitaion or friendship already exists');
    }

    return this.prisma.friendship.create({
      data: { receiverId: targetId, senderId: userId },
    });
  }

  removeFriend(userId: string, requestId: string) {
    return this.prisma.friendship.delete({
      where: {
        id: requestId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });
  }

  findFriends(id: string): Promise<FriendEntity> {
    return this.prisma.$queryRaw`
      SELECT f.id, u.id "userId", u."username", u."fullName", u."avatar" FROM "User" u
      INNER JOIN "Friendship" f
        ON (u.id = f."senderId" OR u.id = f."receiverId")
      WHERE ((f."senderId" = ${id} AND f."receiverId" = u.id)
          OR (f."receiverId" = ${id} AND f."senderId" = u.id))
        AND f."isPending" = FALSE
    `;
  }

  findFriendRequests(id: string): Promise<FriendEntity> {
    return this.prisma.$queryRaw`
      SELECT f.id, u.id "userId", u."username", u."fullName", u."avatar" FROM "User" u
      INNER JOIN "Friendship" f ON (u.id = f."senderId")
      WHERE f."receiverId" = ${id} AND f."isPending" = TRUE
    `;
  }

  cancelRequest(userId: string, requestId: string) {
    return this.prisma.friendship.delete({
      where: { id: requestId, senderId: userId, isPending: true },
    });
  }

  rejectRequest(userId: string, requestId: string) {
    return this.prisma.friendship.delete({
      where: { id: requestId, receiverId: userId, isPending: true },
    });
  }

  acceptRequest(userId: string, requestId: string) {
    return this.prisma.friendship.update({
      where: { id: requestId, receiverId: userId, isPending: true },
      data: { isPending: false },
    });
  }
}
