import { Injectable, Logger } from '@nestjs/common';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import {
  AccountWithUser,
  AccountWithUserWithoutPassword,
} from '../types/prisma-custom-types';
import { RefreshTokensService } from './refresh-tokens/refresh-tokens.service';
import { Tokens } from 'src/types/custom-types';

@Injectable()
export class AuthService {
  constructor(
    private accountsService: AccountsService,
    private refreshTokensService: RefreshTokensService,
    private bcryptService: BcryptService,
  ) {}

  private logger = new Logger(AuthService.name);

  // Validates user email and password for Passport Local Strategy,
  // Called by validate method of LocalAuthGuard
  async validateUserAccount(
    email: string,
    password: string,
  ): Promise<AccountWithUserWithoutPassword | null> {
    const account: AccountWithUser =
      await this.accountsService.getOneByEmailWithUser(email);
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

  // Called by JWTAuthGuard
  async validateAccountById(accountId: number): Promise<AccountWithUser> {
    return this.accountsService.getOneByAccountIdWithUser(accountId);
  }

  // Called by Auth Controller Login method following successful
  // validation by LocalAuthGuard, returns access & refresh tokens
  async login(account: AccountWithUserWithoutPassword): Promise<Tokens> {
    return this.refreshTokensService.generateTokenPair(account);
  }
}
