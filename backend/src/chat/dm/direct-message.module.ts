import { Module } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { DirectMessageController } from './direct-message.controller';
import { DirectMessageGateway } from './direct-message.gateway';

@Module({
  providers: [DirectMessageService, DirectMessageGateway],
  controllers: [DirectMessageController],
  imports: [],
  exports: [],
})
export class DirectMessageModule {}
