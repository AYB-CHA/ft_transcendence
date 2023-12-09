import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/config')
  config() {
    return this.gameService.config();
  }

  @UseGuards(AuthGuard)
  @Get('/user/:id')
  findAll(@Param('id') id: string) {
    return this.gameService.findAll(id);
  }

  @Get('/:id')
  getMatch(@Param('id') id: string) {
    return this.gameService.getMatch(id);
  }

  @Get('/admin/state')
  getState() {
    return this.gameService.getState();
  }
}
