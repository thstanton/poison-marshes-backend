import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { GuardedRequest } from 'src/types/custom-types';
import { AccountWithUserWithoutPassword } from 'src/types/prisma-custom-types';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('create')
  async create(@Req() req: GuardedRequest) {
    const { id }: AccountWithUserWithoutPassword = req.account;
    return this.gamesService.create(id);
  }

  @Get('current-level')
  async currentLevel(@Req() req: GuardedRequest) {
    const { id }: AccountWithUserWithoutPassword = req.account;
    return this.gamesService.getCurrentLevel(id);
  }

  @Put('advance-level')
  async advanceLevel(
    @Req() req: GuardedRequest,
    @Body('solution') solution?: string,
  ) {
    const { id }: AccountWithUserWithoutPassword = req.account;
    return this.gamesService.levelUp(id, solution);
  }
}
