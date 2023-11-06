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
import { ChannelGlue, ChannelGlueEventsType } from './channel.glue';

const muteDurationValues = {
  '10M': 10 * 60 * 1000,
  '30M': 30 * 60 * 1000,
  '1H': 1 * 60 * 60 * 1000,
  FOREVER: 3153600000 * 1000, // 100 Years
};

type muteDurations = keyof typeof muteDurationValues;

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
    private readonly channelGlue: ChannelGlue,
  ) {}

  afterInit() {
    // const __self = this;

    this.channelGlue.listen((event) => {
      const handlers: Record<ChannelGlueEventsType, () => void> = {
        CHANNEL_MEMBER_LEFT: () =>
          this.sendCriticalEvent(event.channelId, undefined, [event.userId]),
        NEW_CHANNEL_MEMBER: () => this.sendCriticalEvent(event.channelId),
        CHANNEL_EDITED: () => this.sendCriticalEvent(event.channelId),
      };
      handlers[event.name]();
    });
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const id = this.getClientId(client);

    const channelId: string =
      (client.handshake.query?.channelId as string) ?? '';

    if (
      !id &&
      !(await this.channelService.isUserBelongsToChannel(id, channelId))
    ) {
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

    if (
      !(await this.channelService.isUserBelongsToChannel(
        senderId,
        data.channelId,
      ))
    ) {
      client.disconnect();
      return;
    }

    if (await this.channelService.isUserMuted(senderId, data.channelId)) {
      console.log('cant send message your muted');
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
        !(await this.userService.usersHasBlockRelation(senderId, client.id))
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
    @MessageBody()
    data: { channelId: string; userId: string; duration: muteDurations },
    @ConnectedSocket() client: Socket,
  ) {
    if (!muteDurationValues.hasOwnProperty(data.duration)) return;

    const adminId = this.getClientId(client);

    await this.channelService.muteUserFromOnChannel(
      data.channelId,
      data.userId,
      adminId,
      muteDurationValues[data.duration],
    );

    this.sendCriticalEvent(data.channelId, [data.userId, adminId]);
  }

  sendCriticalEvent = (
    channelId: string,
    userIds?: string[],
    exceptIds?: string[],
  ) => {
    for (const client of this.clients) {
      if (
        client.channelId === channelId &&
        userIds?.includes(client.id) &&
        !exceptIds?.includes(client.id)
      )
        client.socket.emit('criticalChange');
    }
  };
}
