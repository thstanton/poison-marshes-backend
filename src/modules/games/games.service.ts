import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GamesRepository } from './games.repository';
import { LevelsService } from '../levels/levels.service';
import {
  GameWithAccountAndUser,
  GameWithLevelAndAct,
} from 'src/types/prisma-custom-types';
import { InitialiseLevelReturn } from 'src/types/custom-types';

@Injectable()
export class GamesService {
  constructor(
    private repository: GamesRepository,
    private levelsService: LevelsService,
  ) {}

  private readonly logger = new Logger(GamesService.name);

  private async initialiseGame(
    game: GameWithAccountAndUser,
  ): Promise<InitialiseLevelReturn> {
    return this.levelsService.initialiseLevel(
      game.levelId,
      game.account.user.email,
    );
  }

  async create(accountId: number) {
    const game: GameWithAccountAndUser = await this.repository.createNew({
      data: {
        account: {
          connect: { id: accountId },
        },
        level: {
          connect: {
            sequence_actSequence: {
              sequence: 0,
              actSequence: 0,
            },
          },
        },
      },
    });

    if (!game) throw new NotFoundException('Game not found');
    this.logger.log(`Created new game for ${game.account.user.email}`);

    const initialiseResult = await this.initialiseGame(game);

    return { game, initialiseResult };
  }

  async getCurrent(accountId: number): Promise<GameWithLevelAndAct> {
    return this.repository.getByAccount({
      where: { accountId },
      include: { level: { include: { act: true } } },
    });
  }

  async levelUp(gameId: number, solution: string) {
    const game = await this.repository.getByAccount({
      where: { id: gameId },
    });

    if (!game) throw new NotFoundException('Game not found');

    if (this.levelsService.trySolution(game.levelId, solution)) {
      const nextLevel = await this.levelsService.getNextLevelId(game.levelId);
      if (nextLevel.length === 0) return { error: 'Max level reached' };
      await this.increaseLevel(gameId, nextLevel[0]);

      return { level: nextLevel };
    } else {
      return { error: 'Incorrect solution' };
    }
  }

  private async increaseLevel(gameId: number, levelId: number) {
    return this.repository.update({
      where: { id: gameId },
      data: {
        level: {
          connect: { id: levelId },
        },
      },
    });
  }

  async getCurrentLevel(accountId: number) {
    return this.repository.getCurrentLevel({ where: { id: accountId } });
  }
}
