import { Injectable } from '@nestjs/common';
import { GamesRepository } from './games.repository';
import { LevelsService } from '../levels/levels.service';

@Injectable()
export class GamesService {
  constructor(
    private repository: GamesRepository,
    private levelsService: LevelsService,
  ) {}

  async create(accountId: number) {
    return this.repository.createNew({
      data: {
        account: {
          connect: { id: accountId },
        },
      },
    });
  }

  async levelUp(accountId: number, solution: string) {
    const game = await this.repository.getByAccountWithLevelAndUser(accountId);
    if (this.levelsService.trySolution(game.levelId, solution)) {
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
}
