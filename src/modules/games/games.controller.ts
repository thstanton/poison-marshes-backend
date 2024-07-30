import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body('accountId') accountId: number) {
    return this.gamesService.create(accountId);
  }
}
