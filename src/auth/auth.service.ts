import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import {
  AccountWithUser,
  AccountWithUserWithoutPassword,
} from '../types/prisma-custom-types';

@Injectable()
export class AuthService {
  constructor(
    private accountsService: AccountsService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  //   Validates user email and password for Passport Local Strategy
  async validateUser(
    email: string,
    password: string,
  ): Promise<AccountWithUserWithoutPassword | null> {
    console.log('Validate user function runs');
    const account: AccountWithUser = await this.accountsService.findOne(email);
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
    const payload = { email: account.user.email, sub: account.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshTokenId = uuidv4();
    await this.accountsService.storeRefreshToken(account.id, refreshTokenId);

    const refreshToken = this.jwtService.sign(
      { refreshTokenId },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  async login(account: AccountWithUserWithoutPassword): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    console.log('Login function runs');
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
}
