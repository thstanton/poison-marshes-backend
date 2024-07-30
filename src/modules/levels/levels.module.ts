import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsRepository } from './levels.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { ResendModule } from '../resend/resend.module';

@Module({
  imports: [PrismaModule, ResendModule],
  providers: [LevelsService, LevelsRepository],
  exports: [LevelsService],
})
export class LevelsModule {}
