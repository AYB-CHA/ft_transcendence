import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard extends PassportGuard('jwtAuth') {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        // console.log(request);
        // console.log(this.getRequest(context));
        return super.canActivate(context);
    }
}
