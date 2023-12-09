import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  namespace: 'game',
  cors: { origin: process.env.FRONTEND_URL },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
  ) {}

  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
    const userId = this.gameService.getClientIdFromSocket(client);
    if (!userId) {
      console.error('No user found, please login first.');
      client.disconnect();
      return;
    }
    console.log('User connected: ', userId);
    this.gameService.addClient(userId, client);
  }

  handleDisconnect(client: Socket) {
    this.gameService.removeClient(client.id);
  }

  @SubscribeMessage('MOVE_PADDLE')
  create(@MessageBody() dto: CreateGameDto, @ConnectedSocket() client: Socket) {
    const data = this.gameService.movePaddle(client.id, dto.dir);
    if (!data) return;
    for (const user of data.users) {
      this.server.to(user).emit(data.event, {
        y: data.y,
      });
    }
  }

  @SubscribeMessage('START_GAME')
  async startGame(@ConnectedSocket() client: Socket) {
    client.emit('GAME_STATUS', {});
    this.gameService.eventLoop(client.id, ({ event, data, users }) => {
      users.forEach((user: string) => {
        this.server.to(user).emit(event, data);
        //client.emit(event, data);
      });
    });
  }

  @SubscribeMessage('UPDATE_BALL')
  updateBall(@ConnectedSocket() client: Socket) {
    const ball = this.gameService.getBall(client.id);
    client.emit('MOVE_BALL', ball);
  }

  @SubscribeMessage('DEBUG')
  update() {
    return this.gameService.debug();
  }

  @SubscribeMessage('PEERING')
  async peer(@ConnectedSocket() client: Socket) {
    client.emit('PEERING', 'PENDING');
    const userId = GameService.findUser(client.id);
    if (!userId) {
      console.error('No user found, please login first.');
      client.disconnect();
    }
    const match = await this.gameService.peer(client, userId);
    const opponent = await this.userService.findUser(
      match.initiator.id === userId ? match.participant.id : match.initiator.id,
    );
    if (match)
      client.emit('LAUNCH_GAME', {
        matchId: match.id,
        isInitiator: match.initiator.id === userId,
        opponent,
      });
  }
}
