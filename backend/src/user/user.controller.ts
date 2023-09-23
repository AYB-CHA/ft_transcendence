import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/gaurds/auth.gaurd';

@Controller('/user')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('/me')
  me() {
    return 'me';
  }
}
