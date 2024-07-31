import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/types/custom-types';
import { AuthService } from '../auth.service';

Injectable();
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Checks account exists and returns the content of the token if the token has been successfully verified
  async validate(payload: JwtPayload) {
    const { email, sub } = payload;

    const accountId = parseInt(sub);
    const account = await this.authService.validateAccountById(accountId);
    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    return { accountId: sub, email };
  }
}
