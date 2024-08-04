import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

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
}
