import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestType } from 'src/types';

import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('/user/notifications')
export class NotificationController {
  constructor(private readonly notifications: NotificationService) {}

  @Get()
  findNotifications(@Req() req: RequestType) {
    return this.notifications.findNotifications(req.userPayload.sub);
  }

  @Delete()
  clearNotifications(@Req() req: RequestType) {
    return this.notifications.clearNotifications(req.userPayload.sub);
  }

  @Patch(':id')
  markAsRead(@Req() req: RequestType, @Param('id') id: string) {
    return this.notifications.markAsRead(req.userPayload.sub, id);
  }
}
