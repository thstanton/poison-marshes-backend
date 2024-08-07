import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RefreshTokensRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.RefreshTokenCreateInput }) {
    return this.prisma.refreshToken.create(params);
  }

  async findOne(params: { where: Prisma.RefreshTokenWhereInput }) {
    return this.prisma.refreshToken.findFirst(params);
  }

  async delete(params: { where: Prisma.RefreshTokenWhereInput }) {
    return this.prisma.refreshToken.deleteMany(params);
  }
}
