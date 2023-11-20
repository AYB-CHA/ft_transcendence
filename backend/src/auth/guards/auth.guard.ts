import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RequestType } from 'src/types';
import * as Cookie from 'cookie';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestType = context.switchToHttp().getRequest();
    const token = AuthGuard.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.TOTPUnverified === true) {
        throw new HttpException(
          {
            error: 'TOTP_UNVERIFIED',
            message: 'TOTP needs verification',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      request['userPayload'] = payload;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new UnauthorizedException();
    }
    return true;
  }
  // DEPRECATED !!
  private extractTokenFromHeader(request: Request): string {
    return request.headers.authorization?.replace('Bearer ', '');
  }
  static extractTokenFromCookie(request: Request): string {
    return Cookie.parse(request.headers.cookie ?? '').access_token ?? '';
  }
}
