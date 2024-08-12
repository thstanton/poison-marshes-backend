import { Injectable } from '@nestjs/common';
import { LevelsService } from '../levels/levels.service';

@Injectable()
export class QrCodesService {
  constructor(private levelsService: LevelsService) {}

  async scanQrCode(levelId: number) {
    const level = await this.levelsService.getById(levelId);
    return { id: level.id, solution: level.solution };
  }
}
