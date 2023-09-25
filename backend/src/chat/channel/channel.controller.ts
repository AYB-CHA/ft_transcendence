import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
  @Post('/join/:id')
  joinChannel(@Req() request: RequestType, @Param('id') channelId: string) {
    return this.channelService.joinChannel(channelId, request.userPayload.sub);
  }

  @UseGuards(AuthGuard)
  @Post('/protected/join/:id')
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
}
