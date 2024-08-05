import { Injectable, Logger } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { BcryptService } from 'src/auth/bcrypt/bcrypt.service';
import { AccountWithUser } from 'src/types/prisma-custom-types';
import { AccountCreateDto } from './account-create.dto';
import { Account } from '@prisma/client';
import generator from 'generate-password-ts';
import { ResendService } from '../resend/resend.service';

@Injectable()
export class AccountsService {
  constructor(
    private repository: AccountsRepository,
    private bcryptService: BcryptService,
    private resendService: ResendService,
  ) {}

  private logger = new Logger(AccountsService.name);

  async create(accountDto: AccountCreateDto) {
    const { email, password, name } = accountDto;

    let hashedPassword: string;
    if (password) {
      hashedPassword = await this.bcryptService.hashPassword(password);
    }

    const account = await this.repository.create({
      data: {
        name,
        password: hashedPassword,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
        game: {
          create: {
            level: {
              connect: {
                sequence_actSequence: {
                  sequence: 0,
                  actSequence: 0,
                },
              },
            },
          },
        },
      },
    });

    this.logger.debug(`New account for ${email}: ${account}`);

    return account;
  }

  async getAll() {
    return this.repository.getAll();
  }

  async findOneByEmail(email: string) {
    return this.repository.getOne({
      where: { user: { email } },
      include: { user: true },
    });
  }

  async findOneByAccountId(accountId: number) {
    return this.repository.getOne({ where: { id: accountId } });
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

  async updateAccount(accountId: number, accountDto: AccountCreateDto) {
    const { name } = accountDto;
    return this.repository.update({
      where: { id: accountId },
      data: { name },
    });
  }

  async updatePassword(
    accountId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<Account> {
    const account = await this.repository.getById({
      where: { id: accountId },
    });
    if (!account) throw new Error('Account not found');
    const oldPasswordIsCorrect = await this.bcryptService.comparePassword(
      oldPassword,
      account.password,
    );
    if (!oldPasswordIsCorrect) throw new Error('Old password is incorrect');
    const hashedPassword = await this.bcryptService.hashPassword(newPassword);
    return this.repository.update({
      where: { id: accountId },
      data: { password: hashedPassword },
    });
  }

  async resetPassword(accountId: number) {
    const account: AccountWithUser = await this.repository.getById({
      where: { id: accountId },
      include: { user: true },
    });
    if (account) {
      const newPassword = generator.generate({
        length: 10,
        numbers: true,
      });
      const hashedPassword = await this.bcryptService.hashPassword(newPassword);
      const accountUpdate = await this.repository.update({
        where: { id: accountId },
        data: { password: hashedPassword },
      });

      if (accountUpdate) {
        await this.resendService.emails.send({
          from: 'Poison Marshes Accounts Service <poisonmarshesaccounts@cliki.in>',
          to: account.user.email,
          subject: 'Your password has been reset',
          text: `
            Dear ${account.name}, 
            Your new password is ${newPassword}. 
            Please change this as soon as possible to keep your account secure. 
            From, The Poison Marshes Team.
            `,
          html: `
            <p>Dear ${account.name},</p>
            <p>Your new password is <strong>${newPassword}</strong>.
            <p>Please change this as soon as possible to keep your account secure.</p>
            <p>From, The Poison Marshes Team.</p>
            `,
        });
        return accountUpdate;
      }
    }
  }

  async makeAdmin(accountId: number) {
    return this.repository.update({
      where: { id: accountId },
      data: { isAdmin: true },
    });
  }

  async deleteAccount(accountId: number) {
    return this.repository.delete({ where: { id: accountId } });
  }
}
