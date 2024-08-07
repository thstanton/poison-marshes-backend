import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesRepository } from './games.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { LevelsModule } from '../levels/levels.module';
import { GamesController } from './games.controller';

@Module({
  imports: [PrismaModule, LevelsModule],
  providers: [GamesService, GamesRepository],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
