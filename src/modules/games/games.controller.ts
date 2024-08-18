import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { GuardedRequest } from 'src/types/custom-types';
import { AccountWithUserWithoutPassword } from 'src/types/prisma-custom-types';
import { RolesGuard } from 'src/auth/roles-guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('games')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  private logger = new Logger(GamesController.name);

  @Get()
  @Roles('admin')
  async getAll() {
    return this.gamesService.getAll();
  }

  @Post('create')
  @Roles('admin')
  async create(@Req() req: GuardedRequest) {
    this.logger.debug('Creating new game' + req.account);
    const { id }: AccountWithUserWithoutPassword = req.account;
    return this.gamesService.create(id);
  }

  @Post('initialise-all')
  @Roles('admin')
  async initialiseAll() {
    return this.gamesService.initialiseAllGames();
  }

  @Put('advance-level')
  async advanceLevel(
    @Req() req: GuardedRequest,
    @Body('solution') solution: string,
  ) {
    const { id }: AccountWithUserWithoutPassword = req.account;
    return this.gamesService.levelUp(id, solution);
  }

  @Roles('admin')
  @Put('update/:gameId/:levelId')
  async update(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('levelId', ParseIntPipe) levelId: number,
  ) {
    return this.gamesService.update(gameId, levelId);
  }

  @Get('current')
  async current(@Req() req: GuardedRequest) {
    const { id }: AccountWithUserWithoutPassword = req.account;
    return this.gamesService.getCurrent(id);
  }
}
