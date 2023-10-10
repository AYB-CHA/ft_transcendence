import { JwtService } from '@nestjs/jwt';
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

@WebSocketGateway({ namespace: '/dm', cors: true })
export class DirectMessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  clients: { id: string; socket: Socket }[] = [];

  constructor(
    private readonly jwtService: JwtService,
    private readonly dmService: DirectMessageService,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const id = this.getClientId(client);
    console.log('CONNECTION >>>>>>>>>>>>');
    this.clients.push({ id, socket: client });
    this.dmService.makeOnline(id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('DISCONNECTION <<<<<<<<<<<<');
    const id = this.getClientId(client);
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
    const senderId = this.getClientId(client);
    const threadData = await this.dmService.sendDm(
      data.threadId,
      senderId,
      data.text,
    );
    // let recipientId = threadData.thread.participantId;
    // if (recipientId === senderId) recipientId = threadData.thread.initiatorId;
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
  }
  getClientId(client: Socket) {
    const authHeader: string | null =
      client.handshake.headers.authorization?.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(authHeader ?? '');
      return payload.sub as string;
    } catch (error) {}
    return null;
  }
}
