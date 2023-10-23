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
        return this.generateJwtResponse(
          user.id,
          user.optSecret !== null ? true : undefined,
        );
      }
    } catch {}
    throw new UnauthorizedException(['username or password is wrong']);
  }

  async logInUserOAuth(
    userData: RegisterUserType,
    authProvider: 'FT' | 'GITHUB',
  ) {
    let userId: string;
    let totp = undefined;
    console.log(this.configService.get('FRONTEND_BASEURL'));
    const redirectUrl = new URL(this.configService.get('FRONTEND_BASEURL'));
    redirectUrl.pathname = '/auth/provider';

    try {
      const user = await this.userService.findUserByUsername(userData.username);
      userId = user.id;
      totp = user.is2FAEnabled ? true : undefined;
    } catch {
      userId = await this.userService.createUser({ ...userData, authProvider });
    }

    redirectUrl.searchParams.append(
      'access_token',
      (await this.generateJwtResponse(userId, totp)).jwtToken,
    );

    if (totp) redirectUrl.searchParams.append('2fa', 'true');

    return {
      url: redirectUrl.toString(),
    };
  }

  async generateJwtResponse(
    sub: string,
    TOTPUnverified: boolean | undefined = undefined,
  ) {
    const jwtToken = await this.jwtService.signAsync({
      sub,
      TOTPUnverified,
    });
    return {
      jwtToken,
    };
  }
}
