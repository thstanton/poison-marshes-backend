import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { EmailCreateDto } from '../resend/email.dto';

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

  @Post(':id/email')
  @Roles('admin')
  async createLevelEmail(
    @Param('id') id: number,
    @Body('email') email: EmailCreateDto,
  ) {
    return this.levelsService.createLevelEmail(email, id);
  }

  @Get()
  @Roles('admin')
  async getAllLevels() {
    return this.levelsService.getAll();
  }

  @Get('names')
  @Roles('admin')
  async getAllLevelNames() {
    return this.levelsService.getAllNames();
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

  @Get('completed/:id')
  async getCompletedLevels(@Param('id') id: number) {
    return this.levelsService.getCompletedLevels(id);
  }

  @Get('next-level/:id')
  async getNextLevel(@Param('id') id: number) {
    return this.levelsService.getNextLevelId(id);
  }

  @Get('email/:id')
  async getEmail(@Param('id', ParseIntPipe) id: number) {
    return this.levelsService.getEmail(id);
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
