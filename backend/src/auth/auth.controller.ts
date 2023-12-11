import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Res,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';
import { FortyTwoAuthGuard } from './guards/42.guard';
import { TfaAuthGuard } from './guards/tfa.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login') //no body
  @UseGuards(FortyTwoAuthGuard)
  login42() {}

  @Get('back')
  @UseGuards(FortyTwoAuthGuard)
  login42Callback(@Res({ passthrough: true }) res: Response, @Request() req) {
    return this.authService.login(res, req.user);
  }

  @Post('verify/2fa')
  @UseGuards(TfaAuthGuard)
  tfaValidation(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    return this.authService.login2FA(res, req.user, body.code);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
