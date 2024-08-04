import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GuardedRequest } from 'src/types/custom-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    @Body('refreshToken') refreshToken: string,
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
}
