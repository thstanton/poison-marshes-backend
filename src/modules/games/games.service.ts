import { Injectable, Logger } from '@nestjs/common';
import { GamesRepository } from './games.repository';
import { LevelsService } from '../levels/levels.service';
// import { Cron } from '@nestjs/schedule';
import { AccountsService } from '../accounts/accounts.service';
import { GameWithAccountAndUser } from 'src/types/prisma-custom-types';

@Injectable()
export class GamesService {
  constructor(
    private repository: GamesRepository,
    private levelsService: LevelsService,
    private accountsService: AccountsService,
  ) {}

  private readonly logger = new Logger(GamesService.name);

  async create(accountId: number) {
    return this.repository.createNew({
      data: {
        account: {
          connect: { id: accountId },
        },
      },
    });
  }

  // @Cron(new Date('2024-07-30T22:50:00'))
  async createMany() {
    const accounts = await this.accountsService.getAllAccountIds();
    await this.repository.createMany({
      data: accounts.map((account) => ({
        accountId: account.id,
      })),
    });
    const games: GameWithAccountAndUser[] = await this.repository.getAll();
    games.forEach((game) => {
      this.logger.log(`Created new game for ${game.account.user.email}`);
      this.levelsService.initialiseLevel(game.levelId, game.account.user.email);
    });
  }

  async levelUp(accountId: number, solution?: string) {
    const game = await this.repository.getByAccountWithLevelAndUser(accountId);
    if (
      this.levelsService.trySolution(game.levelId, solution) ||
      !game.level.solution
    ) {
      const maxLevel: number = await this.levelsService.getMaxLevel();
      if (game.levelId === maxLevel) {
        throw new Error('Max level reached');
      }
      const newLevel = await this.repository.increaseLevel(game.levelId);
      await this.levelsService.initialiseLevel(
        newLevel.id,
        game.account.user.email,
      );
      return newLevel;
    } else {
      return { message: 'Incorrect solution' };
    }
  }

  async getCurrentLevel(accountId: number) {
    return this.repository.getCurrentLevel({ where: { id: accountId } });
  }
}
