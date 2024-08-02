import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelCreateDto } from './level-create.dto';

@Controller('levels')
@UsePipes(new ValidationPipe({ transform: true }))
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  async createLevel(@Body('level') level: LevelCreateDto) {
    return this.levelsService.createLevel(level);
  }

  @Get()
  async getAllLevels() {
    return this.levelsService.getAll();
  }

  @Get(':id')
  async getLevelById(@Param('id') id: number) {
    return this.levelsService.getById(id);
  }

  @Get('act/:act/sequence/:sequence')
  async getLevelBySequence(
    @Param('act') act: number,
    @Param('sequence') sequence: number,
  ) {
    return this.levelsService.getByActAndSequence(act, sequence);
  }

  @Put(':id')
  async updateLevel(
    @Param('id') id: number,
    @Body('level') level: LevelCreateDto,
  ) {
    return this.levelsService.updateLevel(id, level);
  }
}
