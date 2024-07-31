import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { AccountWithUser } from 'src/types/prisma-custom-types';

@Injectable()
export class AccountsRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.AccountCreateInput }) {
    return this.prisma.account.create(params);
  }

  async update(params: {
    where: Prisma.AccountWhereUniqueInput;
    data: Prisma.AccountUpdateInput;
  }) {
    return this.prisma.account.update(params);
  }

  async delete(params: { where: Prisma.AccountWhereUniqueInput }) {
    return this.prisma.account.delete(params);
  }

  async getOne(params: {
    where: Prisma.AccountWhereInput;
    select?: Prisma.AccountSelect;
  }): Promise<AccountWithUser> {
    return this.prisma.account.findFirst({
      ...params,
      include: { user: true },
    });
  }

  async getAll(params?: { select?: Prisma.AccountSelect }) {
    return this.prisma.account.findMany({ ...params });
  }
}
