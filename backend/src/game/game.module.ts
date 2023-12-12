import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameQueue } from './queue.game';
import { MatchService } from './match.service';
import { GameInvitationController } from './game-invitation.controller';
import { GameInvitationGateway } from './game-invitation.gateway';
import { GameInvitationService } from './game-invitation.service';

@Module({
  controllers: [GameController, GameInvitationController],
  providers: [GameGateway, GameService, GameQueue, MatchService, GameInvitationGateway, GameInvitationService],
})
export class GameModule {}
