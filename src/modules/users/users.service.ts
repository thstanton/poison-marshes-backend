import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma, User } from '@prisma/client';
import { CreateBatchResponse } from 'src/types/resend-types';
import { EmailCreateDto } from '../resend/email.dto';
import { ResendService } from '../resend/resend.service';

@Injectable()
export class UsersService {
  constructor(
    private repository: UsersRepository,
    private resendService: ResendService,
  ) {}

  async create(params: { email: string }): Promise<User> {
    const { email } = params;
    return this.repository.create({ data: { email } });
  }

  async registerUser(params: { email: string }): Promise<User> {
    const { email } = params;
    return this.repository.update({
      where: { email },
      data: { confirmed: true },
    });
  }

  async getAll(): Promise<User[]> {
    return this.repository.getAll();
  }

  async findOne(email: string) {
    return this.repository.getByEmail(email);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.repository.update(params);
  }

  async emailAllUsers(email: EmailCreateDto): Promise<CreateBatchResponse> {
    const users: { email: string }[] = await this.repository.getAll({
      select: { email: true },
    });
    const addresses: string[] = users.map((user) => user.email);
    const response: CreateBatchResponse = await this.resendService.emailGroup(
      email,
      addresses,
    );

    return response;
  }
}
