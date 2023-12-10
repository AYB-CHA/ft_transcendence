import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from './user.service';
import { RequestType } from 'src/types';

import UpdateUserDto from './dtos/update-user.dto';
import UpdateUserPasswordDto from './dtos/update-user-password.dto';

import * as QRCode from 'qrcode';
import * as se from 'speakeasy';

@UseGuards(AuthGuard)
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  me(@Req() request: RequestType) {
    try {
      return this.userService.findUser(request.userPayload.sub);
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Get('/search')
  findUsers(
    @Req() request: RequestType,
    @Query('q') query: string | undefined,
  ) {
    return this.userService.findUsers(request.userPayload.sub, query);
  }

  @Get('/:id')
  user(@Param('id') id: string) {
    return this.userService.findUser(id);
  }

  @Post('block/:id')
  blockUser(@Req() request: RequestType, @Param('id') id: string) {
    return this.userService.blockUser(request.userPayload.sub, id);
  }

  @Put('/update')
  async update(@Req() request: RequestType, @Body() body: UpdateUserDto) {
    await this.userService.validateUniquenessOfEmailAndUsername(
      body.username,
      body.email,
      request.userPayload.sub,
    );
    const user = await this.userService.updateUser(request.userPayload.sub, {
      avatar: body.avatar,
      email: body.email,
      fullName: body.fullName,
      username: body.username,
      password: body.password,
      passwordConfirmation: body.passwordConfirmation,
    });
    return user;
  }

  @Put('/update/password')
  async updatePassword(
    @Req() request: RequestType,
    @Body() body: UpdateUserPasswordDto,
  ) {
    await this.userService.updatePassword(
      {
        newPassword: body.newPassword,
        oldPassword: body.oldPassword,
      },
      request.userPayload.sub,
    );
  }

  @Put('/update/enable2FA')
  async enable2FA(
    @Req() request: RequestType,
    @Body('verificationCode') verificationCode: string | undefined,
  ) {
    try {
      const user = await this.userService.findUser(
        request.userPayload.sub,
        true,
      );
      if (!verificationCode || user.is2FAEnabled)
        throw new BadRequestException();
      if (
        !se.totp.verify({
          secret: user.otpSecret,
          token: verificationCode,
          encoding: 'hex',
        })
      )
        throw new BadRequestException(['verification code is invalid']);
      await this.userService.enable2FA(request.userPayload.sub);
      return;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException();
    }
  }

  @Get('/2fa/qrcode')
  async qrcode(@Req() request: RequestType) {
    const user = await this.userService.findUser(request.userPayload.sub, true);
    const url = se.otpauthURL({
      secret: user.otpSecret,
      label: `PingPong(${user.username})`,
      encoding: 'hex',
    });
    try {
      const data = await QRCode.toDataURL(url, {});
      return { image: data };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @Put('/update/disable2FA')
  async disable2FA(@Req() request: RequestType) {
    await this.userService.disable2FA(request.userPayload.sub);
  }
}
