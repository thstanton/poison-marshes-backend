import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsRepository } from './levels.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { ResendModule } from '../resend/resend.module';
import { LevelsController } from './levels.controller';

@Module({
  imports: [PrismaModule, ResendModule],
  providers: [LevelsService, LevelsRepository],
  controllers: [LevelsController],
  exports: [LevelsService],
})
export class LevelsModule {}
