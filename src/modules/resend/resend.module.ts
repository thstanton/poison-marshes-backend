import { Module } from '@nestjs/common';
import { ResendService } from './resend.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
  providers: [ResendService],
  exports: [ResendService],
})
export class ResendModule {}
