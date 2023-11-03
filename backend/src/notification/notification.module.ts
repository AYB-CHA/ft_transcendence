import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationSender } from './notification.sender';
import { Module } from '@nestjs/common';

@Module({
  providers: [NotificationGateway, NotificationSender, NotificationService],
  exports: [NotificationSender],
})
export class NotificationModule {}
