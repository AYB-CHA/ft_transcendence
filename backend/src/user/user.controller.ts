import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from './user.service';
import { RequestType } from 'src/types';
import UpdateUserDto from './dtos/update-user.dto';
import UpdateUserPasswordDto from './dtos/update-user-password.dto';

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
    });
    delete user['createdAt'];
    delete user['updatedAt'];
    delete user['password'];
    delete user['authProvider'];
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
}
