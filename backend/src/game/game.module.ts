import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';

@Module({
  controllers: [GameController],
  providers: [GameGateway, GameService],
})
export class GameModule {}
