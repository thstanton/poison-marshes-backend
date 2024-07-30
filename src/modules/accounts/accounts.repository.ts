import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

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

  async getOne(params: { where: Prisma.AccountWhereUniqueInput }) {
    return this.prisma.account.findUnique(params);
  }
}
