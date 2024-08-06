import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/types/custom-types';
import { AuthService } from '../auth.service';
import { cookieExtractor } from './jwt-cookie-extractor';
import {
  AccountWithUserAndGame,
  AccountWithUserAndGameWithoutPassword,
} from 'src/types/prisma-custom-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Checks account exists and returns the content of the token if the token has been successfully verified
  async validate(
    payload: JwtPayload,
  ): Promise<AccountWithUserAndGameWithoutPassword> {
    const { sub } = payload;
    const accountId = parseInt(sub);

    const account: AccountWithUserAndGame =
      await this.authService.validateAccountById(accountId);

    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...result } = account;

    return result;
  }
}
