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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from './user.service';
import { RequestType } from 'src/types';
import UpdateUserDto from './dtos/update-user.dto';
import UpdateUserPasswordDto from './dtos/update-user-password.dto';
import * as QRCode from 'qrcode';
import * as se from 'speakeasy';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Req() request: RequestType) {
    return await this.userService.findUser(request.userPayload.sub);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async user(@Param('id') id: string) {
    return await this.userService.findUser(id);
  }

  @UseGuards(AuthGuard)
  @Post('block/:id')
  async blockUser(@Req() request: RequestType, @Param('id') id: string) {
    return await this.userService.blockUser(request.userPayload.sub, id);
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Put('/update/disable2FA')
  async disable2FA(@Req() request: RequestType) {
    await this.userService.disable2FA(request.userPayload.sub);
  }
}
