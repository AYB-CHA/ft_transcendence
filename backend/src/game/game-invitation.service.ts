import { Injectable } from '@nestjs/common';
import { NotificationSender } from 'src/notification/notification.sender';
import { UserService } from 'src/user/user.service';

export type GameInvitation = {
  senderId: string;
  receiverId: string;
  pending: boolean;
};

@Injectable()
export class GameInvitationService {
  private invites: GameInvitation[] = [];

  constructor(
    private readonly notifier: NotificationSender,
    private readonly userService: UserService,
  ) {}

  removeInvitation(userId: string) {
    this.invites = this.invites.filter((item) => item.senderId !== userId);
  }

  removeAnyInvitation(userId: string) {
    this.invites = this.invites.filter(
      (item) => item.senderId !== userId && item.receiverId !== userId,
    );
  }

  findReceiverInvitation(userId: string) {
    return this.invites.find(
      (invite) => invite.receiverId === userId,
    );
  }

  async findInvitation(userId: string) {
    const invite = this.invites.find(
      (invite) => invite.senderId === userId || invite.receiverId === userId,
    );
    if (!invite) return { success: false, message: 'invitation not found' };

    const opponentId =
      invite.receiverId === userId ? invite.senderId : invite.receiverId;

    const opponent = await this.userService.findUser(opponentId);

    return {
      pending: invite.pending,
      success: true,
      opponent,
    };
  }

  async invite(body: Omit<GameInvitation, 'pending'>) {
    const existingInvitation = this.invites.find(
      (invite) =>
        invite.senderId === body.senderId ||
        invite.receiverId === body.senderId ||
        invite.senderId === body.receiverId ||
        invite.receiverId === body.receiverId,
    );

    if (existingInvitation !== undefined) {
      return { success: false };
    }

    this.invites.push({ ...body, pending: true });

    this.notifier.notify({
      ...body,
      type: 'GAME_INVITAION',
      link: '/dashboard/games/match',
    });

    console.log('invitation added from', body.senderId);

    return { success: true };
  }
}
