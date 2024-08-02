import { Injectable } from '@nestjs/common';
import { Act, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ActsRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.ActCreateInput }): Promise<Act> {
    return this.prisma.act.create(params);
  }

  async getAll(): Promise<Act[]> {
    return this.prisma.act.findMany();
  }

  async getById(params: {
    where: Prisma.ActWhereUniqueInput;
    include?: Prisma.ActInclude;
    select?: Prisma.ActSelect;
  }): Promise<any> {
    return this.prisma.act.findUnique(params);
  }

  async getOne(params: {
    where: Prisma.ActWhereUniqueInput;
    include?: Prisma.ActInclude;
    select?: Prisma.ActSelect;
  }): Promise<any> {
    return this.prisma.act.findFirst(params);
  }

  async update(params: {
    where: Prisma.ActWhereUniqueInput;
    data: Prisma.ActUpdateInput;
    include?: Prisma.ActInclude;
    select?: Prisma.ActSelect;
  }): Promise<any> {
    return this.prisma.act.update(params);
  }

  async delete(params: { where: Prisma.ActWhereUniqueInput }): Promise<Act> {
    return this.prisma.act.delete(params);
  }
}
