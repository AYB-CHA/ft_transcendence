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
import { ChannelService } from './channel.service';

@WebSocketGateway({ namespace: 'channel', cors: true })
export class ChannelSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  clients: { id: string; socket: Socket; channelId: string }[] = [];

  constructor(
    private readonly jwtService: JwtService,
    private readonly channelService: ChannelService,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const id = this.getClientId(client);

    const channelId: string =
      (client.handshake.query?.channelId as string) ?? '';

    if (!this.channelService.isUserBelongsToChannel(id, channelId) || !id) {
      client.disconnect();
      return;
    }

    this.clients.push({ id, socket: client, channelId });
    console.log('connect: ', this.clients);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const id = this.getClientId(client);
    console.log(id);

    this.clients = this.clients.filter((c) => {
      return c.id != id;
    });
    console.log('disconnect: ', this.clients);
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

  //   @SubscribeMessage('connect')
  //   handleEvent(@MessageBody() data: string): string {
  //     console.log(data);
  //     return data;
  //   }
}
