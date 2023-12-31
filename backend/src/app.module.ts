import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './db/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { UploadModule } from './upload/upload.module';
import { FriendsModule } from './friends/friends.module';
import { NotificationModule } from './notification/notification.module';
import { GameModule } from './game/game.module';
import { AchievementsModule } from './achievements/achievements.module';

@Module({
  imports: [
    AuthModule,
    FriendsModule,
    NotificationModule,
    UserModule,
    ChatModule,
    PrismaModule,
    UploadModule,
    GameModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AchievementsModule,
    JwtModule.register({
      global: true,
      secret: new ConfigService().get<string>('JWT_SECRET_TOKEN'),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
