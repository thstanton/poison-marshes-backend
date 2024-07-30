import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesRepository } from './games.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GamesService, GamesRepository],
  exports: [GamesService],
})
export class GamesModule {}
