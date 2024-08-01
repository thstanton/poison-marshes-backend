import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { GameWithAccountAndUser } from 'src/types/prisma-custom-types';

@Injectable()
export class GamesRepository {
  constructor(private prisma: PrismaService) {}

  async increaseLevel(id: number) {
    return this.prisma.game.update({
      where: { id },
      data: { levelId: { increment: 1 } },
    });
  }

  async getCurrentLevel(params: { where: Prisma.GameWhereUniqueInput }) {
    return this.prisma.game.findUnique({ ...params, include: { level: true } });
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

  async getAll(params?: {
    select?: Prisma.GameSelect;
    where?: Prisma.GameWhereInput;
  }): Promise<GameWithAccountAndUser[]> {
    return this.prisma.game.findMany({
      ...params,
      include: {
        account: {
          include: {
            user: true,
          },
        },
      },
    }) as Promise<GameWithAccountAndUser[]>;
  }

  async getAllByLevel() {
    return this.prisma.game.groupBy({
      by: ['levelId'],
    });
  }

  async createNew(params: { data: Prisma.GameCreateInput }) {
    return this.prisma.game.create({
      ...params,
      include: {
        account: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async createMany(params: { data: Prisma.GameCreateManyInput[] }) {
    return this.prisma.game.createManyAndReturn({
      ...params,
      include: {
        account: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.game.delete({ where: { id } });
  }
}
