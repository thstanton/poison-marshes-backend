import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import {
  AccountWithUser,
  AccountWithUserWithoutPassword,
} from '../types/prisma-custom-types';
import { JwtPayload } from 'src/types/custom-types';

@Injectable()
export class AuthService {
  constructor(
    private accountsService: AccountsService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  // Validates user email and password for Passport Local Strategy,
  // Called by validate method of LocalAuthGuard
  async validateUserAccount(
    email: string,
    password: string,
  ): Promise<AccountWithUserWithoutPassword | null> {
    const account: AccountWithUser =
      await this.accountsService.findOneByEmail(email);
    if (account) {
      const isMatch = await this.bcryptService.comparePassword(
        password,
        account.password,
      );

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = account;
        return result;
      }
    }
    return null;
  }

  private async generateTokens(
    account: AccountWithUserWithoutPassword,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const sub = account.id.toString();
    const payload: JwtPayload = { email: account.user.email, sub };
    const accessToken = this.jwtService.sign(payload);

    const refreshTokenId = uuidv4();
    await this.accountsService.storeRefreshToken(account.id, refreshTokenId);

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
  }> {
    return this.generateTokens(account);
  }

  async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const { refreshTokenId } = this.jwtService.verify(refreshToken);
      const account =
        await this.accountsService.findAccountIdByRefreshToken(refreshTokenId);

      if (!account) {
        throw new Error('Invalid refresh token');
      }

      return this.generateTokens(account);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async validateAccountById(accountId: number) {
    return this.accountsService.findOneByAccountId(accountId);
  }
}
