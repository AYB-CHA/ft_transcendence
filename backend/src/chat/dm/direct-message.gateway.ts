import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { DirectMessageService } from './direct-message.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  namespace: '/dm',
  cors: { origin: process.env['FRONTEND_BASEURL'] },
})
export class DirectMessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  clients: { id: string; socket: Socket }[] = [];

  constructor(
    private readonly dmService: DirectMessageService,
    private readonly userService: UserService,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const id = this.userService.getClientIdFromSocket(client);
    if (!id) {
      client.disconnect();
      return;
    }
    this.clients.push({ id, socket: client });
    this.dmService.makeOnline(id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const id = this.userService.getClientIdFromSocket(client);
    this.clients = this.clients.filter((c) => {
      return c.id != id;
    });
    this.dmService.makeOffline(id);
  }

  @SubscribeMessage('newMessage')
  async handelNewNewMessageEvent(
    @MessageBody() data: { threadId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = this.userService.getClientIdFromSocket(client);
    try {
      const threadData = await this.dmService.sendDm(
        data.threadId,
        senderId,
        data.text,
      );
      for (const client of this.clients) {
        if (
          client.id === threadData.thread.participantId ||
          client.id === threadData.thread.initiatorId
        )
          client.socket.emit('newMessage', {
            text: data.text,
            senderId,
            id: threadData.id,
          });
      }
    } catch {}
  }
}
