import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TfaAuthGuard {
    constructor(private readonly jwtService: JwtService,
        private readonly userService: UserService
        ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const token = JwtStrategy.extractJWT(request);
        const payload = this.jwtService.verify(token, {
            secret: 'PASSWORD',
        });
        request.user = await this.userService.findUser(payload.id, false);
        return !payload.isLogged;
    }
}
