import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EmailsRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    data: Prisma.ScheduledEmailCreateInput;
    select?: Prisma.ScheduledEmailSelect;
  }) {
    return this.prisma.scheduledEmail.create(params);
  }

  async getAll(params?: {
    where?: Prisma.ScheduledEmailWhereInput;
    select?: Prisma.ScheduledEmailSelect;
    include?: Prisma.ScheduledEmailInclude;
  }): Promise<any> {
    return this.prisma.scheduledEmail.findMany(params);
  }

  async getOne(params: {
    where: Prisma.ScheduledEmailWhereUniqueInput;
    select?: Prisma.ScheduledEmailSelect;
    include?: Prisma.ScheduledEmailInclude;
  }): Promise<any> {
    return this.prisma.scheduledEmail.findUnique(params);
  }

  async updateMany(params: {
    where: Prisma.ScheduledEmailWhereInput;
    data: Prisma.ScheduledEmailUpdateManyMutationInput;
  }) {
    return this.prisma.scheduledEmail.updateMany(params);
  }

  async deleteMany(params: { where: Prisma.ScheduledEmailWhereInput }) {
    return this.prisma.scheduledEmail.deleteMany(params);
  }

  async delete(params: { where: Prisma.EmailWhereUniqueInput }) {
    return this.prisma.email.delete(params);
  }
}
