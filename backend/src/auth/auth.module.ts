import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtStrategy } from './OAuth/ft.strategy';
import { GithubStrategy } from './OAuth/github.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FtStrategy, GithubStrategy],
  exports: [],
})
export class AuthModule {}
