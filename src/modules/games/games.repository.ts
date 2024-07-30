import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GamesRepository {
  constructor(private prisma: PrismaService) {}

  async increaseLevel(id: number) {
    return this.prisma.game.update({
      where: { id },
      data: { levelId: { increment: 1 } },
    });
  }

  async getByAccountWithLevelAndUser(accountId: number) {
    return this.prisma.game.findUnique({
      where: { accountId },
      include: {
        level: true,
        account: {
          include: { user: true },
        },
      },
    });
  }

  async getAll() {
    return this.prisma.game.findMany();
  }

  async getAllByLevel() {
    return this.prisma.game.groupBy({
      by: ['levelId'],
    });
  }

  async createNew(params: { data: Prisma.GameCreateInput }) {
    return this.prisma.game.create(params);
  }

  async createMany(params: { data: Prisma.GameCreateManyInput[] }) {
    return this.prisma.game.createMany(params);
  }

  async delete(id: number) {
    return this.prisma.game.delete({ where: { id } });
  }
}
