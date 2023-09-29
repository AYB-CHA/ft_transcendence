import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelSocketGateway } from './channel.gateway';

@Module({
  providers: [ChannelService, ChannelSocketGateway],
  imports: [],
  exports: [],
  controllers: [ChannelController],
})
export class ChannelModule {}
