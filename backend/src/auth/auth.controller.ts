import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import RegisterDto from './dtos/register.dto';
import LoginDto from './dtos/login.dto';

import { AuthService } from './auth.service';
import { FtStrategy } from './OAuth/ft.strategy';
import { RegisterUserType } from 'src/types';
import { GithubStrategy } from './OAuth/github.strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';

import { AuthGuard } from './guards/auth.guard';
import { Request, Response } from 'express';

import * as se from 'speakeasy';
import { ConfigService } from '@nestjs/config';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly ftStrategy: FtStrategy,
    private readonly githubStrategy: GithubStrategy,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { jwtToken } = await this.authService.registerNewUser({
      email: body.email,
      fullName: body.fullName,
      password: body.password,
      username: body.username,
    });
    this.setAuthCookies(response, jwtToken);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { jwtToken } = await this.authService.loginUser({
      password: body.password,
      usernameOrEmail: body.usernameOrEmail,
    });
    this.setAuthCookies(response, jwtToken);
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
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!verificationCode) throw new BadRequestException();

    const authorization = AuthGuard.extractTokenFromCookie(request);

    let userId = '';
    try {
      const payload = await this.jwtService.verifyAsync(authorization);
      if (!payload.TOTPUnverified) throw new Error();
      const user = await this.prisma.user.findFirstOrThrow({
        where: { id: payload.sub },
      });

      if (!user.is2FAEnabled) throw new Error();

      if (
        !se.totp.verify({
          secret: user.optSecret,
          token: verificationCode,
          encoding: 'hex',
        })
      ) {
        throw new Error();
      }
      userId = payload.sub;
    } catch {
      throw new BadRequestException();
    }
    const { jwtToken } = await this.authService.generateJwtResponse(userId);
    this.setAuthCookies(response, jwtToken);
    return {};
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
  private setAuthCookies(response: Response, jwtToken: string) {
    const domain = this.configService.get<string>('BASE_DOMAIN');
    response.cookie('access_token', jwtToken, {
      httpOnly: true,
      domain,
      sameSite: 'strict',
      secure: false,
    });
  }
}
