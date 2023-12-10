import {
  GameInvitation,
  GameInvitationService,
} from './game-invitation.service';

import { Body, Controller, Delete, Param, Post } from '@nestjs/common';

@Controller('game-invite')
export class GameInvitationController {
  constructor(private readonly gameInvitationService: GameInvitationService) {}

  @Post()
  invite(@Body() invite: Omit<GameInvitation, 'pending'>) {
    return this.gameInvitationService.invite(invite);
  }

  @Delete('/:id')
  removeInvite(@Param('id') userId: string) {
    return this.gameInvitationService.findAnyInvitation(userId);
  }
}
