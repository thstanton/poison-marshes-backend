import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsRepository } from './levels.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { ResendModule } from '../resend/resend.module';
import { LevelsController } from './levels.controller';
import { ActsModule } from '../acts/acts.module';

@Module({
  imports: [PrismaModule, ResendModule, ActsModule],
  providers: [LevelsService, LevelsRepository],
  controllers: [LevelsController],
  exports: [LevelsService],
})
export class LevelsModule {}
