import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.UserCreateInput }): Promise<User> {
    return this.prisma.user.create(params);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.prisma.user.update(params);
  }

  async getAll(params?: {
    select?: Prisma.UserSelect;
    where?: Prisma.UserWhereInput;
    include?: Prisma.UserInclude;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<any> {
    return this.prisma.user.findMany(params);
  }

  async getById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { account: true },
    });
  }
}
