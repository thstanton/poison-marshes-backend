import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { JwtService } from '@nestjs/jwt';
import { AccountWithUserWithoutPassword } from 'src/types/prisma-custom-types';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Tokens } from 'src/types/custom-types';

@Injectable()
export class RefreshTokensService {
  constructor(
    private repository: RefreshTokensRepository,
    private jwtService: JwtService,
  ) {}

  async generateRefreshToken(
    accountId: number,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: accountId },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '30d' },
    );

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      if (await this.isRefreshTokenDenyListed(currentRefreshToken, accountId)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.repository.create({
        data: {
          token: newRefreshToken,
          account: {
            connect: { id: accountId },
          },
          expiresAt: currentRefreshTokenExpiresAt,
        },
      });
    }

    return newRefreshToken;
  }

  private isRefreshTokenDenyListed(refreshToken: string, accountId: number) {
    return this.repository.findOne({
      where: { token: refreshToken, accountId },
    });
  }

  async generateTokenPair(
    account: AccountWithUserWithoutPassword,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ): Promise<Tokens> {
    const payload = { email: account.user.email, sub: account.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(
        account.id,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshTokens() {
    await this.repository.delete({ where: { expiresAt: { lt: new Date() } } });
  }
}
