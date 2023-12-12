import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { GameInvitationService } from './game-invitation.service';

import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';

@WebSocketGateway({
  namespace: 'game-match',
  cors: { origin: process.env['FRONTEND_BASEURL'] },
})
export class GameInvitationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameInvitationService: GameInvitationService,
    private readonly gameService: GameService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    const userId = this.userService.getClientIdFromSocket(client);
    if (!userId) return;

    const opponents = this.gameInvitationService.findReceiverInvitation(userId);
    if (!opponents) return;

    const match = await this.gameService.createMatch(opponents.senderId, opponents.receiverId);

    this.server.emit(opponents.receiverId, { matchId: match.id });
    this.server.emit(opponents.senderId, { matchId: match.id });

    // this.gameInvitationService.removeAnyInvitation(userId);
  }

  handleDisconnect(client: Socket) {
    const userId = this.userService.getClientIdFromSocket(client);
    if (userId) this.gameInvitationService.removeInvitation(userId);
  }

  @SubscribeMessage('find-invite')
  async findInvitation(@ConnectedSocket() client: Socket) {
    const userId = this.userService.getClientIdFromSocket(client);
    if (!userId) return { success: false, message: 'user not found' };
    return this.gameInvitationService.findInvitation(userId);
  }
}
