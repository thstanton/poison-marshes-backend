import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GuardedRequest, LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: GuardedRequest) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    try {
      const tokens = await this.authService.refreshTokens(refreshToken);
      res.json(tokens);
    } catch (error) {
      res.status(401).json({
        message: 'Invalid refresh token',
      });
    }
  }
}
