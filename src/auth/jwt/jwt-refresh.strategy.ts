import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AccountWithUser } from 'src/types/prisma-custom-types';
import { cookieRefreshTokenExtractor } from './jwt-cookie.extractor';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: cookieRefreshTokenExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  // Checks account exists and returns the content of the token if the token has been successfully verified
  async validate(payload: any) {
    const { sub } = payload;
    const accountId = parseInt(sub);

    const account: AccountWithUser =
      await this.authService.validateAccountById(accountId);

    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = account;

    return {
      attributes: result,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
    };
  }
}
