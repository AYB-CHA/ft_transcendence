import { Module } from '@nestjs/common';
import { ChannelModule } from './channel/channel.module';
import { DirectMessageModule } from './dm/direct-message.module';

@Module({
  imports: [ChannelModule, DirectMessageModule],
  providers: [],
  exports: [],
  controllers: [],
})
export class ChatModule {}
