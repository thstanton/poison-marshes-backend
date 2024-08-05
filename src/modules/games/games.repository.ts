import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { GameWithAccountAndUser } from 'src/types/prisma-custom-types';

@Injectable()
export class GamesRepository {
  constructor(private prisma: PrismaService) {}

  // TODO: Make this a more generic update method and handle the logic in the service
  async increaseLevel(id: number) {
    return this.prisma.game.update({
      where: { id },
      data: { levelId: { increment: 1 } },
    });
  }

  async getCurrentLevel(params: { where: Prisma.GameWhereUniqueInput }) {
    return this.prisma.game.findUnique({ ...params, include: { level: true } });
  }

  async getByAccount(params: {
    where: Prisma.GameWhereUniqueInput;
    include?: Prisma.GameInclude;
    select?: Prisma.GameSelect;
  }): Promise<any> {
    return this.prisma.game.findUnique(params);
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
