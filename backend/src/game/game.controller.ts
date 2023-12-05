import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/config')
  config() {
    return this.gameService.config();
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }
}
