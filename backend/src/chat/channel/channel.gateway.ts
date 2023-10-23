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
import { ChannelUserRole } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  namespace: 'channel',
  cors: { origin: process.env['FRONTEND_BASEURL'] },
})
export class ChannelSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  clients: { id: string; socket: Socket; channelId: string }[] = [];

  constructor(
    private readonly jwtService: JwtService,
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
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
    // console.log('connect: ', this.clients);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const id = this.getClientId(client);
    // console.log(id);

    this.clients = this.clients.filter((c) => {
      return c.id != id;
    });
    // console.log('disconnect: ', this.clients);
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

  @SubscribeMessage('newMessage')
  async handleNewMessageEvent(
    @MessageBody() data: { channelId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = this.getClientId(client);

    if (!this.channelService.isUserBelongsToChannel(senderId, data.channelId)) {
      client.disconnect();
      return;
    }

    if (!this.channelService.isUserMuted(senderId, data.channelId)) {
      return;
    }

    const messageId = (
      await this.channelService.createMessage(
        senderId,
        data.channelId,
        data.text,
      )
    ).id;
    for (const client of this.clients) {
      if (
        client.channelId === data.channelId &&
        !(await this.userService.usersHasBlockReletion(senderId, client.id))
      ) {
        client.socket.emit('newMessage', {
          text: data.text,
          senderId,
          id: messageId,
        });
      }
    }
  }
  @SubscribeMessage('upgrade')
  async handleUpgradeEvent(
    @MessageBody()
    data: { channelId: string; userId: string; grade: ChannelUserRole },
    @ConnectedSocket() client: Socket,
  ) {
    const adminId = this.getClientId(client);

    this.channelService.upgradeUserGrade(
      data.channelId,
      adminId,
      data.userId,
      data.grade,
    );

    this.sendCriticalEvent(data.channelId);
  }

  @SubscribeMessage('kickUser')
  async handleKickEvent(
    @MessageBody() data: { channelId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const adminId = this.getClientId(client);

    this.channelService.kickUserFromChannel(
      data.channelId,
      data.userId,
      adminId,
    );
    this.sendCriticalEvent(data.channelId);
  }

  @SubscribeMessage('banUser')
  async handleBanEvent(
    @MessageBody() data: { channelId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const adminId = this.getClientId(client);

    this.channelService.banUserFromChannel(
      data.channelId,
      data.userId,
      adminId,
    );
    this.sendCriticalEvent(data.channelId);
  }

  @SubscribeMessage('muteUser')
  async handleMuteEvent(
    @MessageBody() data: { channelId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const adminId = this.getClientId(client);

    this.channelService.muteUserFromOnChannel(
      data.channelId,
      data.userId,
      adminId,
    );

    this.sendCriticalEvent(data.channelId, [data.userId, adminId]);
  }

  @SubscribeMessage('unmuteUser')
  async handleUnmuteEvent(
    @MessageBody() data: { channelId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const adminId = this.getClientId(client);

    this.channelService.unmuteUserFromOnChannel(
      data.channelId,
      data.userId,
      adminId,
    );

    this.sendCriticalEvent(data.channelId, [data.userId, adminId]);
  }

  sendCriticalEvent(channelId: string, userIds?: string[]) {
    for (const client of this.clients) {
      if (
        client.channelId === channelId &&
        (userIds ? userIds.includes(client.id) : true)
      )
        client.socket.emit('criticalChange');
    }
  }
}
