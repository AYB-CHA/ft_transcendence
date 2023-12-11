import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameQueue } from './queue.game';
import { MatchService } from './match.service';

@Module({
  controllers: [GameController],
  providers: [GameGateway, GameService, GameQueue, MatchService],
})
export class GameModule {}
