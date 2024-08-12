import { Module } from '@nestjs/common';
import { QrCodesController } from './qrcodes.controller';
import { QrCodesService } from './qrcodes.service';
import { LevelsModule } from '../levels/levels.module';

@Module({
  imports: [LevelsModule],
  providers: [QrCodesService],
  controllers: [QrCodesController],
})
export class QrCodesModule {}
