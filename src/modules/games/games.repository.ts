import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GamesRepository {
  constructor(private prisma: PrismaService) {}

  async getCurrentLevel(params: { where: Prisma.GameWhereUniqueInput }) {
    return this.prisma.game.findUnique({ ...params, include: { level: true } });
  }

  async getOne(params: {
    where: Prisma.GameWhereUniqueInput;
    include?: Prisma.GameInclude;
    select?: Prisma.GameSelect;
  }): Promise<any> {
    return this.prisma.game.findUnique(params);
  }

  async getAll(params?: {
    select?: Prisma.GameSelect;
    where?: Prisma.GameWhereInput;
    include?: Prisma.GameInclude;
    orderBy?: Prisma.GameOrderByWithRelationInput[];
  }): Promise<any> {
    return this.prisma.game.findMany(params);
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

  async update(params: {
    where: Prisma.GameWhereUniqueInput;
    data: Prisma.GameUpdateInput;
    include?: Prisma.GameInclude;
    select?: Prisma.GameSelect;
  }): Promise<any> {
    return this.prisma.game.update(params);
  }

  async delete(id: number) {
    return this.prisma.game.delete({ where: { id } });
  }
}
