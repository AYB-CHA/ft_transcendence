import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationSender } from './notification.sender';
import { Global, Module } from '@nestjs/common';
@Global()
@Module({
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationSender, NotificationService],
  exports: [NotificationSender],
})
export class NotificationModule {}
