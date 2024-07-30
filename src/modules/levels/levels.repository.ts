import { Injectable } from '@nestjs/common';
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
}
