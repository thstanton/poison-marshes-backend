import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class LevelsRepository {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.level.findMany();
  }

  async getById(id: number) {
    return this.prisma.level.findUnique({ where: { id } });
  }

  async levelHasEmail(levelId: number) {
    return this.prisma.level.findUnique({
      where: { id: levelId },
      include: {
        email: true,
      },
    });
  }

  async getMaxLevel() {
    return this.prisma.level.findFirst({
      orderBy: {
        id: 'desc',
      },
      take: 1,
      select: {
        id: true,
      },
    });
  }

  async create(params: { data: Prisma.LevelCreateInput }) {
    return this.prisma.level.create(params);
  }

  async createMany(params: { data: Prisma.LevelCreateManyInput[] }) {
    return this.prisma.level.createMany(params);
  }
}
