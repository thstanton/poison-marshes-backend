import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { BcryptService } from 'src/auth/bcrypt/bcrypt.service';

@Injectable()
export class AccountsService {
  constructor(
    private repository: AccountsRepository,
    private bcryptService: BcryptService,
  ) {}

  async create(email: string, password: string, name: string) {
    let hashedPassword: string;
    if (password) {
      hashedPassword = await this.bcryptService.hashPassword(password);
    }
    return this.repository.create({
      data: {
        name,
        password: hashedPassword,
        user: { connect: { email } },
      },
    });
  }
}
