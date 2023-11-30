import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post('unlock')
  unlockAchievement(@Body() body) {
    return this.achievementsService.unlockAchievement(
      body.user,
      body.achievementName,
    );
  }

  @Get('user/:id')
  getUsersAchievements(@Param('id') id: string) {
    return this.achievementsService.getUsersAchievements(id);
  }
}
