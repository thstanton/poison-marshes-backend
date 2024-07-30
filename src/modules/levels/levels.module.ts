import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsRepository } from './levels.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LevelsService, LevelsRepository],
  exports: [LevelsService],
})
export class LevelsModule {}
