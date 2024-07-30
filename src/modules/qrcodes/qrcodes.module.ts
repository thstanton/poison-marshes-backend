import { Module } from '@nestjs/common';
import { QrCodesController } from './qrcodes.controller';
import { QrCodesService } from './qrcodes.service';

@Module({
  providers: [QrCodesService],
  controllers: [QrCodesController],
})
export class QrCodesModule {}
