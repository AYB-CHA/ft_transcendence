import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';

import RegisterDto from './dtos/register.dto';
import { AuthService } from './auth.service';
import LoginDto from './dtos/login.dto';
import { FtStrategy } from './OAuth/ft.strategy';
import { RegisterUserType } from 'src/types';
import { GithubStrategy } from './OAuth/github.strategy';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly ftStrategy: FtStrategy,
    private readonly githubStrategy: GithubStrategy,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.registerNewUser({
      email: body.email,
      fullName: body.fullName,
      password: body.password,
      username: body.username,
    });
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.loginUser({
      password: body.password,
      usernameOrEmail: body.usernameOrEmail,
    });
  }

  @Get('login/:provider')
  loginFt(@Param('provider') provider: 'github' | 'ft') {
    let url: string;
    if (provider === 'ft') url = this.ftStrategy.getRedirectUrl();
    else if (provider === 'github') url = this.githubStrategy.getRedirectUrl();
    else throw new BadRequestException();
    return {
      redirectUrl: url,
    };
  }

  @Get('/back')
  @Redirect()
  async backUrl(
    @Query('code') code: string | null,
    @Query('provider') provider?: 'ft' | 'github',
  ) {
    if (!code || (provider != 'ft' && provider != 'github'))
      throw new UnauthorizedException();
    let userData: RegisterUserType;
    if (provider === 'ft') {
      userData = await this.ftStrategy.getUserData(code);
      return this.authService.logInUserOAuth(userData, 'FT');
    }
    if (provider === 'github') {
      userData = await this.githubStrategy.getUserData(code);
      return this.authService.logInUserOAuth(userData, 'GITHUB');
    }
  }
}
