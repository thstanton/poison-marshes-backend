import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { BcryptModule } from 'src/auth/bcrypt/bcrypt.module';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [PrismaModule, BcryptModule],
  providers: [AccountsService, AccountsRepository],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
