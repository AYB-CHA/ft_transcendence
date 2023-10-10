import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestType } from 'src/types';
import { ChannelService } from './channel.service';
import NewChannelDto from './dtos/new-channel.dto';
import JoinProtectedChannelDto from './dtos/join-protected-channel.dto';

@Controller('/chat/channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}
  @UseGuards(AuthGuard)
  @Get()
  async getChannels(@Req() request: RequestType) {
    return await this.channelService.getUserChannels(request.userPayload.sub);
  }

  @UseGuards(AuthGuard)
  @Get('discover')
  async discover(
    @Req() request: RequestType,
    @Query('search') searchParam: string = '',
  ) {
    return await this.channelService.discoverNewChannels(
      request.userPayload.sub,
      searchParam,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getChannelData(@Req() request: RequestType, @Param('id') id: string) {
    return await this.channelService.getChannelData(
      id,
      request.userPayload.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:id/members')
  async getChannelUsers(@Req() request: RequestType, @Param('id') id: string) {
    return await this.channelService.getChannelUsers(
      request.userPayload.sub,
      id,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/join/:id')
  joinChannel(@Req() request: RequestType, @Param('id') channelId: string) {
    return this.channelService.joinChannel(channelId, request.userPayload.sub);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/leave')
  leaveChannel(@Req() request: RequestType, @Param('id') channelId: string) {
    return this.channelService.leaveChannel(channelId, request.userPayload.sub);
  }

  @UseGuards(AuthGuard)
  @Post('/protected/:id/join')
  joinProtectedChannel(
    @Req() request: RequestType,
    @Param('id') channelId: string,
    @Body() body: JoinProtectedChannelDto,
  ) {
    return this.channelService.joinProtectedChannel(
      channelId,
      body.password,
      request.userPayload.sub,
    );
  }

  @UseGuards(AuthGuard)
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
      request.userPayload.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteChannel(@Param('id') id: string, @Req() request: RequestType) {
    return this.channelService.deleteChannelByOwner(
      id,
      request.userPayload.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/messages/:id')
  getMessages(@Param('id') channelId: string, @Req() request: RequestType) {
    return this.channelService.getMessagesOnChannel(
      channelId,
      request.userPayload.sub,
    );
  }
}
