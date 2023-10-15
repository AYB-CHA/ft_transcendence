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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestType = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
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

  private extractTokenFromHeader(request: Request): string {
    return request.headers.authorization?.replace('Bearer ', '');
  }
}
