import {
  Controller,
  Get,
  HttpStatus,
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
import { AccountWithUserAndGameWithoutPassword } from 'src/types/prisma-custom-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: GuardedRequest, @Res() res: Response) {
    const { accessToken, refreshToken, account } = await this.authService.login(
      req.account,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      signed: true,
      domain: undefined,
      secure: false,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      signed: true,
      domain: undefined,
      secure: false,
    });

    return res.status(HttpStatus.OK).json({
      account,
    });
  }

  @Post('refresh')
  async refresh(
    @Cookies('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    try {
      const {
        accessToken,
        refreshToken: newRefreshToken,
        account,
      } = await this.authService.refreshTokens(refreshToken);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        signed: true,
        domain: undefined,
        secure: false,
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        signed: true,
        domain: undefined,
        secure: false,
      });

      return res.status(HttpStatus.OK).json({
        account,
      });
    } catch (error) {
      res.status(401).json({
        message: 'Invalid refresh token',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-logged-in')
  async isLoggedIn(
    @Req() req: GuardedRequest,
  ): Promise<AccountWithUserAndGameWithoutPassword> {
    return req.account;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: GuardedRequest, @Res() res: Response) {
    const { id } = req.account;
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    const isLoggedOut = await this.authService.removeRefreshToken(id);
    if (!isLoggedOut) {
      throw new Error('Failed to remove refresh token');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Logged out',
    });
  }
}
