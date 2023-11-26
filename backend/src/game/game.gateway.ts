import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL },
})
export class GameGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('MOVE_PADDLE_LEFT')
  create(
    @MessageBody() createGameDto: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('MOVE_PADDLE_LEFT', this.gameService.movePaddle(createGameDto));
  }

  @SubscribeMessage('START_GAME')
  async startGame(@ConnectedSocket() client: Socket) {
    client.emit('GAME_STATUS', this.gameService.resetGame(1));
    client.emit('START_ROUND', { count: 3 });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.gameService.eventLoop(({ event, data }) => {
      client.emit(event, data);
    });
  }

  @SubscribeMessage('UPDATE_BALL')
  updateBall(@ConnectedSocket() client: Socket) {
    const ball = this.gameService.getBall();
    client.emit('MOVE_BALL', ball);
  }

  @SubscribeMessage('DEBUG')
  update() {
    return this.gameService.debug();
  }
}
