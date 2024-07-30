import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EmailsRepository {
  constructor(private prisma: PrismaService) {}
}
