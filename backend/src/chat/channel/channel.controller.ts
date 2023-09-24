import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { RequestType } from 'src/types';
import { ChannelService } from './channel.service';
import NewChannelDto from './dtos/new-channel.dto';

@Controller('/chat/channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}
  @UseGuards(AuthGuard)
  @Get()
  async getChannels(@Req() request: RequestType) {
    return await this.channelService.getUserChannels(request.userPayload.sub);
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
}
