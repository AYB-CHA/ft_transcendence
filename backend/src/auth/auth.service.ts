import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  async localValidation(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    if (password !== user.password) {
      return null;
    }
    return user;
  }

  async _42Validation(payload: any) {
    let user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      user = await this.userService.createUser({
        fullName: payload.displayName,
        email: payload.email,
        username: payload.login,
        avatar: payload.image_url,
      });
    }
    return user;
  }

  async login(res: Response, user: User) {
    //sign the token that we have before the tfa
    this.sign(res, { id: user.id, isLogged: !user.is2FAEnabled });
    res.redirect(user.is2FAEnabled ? '/auth/2fa' : '/');
  }

  async jwtValidation(payload: any) {
    const user = await this.userService.findUser(payload.id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      ...user,
    };
  }

  async login2FA(res: Response, user: User, tfaCode: string) {
    await this.userService.check2FA(user.id, tfaCode);
    this.sign(res, { id: user.id, isLogged: true });
    res.redirect('/');
  }

  sign(res: Response, payload: any) {
    const tk = this.jwtService.sign(payload);
    res.cookie('accessToken', tk, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 3600000,
    });
  }

  loginAssert() {
    return 'login success';
  }

  logout(res: Response) {
    res.clearCookie('accessToken');
  }
}
