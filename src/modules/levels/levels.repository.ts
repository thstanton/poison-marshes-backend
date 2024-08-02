import { Injectable } from '@nestjs/common';
import { Level, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class LevelsRepository {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Level[]> {
    return this.prisma.level.findMany();
  }

  async getById(params: {
    where: Prisma.LevelWhereUniqueInput;
    select?: Prisma.LevelSelect;
  }): Promise<any> {
    return this.prisma.level.findUnique(params);
  }

  async getOne(params: {
    where?: Prisma.LevelWhereInput;
    include?: Prisma.LevelInclude;
    select?: Prisma.LevelSelect;
    orderBy?: Prisma.LevelOrderByWithRelationInput;
    take?: number;
  }): Promise<any> {
    return this.prisma.level.findFirst(params);
  }

  async create(params: {
    data: Prisma.LevelCreateInput;
    include?: Prisma.LevelInclude;
  }): Promise<Level> {
    return this.prisma.level.create(params);
  }

  async update<
    T extends {
      data: Prisma.LevelUpdateInput;
      where: Prisma.LevelWhereUniqueInput;
      select?: Prisma.LevelSelect | null;
      include?: Prisma.LevelInclude | null;
    },
  >(params: T): Promise<any> {
    return this.prisma.level.update(params);
  }

  async createMany(params: {
    data: Prisma.LevelCreateManyInput[];
  }): Promise<Level[]> {
    return this.prisma.level.createManyAndReturn(params);
  }

  async delete(params: {
    where: Prisma.LevelWhereUniqueInput;
  }): Promise<Level> {
    return this.prisma.level.delete(params);
  }
}
