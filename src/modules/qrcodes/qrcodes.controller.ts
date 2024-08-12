import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { QrCodesService } from './qrcodes.service';
import { Response } from 'express';

@Controller('codes')
export class QrCodesController {
  constructor(private readonly qrcodesService: QrCodesService) {}

  @Get('/:levelId')
  async scanQrCode(
    @Param('levelId', ParseIntPipe) levelId: number,
    @Res() res: Response,
    @Query('platform') platform?: string,
  ) {
    const level = await this.qrcodesService.scanQrCode(levelId);
    if (platform && platform === 'app') {
      // TODO: redirect to app
      return level;
    } else {
      res.redirect(
        `${process.env.FRONTEND_URL}/code/${level.id}?solution=${level.solution}`,
      );
    }
  }
}
