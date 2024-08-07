import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GuardedRequest } from 'src/types/custom-types';
import { Cookies } from 'src/decorators/cookies.decorator';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { AccountWithUserWithoutPassword } from 'src/types/prisma-custom-types';
import { Throttle } from '@nestjs/throttler';
import { JwtRefreshAuthGuard } from './jwt/jwt-refresh-auth.guard';
import { RefreshTokensService } from './refresh-tokens/refresh-tokens.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: GuardedRequest, @Res() res: Response) {
    const { account } = req;
    const { access_token, refresh_token } =
      await this.authService.login(account);

    res.cookie('accessToken', access_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      signed: true,
      domain: undefined,
      secure: false,
    });

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      signed: true,
      domain: undefined,
      secure: false,
    });

    return res.status(HttpStatus.OK).json({
      account,
    });
  }

  @Throttle({ short: { limit: 1, ttl: 1000 }, long: { limit: 2, ttl: 60000 } })
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Cookies('refresh_token') oldRefreshToken: string,
    @Req() req: GuardedRequest,
    @Res() res: Response,
  ) {
    if (!req.account) {
      throw new InternalServerErrorException();
    }
    try {
      const { access_token, refresh_token } =
        await this.refreshTokensService.generateTokenPair(
          (req.account as any).attributes,
          oldRefreshToken.split(' ')[0],
          (req.account as any).refreshTokenExpiresAt,
        );

      res.cookie('accessToken', access_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        signed: true,
        domain: undefined,
        secure: false,
      });

      res.cookie('refreshToken', refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        signed: true,
        domain: undefined,
        secure: false,
      });

      return res.status(HttpStatus.OK).json({
        account: req.account,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Invalid refresh token',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-logged-in')
  async isLoggedIn(
    @Req() req: GuardedRequest,
  ): Promise<AccountWithUserWithoutPassword> {
    return req.account;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() @Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.status(HttpStatus.OK).json({
      message: 'Logged out',
    });
  }
}
