import { Module } from '@nestjs/common';
import { ActsService } from './acts.service';
import { PrismaModule } from 'src/database/prisma.module';
import { ActsRepository } from './acts.repository';
import { ActsController } from './acts.controller';

@Module({
  imports: [PrismaModule],
  providers: [ActsService, ActsRepository],
  controllers: [ActsController],
  exports: [ActsService],
})
export class ActsModule {}
