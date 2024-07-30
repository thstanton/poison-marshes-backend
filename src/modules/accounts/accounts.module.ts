import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService],
})
export class AccountsModule {}
