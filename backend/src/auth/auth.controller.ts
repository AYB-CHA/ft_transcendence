import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import * as se from 'speakeasy';

import RegisterDto from './dtos/register.dto';
import { AuthService } from './auth.service';
import LoginDto from './dtos/login.dto';
import { FtStrategy } from './OAuth/ft.strategy';
import { RegisterUserType } from 'src/types';
import { GithubStrategy } from './OAuth/github.strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly ftStrategy: FtStrategy,
    private readonly githubStrategy: GithubStrategy,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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

  @Post('verify/2fa')
  async verify2FA(
    @Body('verificationCode') verificationCode: string | undefined,
    @Headers('authorization') authorization: string | undefined,
  ) {
    if (!verificationCode || !authorization) throw new BadRequestException();

    authorization = authorization.replace('Bearer ', '');

    let userId = '';
    try {
      const payload = await this.jwtService.verifyAsync(authorization);
      if (!payload.TOTPUnverified) throw new Error();
      const user = await this.prisma.user.findFirstOrThrow({
        where: { id: payload.sub },
      });
      if (user.optSecret === null) throw new Error();
      if (
        !se.totp.verify({
          secret: user.optSecret,
          token: verificationCode,
          encoding: 'hex',
        })
      )
        throw new Error();
      userId = payload.sub;
    } catch {
      throw new BadRequestException();
    }
    return this.authService.generateJwtResponse(userId);
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
