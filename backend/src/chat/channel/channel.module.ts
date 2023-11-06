import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelSocketGateway } from './channel.gateway';
import { ChannelGlue } from './channel.glue';

@Module({
  providers: [ChannelService, ChannelSocketGateway, ChannelGlue],
  imports: [],
  exports: [],
  controllers: [ChannelController],
})
export class ChannelModule {}
