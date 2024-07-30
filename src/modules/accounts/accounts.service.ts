import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { BcryptService } from 'src/auth/bcrypt/bcrypt.service';
import { AccountWithUser } from 'src/types/prisma-custom-types';

@Injectable()
export class AccountsService {
  constructor(
    private repository: AccountsRepository,
    private bcryptService: BcryptService,
  ) {}

  async create(userId: number, password: string, name: string) {
    let hashedPassword: string;
    if (password) {
      hashedPassword = await this.bcryptService.hashPassword(password);
    }
    return this.repository.create({
      data: {
        name,
        password: hashedPassword,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(email: string) {
    return this.repository.getOneByEmail(email);
  }

  async storeRefreshToken(accountId: number, refreshToken: string) {
    return this.repository.update({
      where: { id: accountId },
      data: { refreshToken },
    });
  }

  async findAccountIdByRefreshToken(
    refreshToken: string,
  ): Promise<AccountWithUser> {
    return this.repository.getOne({
      where: {
        refreshToken,
      },
    });
  }

  async getAllAccountIds() {
    return this.repository.getAll({
      select: {
        id: true,
      },
    });
  }
}
