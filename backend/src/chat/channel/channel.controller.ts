import NewChannelDto from './dtos/new-channel.dto';
import JoinProtectedChannelDto from './dtos/join-protected-channel.dto';
import UpdateChannelDto from './dtos/update-channel.dto';

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestType } from 'src/types';
import { ChannelService } from './channel.service';
import { NotificationSender } from 'src/notification/notification.sender';
import { ConfigService } from '@nestjs/config';

@UseGuards(AuthGuard)
@Controller('/chat/channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly notifier: NotificationSender,
    private readonly configService: ConfigService,
  ) {}
  @Get()
  async getChannels(@Req() request: RequestType) {
    return await this.channelService.getUserChannels(request.user.id);
  }

  @Get('discover')
  async discover(
    @Req() request: RequestType,
    @Query('search') searchParam: string = '',
  ) {
    return await this.channelService.discoverNewChannels(
      request.user.id,
      searchParam,
    );
  }

  @Get('/:id')
  async getChannelData(@Req() request: RequestType, @Param('id') id: string) {
    return await this.channelService.getChannelData(
      id,
      request.user.id,
    );
  }

  @Get('/:id/members')
  async getChannelUsers(@Req() request: RequestType, @Param('id') id: string) {
    return await this.channelService.getChannelUsers(
      request.user.id,
      id,
    );
  }

  @Post('/join/:id')
  joinChannel(@Req() request: RequestType, @Param('id') channelId: string) {
    return this.channelService.joinChannel(channelId, request.user.id);
  }

  @Delete('/:id/leave')
  leaveChannel(@Req() request: RequestType, @Param('id') channelId: string) {
    return this.channelService.leaveChannel(channelId, request.user.id);
  }

  @Post('/protected/:id/join')
  joinProtectedChannel(
    @Req() request: RequestType,
    @Param('id') channelId: string,
    @Body() body: JoinProtectedChannelDto,
  ) {
    return this.channelService.joinProtectedChannel(
      channelId,
      body.password,
      request.user.id,
    );
  }

  @Get('/private/:id/invite')
  inviteToPrivateChannelSearch(
    @Param('id', ParseUUIDPipe) channelId: string,
    @Query('q') query: string | undefined = '',
  ) {
    return this.channelService.inviteToPrivateChannelSearch(channelId, query);
  }

  @Get('/private/:id/channel')
  getInvitationChannelPublicData(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) invitationId: string,
  ) {
    return this.channelService.getInvitationChannelPublicData(
      request.user.id,
      invitationId,
    );
  }

  @Post('/private/:id/join')
  joinPrivateChannel(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) invitationId: string,
  ) {
    return this.channelService.joinPrivateChannel(
      request.user.id,
      invitationId,
    );
  }

  @Post('/private/:id/invite')
  async inviteToPrivateChannel(
    @Req() request: RequestType,
    @Param('id', ParseUUIDPipe) channelId: string,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
    if (!userId) throw new BadRequestException();

    const data = await this.channelService.inviteToPrivateChannel(
      request.user.id,
      userId,
      channelId,
    );

    // const url = new URL(this.configService.get<string>('FRONTEND_BASEURL'));
    // url.pathname = `/dashboard/invited/channel/${data.id}`;

    this.notifier.notify({
      // link: url.toString(),
      link: `/dashboard/invited/channel/${data.id}`,
      receiverId: userId,
      senderId: request.user.id,
      type: 'CHANNEL_INVITATION',
      channelId: channelId,
    });

    return data;
  }

  @Post()
  async createChannel(
    @Req() request: RequestType,
    @Body() body: NewChannelDto,
  ) {
    return this.channelService.createChannel(
      {
        name: body.name,
        avatar: body.avatar,
        type: body.type,
        topic: body.topic,
        password: body.password ?? null,
      },
      request.user.id,
    );
  }

  @Delete('/:id')
  deleteChannel(@Param('id') id: string, @Req() request: RequestType) {
    return this.channelService.deleteChannelByOwner(
      id,
      request.user.id,
    );
  }

  @Get('/messages/:id')
  getMessages(@Param('id') channelId: string, @Req() request: RequestType) {
    return this.channelService.getMessagesOnChannel(
      channelId,
      request.user.id,
    );
  }

  @Put(`/update/:id`)
  async updateChannel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateChannelDto,
    @Req() request: RequestType,
  ) {
    return await this.channelService.updateChannel(
      id,
      body,
      request.user.id,
    );
  }
}
