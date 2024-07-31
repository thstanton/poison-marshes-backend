import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const req = context.switchToHttp().getRequest();

    if (err || !user) {
      if (info) {
        console.log('Authentication info: ', info.message || info);
      }

      throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    }

    req.account = user;
    return user;
  }
}
