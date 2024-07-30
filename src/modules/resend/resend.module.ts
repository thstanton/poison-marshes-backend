import { Module } from '@nestjs/common';
import { ResendService } from './resend.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from 'src/database/prisma.module';
import { EmailsRepository } from './emails.repository';

@Module({
  imports: [UsersModule, PrismaModule],
  providers: [ResendService, EmailsRepository],
  exports: [ResendService],
})
export class ResendModule {}
