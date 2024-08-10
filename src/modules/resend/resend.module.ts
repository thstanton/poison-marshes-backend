import { Module } from '@nestjs/common';
import { ResendService } from './resend.service';
import { EmailsRepository } from './emails.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ResendService, EmailsRepository],
  exports: [ResendService],
})
export class ResendModule {}
