import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { UserService } from './user.service';
import { RequestType } from 'src/types';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Req() request: RequestType) {
    let user = await this.userService.findUser(request.userPayload.sub);
    delete user['createdAt'];
    delete user['updatedAt'];
    delete user['password'];
    delete user['authProvider'];
    return user;
  }
}
