import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async unlockAchievement(my_user: User, achievementName: string) {
    const my_achievement = await this.prisma.achievement.findUnique({
      where: { name: achievementName },
    });
    await this.prisma.achievementProgress
      .findMany({
        where: { user: my_user, achievement: { name: achievementName } },
      })
      .then((ap) => {
        if (!ap) {
          this.prisma.achievementProgress
            .create({
              data: {
                userId: my_user.id,
                achievementName: achievementName,
                progress: my_achievement.maxProgress,
                obtainedAt: new Date(),
                obtained: true,
              },
            })
            .catch((error) => {
              console.log('error creating achievement progress', error);
            });
        }
      })
      .catch((error) => {
        console.log('error finding achievement progress', error);
      });
  }

  async getUsersAchievements(userId: string) {
    //const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return this.prisma.achievement
      .findMany({
        include: {
          users: {
            where: { userId: userId },
          },
        },
      })
      .then((achievements) => {
        console.log(achievements);
        return achievements.map(({ users, ...ach }) => ({
          ...ach,
          obtained: users.length > 0,
        }));
      });
  }
  //I guess we need to add a function to check on the progress of an achievement
}
