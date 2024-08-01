import { Body, Controller, Post } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelCreateDto, LevelCreateManyDto } from './level-create.dto';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post('create')
  async createLevel(@Body('level') level: LevelCreateDto) {
    return this.levelsService.createLevel(level);
  }

  @Post('create-many')
  async createManyLevels(@Body('levels') levels: LevelCreateManyDto[]) {
    return this.levelsService.createManyLevels(levels);
  }
}
