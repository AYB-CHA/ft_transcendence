import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import * as se from 'speakeasy';
import * as QRCode from 'qrcode';

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
  async enable2FA(@Req() request: RequestType) {
    if ((await this.userService.findUser(request.userPayload.sub)).otpEnabled)
      throw new BadRequestException();
    const secret = se.generateSecret({ otpauth_url: true, name: 'PingPong' });

    console.log(secret);

    try {
      const data = await QRCode.toDataURL(secret.otpauth_url, {});
      await this.userService.enable2FA(request.userPayload.sub, secret.hex);
      return { image: data };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Put('/update/disable2FA')
  async disable2FA(@Req() request: RequestType) {
    await this.userService.disable2FA(request.userPayload.sub);
  }
}
