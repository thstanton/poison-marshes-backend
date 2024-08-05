import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GamesRepository } from './games.repository';
import { LevelsService } from '../levels/levels.service';
import { GameWithAccountAndUser } from 'src/types/prisma-custom-types';
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

  async levelUp(accountId: number, solution?: string) {
    const game = await this.repository.getByAccountWithLevelAndUser(accountId);

    if (!game) throw new NotFoundException('Game not found');

    if (
      !game.level.solution ||
      this.levelsService.trySolution(game.levelId, solution)
    ) {
      const maxLevel: number = await this.levelsService.getMaxLevel();
      if (game.levelId === maxLevel) {
        throw new Error('Max level reached');
      }
      // TODO: Validate that the user is moving to the correct level
      // TODO: Fix level increase logic to use sequence instead of id
      // TODO: Implement acts
      const newLevel = await this.repository.increaseLevel(game.id);

      const emailResult = await this.levelsService.initialiseLevel(
        newLevel.id,
        game.account.user.email,
      );

      return { newLevel, emailResult };
    } else {
      return { error: 'Incorrect solution' };
    }
  }

  async getCurrentLevel(accountId: number) {
    return this.repository.getCurrentLevel({ where: { id: accountId } });
  }
}
