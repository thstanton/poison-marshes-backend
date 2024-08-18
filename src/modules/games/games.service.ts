import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GamesRepository } from './games.repository';
import { LevelsService } from '../levels/levels.service';
import {
  GameWithAccountAndUser,
  GameWithLevelAndAct,
  GameWithUserEmail,
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
      game.account.name,
      game.account.user.email,
    );
  }

  async initialiseAllGames() {
    const games: GameWithAccountAndUser[] = await this.repository.getAll({
      include: {
        account: {
          include: {
            user: true,
          },
        },
      },
    });
    const promises = games.map((game: GameWithAccountAndUser) =>
      this.initialiseGame(game),
    );
    return Promise.all(promises);
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
    return this.repository.getOne({
      where: { accountId },
      include: {
        level: {
          include: {
            act: true,
            email: true,
          },
        },
      },
    });
  }

  async getAll() {
    return this.repository.getAll({
      include: {
        level: {
          select: {
            sequence: true,
            actSequence: true,
            name: true,
          },
        },
        account: {
          select: {
            name: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        { level: { actSequence: 'asc' } },
        { level: { sequence: 'asc' } },
      ],
    });
  }

  // TODO: If levelling up to a new act, send endAct email
  async levelUp(accountId: number, solution: string) {
    // Fetch current game and very it exists
    const game: GameWithLevelAndAct = await this.repository.getOne({
      where: { accountId },
      include: {
        level: {
          include: {
            act: true,
          },
        },
      },
    });

    if (!game) throw new NotFoundException('Game not found');

    // Check if solution is correct
    const solutionIsCorrect = await this.levelsService.trySolution(
      game.levelId,
      solution,
    );

    if (!solutionIsCorrect) {
      this.logger.log(accountId + ': Incorrect solution - ' + solution);
      throw new HttpException(
        'Incorrect solution',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Get next level
    const currLevel = game.level;
    const nextLevel: { id: number; sequence: number; actSequence: number } =
      await this.levelsService.getNextLevelId(currLevel.id);

    // Verify next level is allowed - can progress within inProgress act, but only to level 1 of !inProgress act
    const nextLevelIsAllowed: boolean =
      (currLevel.actSequence === nextLevel.actSequence &&
        currLevel.act.inProgress) ||
      (nextLevel.actSequence === currLevel.actSequence + 1 &&
        nextLevel.sequence === 1);

    if (!nextLevelIsAllowed) {
      this.logger.error(
        `Account ${accountId}: Cannot increase level - trying to progress within !inProgress act (${currLevel.id} -> ${nextLevel.id})`,
      );
      throw new HttpException(
        'Cannot increase level yet - act on pause',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    // Increase level
    try {
      await this.increaseLevel(game.id, nextLevel.id).then(
        (data: GameWithUserEmail) => {
          this.logger.log(
            `Increased level for account: ${data.accountId}, User: ${data.account.user.email}`,
          );
          this.levelsService.initialiseLevel(
            data.levelId,
            data.account.name,
            data.account.user.email,
          );
        },
      );
      return { level: nextLevel };
    } catch (error) {
      this.logger.error(
        `${error} when trying to increase level for account ${accountId}`,
      );
      throw new HttpException(
        'Cannot increase level: ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async increaseLevel(
    gameId: number,
    levelId: number,
  ): Promise<GameWithUserEmail> {
    return this.repository.update({
      where: { id: gameId },
      data: {
        level: {
          connect: { id: levelId },
        },
      },
      include: {
        account: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getCurrentLevel(accountId: number) {
    return this.repository.getCurrentLevel({ where: { id: accountId } });
  }

  async update(gameId: number, levelId: number) {
    return this.repository.update({
      where: { id: gameId },
      data: {
        level: {
          connect: { id: levelId },
        },
      },
    });
  }
}
