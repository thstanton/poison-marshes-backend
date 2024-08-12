import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const req = context.switchToHttp().getRequest();

    if (err || !user) {
      if (info) {
        console.log(
          'Authentication info (LocalAuthGuard): ',
          info.message || info,
        );
      }

      throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    }

    req.account = user;
    return user;
  }
}
