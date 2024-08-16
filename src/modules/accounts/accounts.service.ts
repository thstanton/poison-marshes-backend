import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { BcryptService } from 'src/auth/bcrypt/bcrypt.service';
import {
  AccountWithUser,
  AccountWithUserAndGame,
} from 'src/types/prisma-custom-types';
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
    try {
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
                    sequence: 1,
                    actSequence: 1,
                  },
                },
              },
            },
          },
        },
      });

      this.logger.debug(`New account for ${email}: ${account}`);
      await this.resendService.emailSingleUser({
        to: email,
        from: 'The Poison Marshes <poisonmarshes@cliki.in>',
        subject: 'Welcome to The Poison Marshes',
        text: `
        Dear ${name},

        Welcome to The Poison Marshes!
        Over the next week, you will become embroiled in a world of intrigue, secretive organisations and nefarious corporations - with the fate of the very village at stake...

        The game will begin on Sunday.Here are a few things you need to know before you play:

        Journal
        When you log into the Poison Marshes website, you will see your journal. This gives you an overview of what's going on in the story, links to important evidence you will need and is the place where you will enter your solution to progress further into your quest. You can also look back through your previous chapters to remind yourself of the story so far.

        QR Codes
        Many of the tasks you are given will involve finding and scanning QR Codes that are hidden around the village. You will only be able to progress by scanning the correct QR code for the chapter you are on.

        Emails
        Throughout the game various characters will be keeping in touch with you by email - so keep an eye on your inbox! You can also read any emails you are sent on your journal. Emails that are part of the game will always come from an address which ends with '@cliki.in', and will have 'Part of The Poison Marshes' at the end of the email. You will not be able to reply to these emails!

        Hints
        If you get stuck, click the ? button on your journal page to be given a hint. If you're still stuck after reading all the hints, you will be able to send us a message.

        Technical Support
        This is a fairly experimental project - so technical snags are to be expected. If you're having technical issues, please email Tim (thstanton@proton.me) for support.
        
        Good luck!

        Tim & Joe (The Poison Marshes Team)
        `,
        html: `
        <p>Dear ${name},<p>

        <h2>Welcome to The Poison Marshes!</h2>
        <p>Over the next week, you will become embroiled in a world of intrigue, secretive organisations and nefarious corporations - with the fate of the very village at stake...</p>

        <p>The game will begin on <strong>Sunday</strong> and you will receive an email when your first goes live.</p> 
        
        <p>Here are a few things you need to know before you play:</p>

        <h2>Journal</h2>
        <p>When you log into the Poison Marshes website, you will see your journal. This gives you an overview of what's going on in the story, links to important evidence you will need and is the place where you will enter your solution to progress further into your quest. You can also look back through your previous chapters to remind yourself of the story so far.</p>

        <h2>QR Codes</h2>
        <p>Many of the tasks you are given will involve finding and scanning QR Codes that are hidden around the village. You will only be able to progress by scanning the correct QR code for the chapter you are on.</p>

        <h2>Emails</h2>
        <p>Throughout the game various characters will be keeping in touch with you by email - so keep an eye on your inbox! You can also read any emails you are sent on your journal. Emails that are part of the game will always come from an address which ends with '<strong>@cliki.in</strong>', and will have '<strong>Part of The Poison Marshes</strong>' at the end of the email. You will not be able to reply to these emails!</p>

        <h2>Hints</h2>
        <p>If you get stuck, click the ? button on your journal page to be given a hint. If you're still stuck after reading all the hints, you will be able to send us a message.</p>

        <h2>Technical Support</h2>
        <p>This is a fairly experimental project - so technical snags are to be expected. If you're having technical issues, please email Tim (thstanton@proton.me) for support.</p>
        
        <p>Good luck!</p>

        <p>Tim & Joe (The Poison Marshes Team)</p>
        `,
      });

      return account;
    } catch (error) {
      throw new HttpException(
        'Unable to create account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSuperUser(accountDto: AccountCreateDto) {
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
        isAdmin: true,
      },
    });

    this.logger.debug(`Superuser account for ${email}: ${account}`);

    return account;
  }

  async getAll() {
    return this.repository.getAll();
  }

  async getOneByEmailWithUserAndGame(
    email: string,
  ): Promise<AccountWithUserAndGame> {
    return this.repository.getOne({
      where: { user: { email } },
      include: { user: true, game: true },
    });
  }

  async getOneByEmailWithUser(email: string): Promise<AccountWithUser> {
    return this.repository.getOne({
      where: { user: { email } },
      include: { user: true },
    });
  }

  async getOneByAccountIdWithUserAndGame(
    accountId: number,
  ): Promise<AccountWithUserAndGame> {
    return this.repository.getOne({
      where: { id: accountId },
      include: { user: true, game: true },
    });
  }

  async getOneByAccountIdWithUser(accountId: number): Promise<AccountWithUser> {
    return this.repository.getOne({
      where: { id: accountId },
      include: { user: true },
    });
  }

  async updateAccount(
    accountId: number,
    accountDto: AccountCreateDto,
  ): Promise<Account> {
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

  async resetPassword(accountId: number): Promise<Account> {
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
      const accountUpdate: Account = await this.repository.update({
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
