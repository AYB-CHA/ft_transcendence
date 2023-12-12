import {
  GameInvitation,
  GameInvitationService,
} from './game-invitation.service';

import { Body, Controller, Post } from '@nestjs/common';

@Controller('game-invite')
export class GameInvitationController {
  constructor(private readonly gameInvitationService: GameInvitationService) {}

  @Post()
  invite(@Body() invite: Omit<GameInvitation, 'pending'>) {
    return this.gameInvitationService.invite(invite);
  }
}
