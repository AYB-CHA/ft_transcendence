import { NotificationSender } from 'src/notification/notification.sender';
import { FriendsUpdateSender } from './friends.sender';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FriendsService } from './friends.service';
import { RequestType } from 'src/types';

import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('/user/friends')
export class FriendsController {
  constructor(
    private readonly friends: FriendsService,
    private readonly notifier: FriendsUpdateSender,
    private readonly notification: NotificationSender,
  ) {}

  @Get()
  findFriends(@Req() request: RequestType) {
    return this.friends.findFriends(request.user.id);
  }

  @Get('/requests')
  findFriendRequests(@Req() request: RequestType) {
    return this.friends.findFriendRequests(request.user.id);
  }

  @Post('/add/:id')
  async addFriend(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) targetId: string,
  ) {
    const result = await this.friends.addFriend(
      request.user.id,
      targetId,
    );
    this.notifier.notify([request.user.id, targetId]);
    this.notification.notify({
      senderId: request.user.id,
      link: '/dashboard/friends?tab=friend-requests',
      type: 'FRIEND_INVITAION',
      receiverId: targetId,
    });
    return result;
  }

  @Delete('/remove/:id')
  async removeFriend(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) requestId: string,
  ) {
    const result = await this.friends.removeFriend(
      request.user.id,
      requestId,
    );
    this.notifier.notify([result.senderId, result.receiverId]);
    return result;
  }

  @Delete('/requests/cancel/:id')
  async cancelRequest(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) requestId: string,
  ) {
    const result = await this.friends.cancelRequest(
      request.user.id,
      requestId,
    );
    this.notifier.notify([result.senderId, result.receiverId]);
    return result;
  }

  @Patch('/requests/accept/:id')
  async acceptRequest(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) requestId: string,
  ) {
    const result = await this.friends.acceptRequest(
      request.user.id,
      requestId,
    );
    this.notifier.notify([result.senderId, result.receiverId]);
    return result;
  }

  @Delete('/requests/reject/:id')
  async rejectRequest(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) requestId: string,
  ) {
    const result = await this.friends.rejectRequest(
      request.user.id,
      requestId,
    );
    this.notifier.notify([result.senderId, result.receiverId]);
    return result;
  }
}
