import { Injectable, Redirect, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserType, RegisterUserType } from 'src/types';
import { UserService } from 'src/user/user.service';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    readonly userService: UserService,
    readonly jwtService: JwtService,
    readonly configService: ConfigService,
  ) {}

  async registerNewUser(userData: RegisterUserType) {
    // todo: validate the uniqueness of the email and username.
    let userId = await this.userService.createUser(userData);
    return this.generateJwtResponse(userId);
  }

  async loginUser(userData: LoginUserType) {
    try {
      let user = await this.userService.findUserByEmailOrUsername(
        userData.usernameOrEmail,
      );

      if (compareSync(userData.password, user.password)) {
        return this.generateJwtResponse(user.id);
      }
    } catch {}
    throw new UnauthorizedException();
  }

  async logInUserOAuth(
    userData: RegisterUserType,
    authProvider: 'FT' | 'GITHUB',
  ) {
    let userId: string;

    try {
      userId = (await this.userService.findUserByUsername(userData.username))
        .id;
    } catch {
      userId = await this.userService.createUser({ ...userData, authProvider });
    }

    let redirectUrl = new URL(this.configService.get('FRONTEND_BASEURL'));
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.append(
      'access_token',
      (await this.generateJwtResponse(userId)).jwtToken,
    );
    return {
      url: redirectUrl.toString(),
    };
  }

  async generateJwtResponse(sub: string) {
    let jwtToken = await this.jwtService.signAsync({
      sub,
    });
    return {
      jwtToken,
    };
  }
}
