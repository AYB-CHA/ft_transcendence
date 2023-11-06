import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { NotificationSender } from './notification.sender';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/notification',
  cors: { origin: process.env['FRONTEND_BASEURL'] },
})
export class NotificationGateway {
  @WebSocketServer()
  private server: Server;

  constructor(service: NotificationService, sender: NotificationSender) {
    sender.listen(async (value) => {
      await service.storeNotification(value);
      this.server.emit(value.receiverId);
    });
  }
}
