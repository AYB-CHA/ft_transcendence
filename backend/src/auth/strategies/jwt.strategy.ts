import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtAuth') {
  constructor(
    private readonly authService: AuthService,
    protected readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      secretOrKey: configService.get('JWT_SECRET_TOKEN'),
    });
  }

  async validate(payload: any) {
    if (!payload.isLogged)
      throw new UnauthorizedException({
        error: 'TOTP_UNVERIFIED',
      });
    return await this.authService.jwtValidation(payload);
  }

  static extractJWT(req: Request): string | null {
    console.log('extractJWT');
    if (
      req.cookies &&
      'accessToken' in req.cookies &&
      req.cookies.accessToken.length > 0
    ) {
      return req.cookies.accessToken;
    }
    return null;
  }
}
