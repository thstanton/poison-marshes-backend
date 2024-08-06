import { Injectable, Logger } from '@nestjs/common';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import {
  AccountWithUser,
  AccountWithUserAndGame,
  AccountWithUserAndGameWithoutPassword,
  AccountWithUserWithoutPassword,
} from '../types/prisma-custom-types';
import { JwtPayload } from 'src/types/custom-types';
import { Account } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private accountsService: AccountsService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger(AuthService.name);

  // Validates user email and password for Passport Local Strategy,
  // Called by validate method of LocalAuthGuard
  async validateUserAccount(
    email: string,
    password: string,
  ): Promise<AccountWithUserAndGameWithoutPassword | null> {
    const account: AccountWithUserAndGame =
      await this.accountsService.findOneByEmail(email);
    if (account) {
      const isMatch = await this.bcryptService.comparePassword(
        password,
        account.password,
      );

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, refreshToken, ...result } = account;
        return result;
      }
    }
    return null;
  }

  private async generateTokens(
    accountId: number,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const sub = accountId.toString();
    const payload: JwtPayload = { email: email, sub };
    const accessToken = this.jwtService.sign(payload);

    const refreshTokenId = uuidv4();
    await this.accountsService.storeRefreshToken(accountId, refreshTokenId);

    const refreshToken = this.jwtService.sign(
      { refreshTokenId },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  // Called by Auth Controller Login method following successful
  // validation by LocalAuthGuard, returns access & refresh tokens
  async login(account: AccountWithUserWithoutPassword): Promise<{
    accessToken: string;
    refreshToken: string;
    account: AccountWithUserWithoutPassword;
  }> {
    const tokens = await this.generateTokens(account.id, account.user.email);
    return { ...tokens, account };
  }

  async refreshTokens(_refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    account: AccountWithUserWithoutPassword;
  } | null> {
    this.logger.debug('refreshTokens received: ' + _refreshToken);
    try {
      const { _refreshTokenId } = this.jwtService.verify(_refreshToken);
      const account: AccountWithUser =
        await this.accountsService.findAccountIdByRefreshToken(_refreshTokenId);

      if (!account) {
        throw new Error('Invalid refresh token');
      }

      const tokens = await this.generateTokens(account.id, account.user.email);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, refreshToken, ...result } = account;

      return { ...tokens, account: { ...result } };
    } catch (error) {
      this.logger.error(error);
    }
  }

  async validateAccountById(
    accountId: number,
  ): Promise<AccountWithUserAndGame> {
    return this.accountsService.findOneByAccountId(accountId);
  }

  async removeRefreshToken(accountId: number): Promise<Account> {
    return this.accountsService.removeRefreshToken(accountId);
  }
}
