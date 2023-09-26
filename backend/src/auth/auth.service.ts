import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserType, RegisterUserType } from 'src/types';
import { UserService } from 'src/user/user.service';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerNewUser(userData: RegisterUserType) {
    await this.userService.validateUniquenessOfEmailAndUsername(
      userData.username,
      userData.email,
    );
    const userId = await this.userService.createUser(userData);
    return this.generateJwtResponse(userId);
  }

  async loginUser(userData: LoginUserType) {
    try {
      const user = await this.userService.findUserByEmailOrUsername(
        userData.usernameOrEmail,
      );

      if (compareSync(userData.password, user.password)) {
        return this.generateJwtResponse(user.id);
      }
    } catch {}
    throw new UnauthorizedException(['username or password is wrong']);
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

    const redirectUrl = new URL(this.configService.get('FRONTEND_BASEURL'));
    redirectUrl.pathname = '/auth/login/provider';
    redirectUrl.searchParams.append(
      'access_token',
      (await this.generateJwtResponse(userId)).jwtToken,
    );
    return {
      url: redirectUrl.toString(),
    };
  }

  async generateJwtResponse(sub: string) {
    const jwtToken = await this.jwtService.signAsync({
      sub,
    });
    return {
      jwtToken,
    };
  }
}
