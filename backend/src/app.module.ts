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

@Module({
  imports: [
    AuthModule,
    FriendsModule,
    NotificationModule,
    UserModule,
    ChatModule,
    PrismaModule,
    UploadModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().get<string>('JWT_SECRET_TOKE'),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
