import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { FriendsUpdateSender } from './friends.sender';

@WebSocketGateway({
  namespace: '/friends',
  cors: { origin: process.env['FRONTEND_BASEURL'] },
})
export class FriendsGateway {
  @WebSocketServer()
  private server: Server;

  constructor(notifier: FriendsUpdateSender) {
    notifier.listen((users) => users.forEach((user) => this.server.emit(user)));
  }
}
