import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

  logger = new Logger(RefreshTokensService.name);

  async generateRefreshToken(
    accountId: number,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: accountId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' },
    );

    this.logger.debug(
      `Checkout validity of refresh token: ${currentRefreshToken}`,
    );

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      if (await this.isRefreshTokenDenyListed(currentRefreshToken, accountId)) {
        this.logger.debug(
          `Refresh token ${currentRefreshToken} is on the deny list...`,
        );
        throw new UnauthorizedException('Invalid refresh token');
      }

      this.logger.debug(`Adding ${currentRefreshToken} to the deny list.`);
      await this.denyListRefreshToken(
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
        accountId,
      );
    }

    this.logger.debug(`Generated new refresh token: ${newRefreshToken}`);

    return newRefreshToken;
  }

  private isRefreshTokenDenyListed(refreshToken: string, accountId: number) {
    return this.repository.findOne({
      where: { token: refreshToken, accountId },
    });
  }

  async denyListRefreshToken(
    refreshToken: string,
    refreshTokenExpiresAt: Date,
    accountId: number,
  ) {
    return this.repository.create({
      data: {
        token: refreshToken,
        account: {
          connect: { id: accountId },
        },
        expiresAt: refreshTokenExpiresAt,
      },
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
    this.logger.log('Clearing expired refresh tokens...');
    await this.repository.delete({ where: { expiresAt: { lt: new Date() } } });
  }
}
