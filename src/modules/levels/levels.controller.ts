import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelCreateDto } from './level-create.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles-guard/roles.guard';
import { LevelUpdateDto } from './level-update.dto';

@Controller('levels')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  @Roles('admin')
  async createLevel(@Body('level') level: LevelCreateDto) {
    return this.levelsService.createLevel(level);
  }

  @Get()
  @Roles('admin')
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
  @Roles('admin')
  async updateLevel(
    @Param('id') id: number,
    @Body('level') level: LevelUpdateDto,
  ) {
    return this.levelsService.updateLevel(id, level);
  }
}
