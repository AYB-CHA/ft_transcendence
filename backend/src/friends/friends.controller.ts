import { FriendsService } from './friends.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
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
  constructor(private readonly friends: FriendsService) {}

  @Get()
  findFriends(@Req() request: RequestType) {
    return this.friends.findFriends(request.userPayload.sub);
  }

  @Post('/add/:id')
  addFriend(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) targetId: string,
  ) {
    return this.friends.addFriend(request.userPayload.sub, targetId);
  }

  @Delete('/remove/:id')
  removeFriend(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) requestId: string,
  ) {
    return this.friends.removeFriend(request.userPayload.sub, requestId);
  }

  @Get('/requests')
  findFriendRequests(@Req() request: RequestType) {
    return this.friends.findFriendRequests(request.userPayload.sub);
  }

  @Delete('/requests/cancel/:id')
  cancelRequest(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) requestId: string,
  ) {
    const userId = request.userPayload.sub;
    return this.friends.cancelRequest(userId, requestId);
  }

  @Patch('/requests/accept/:id')
  acceptRequest(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) requestId: string,
  ) {
    const userId = request.userPayload.sub;
    return this.friends.acceptRequest(userId, requestId);
  }

  @Delete('/requests/reject/:id')
  rejectRequest(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) requestId: string,
  ) {
    const userId = request.userPayload.sub;
    return this.friends.rejectRequest(userId, requestId);
  }
}
