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
import { Game } from '@prisma/client';

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
  // TODO: Ensure people cannot level up with a QR code beyond the first level of an act that is not inProgress
  async levelUp(accountId: number, solution: string) {
    const game: Game = await this.repository.getOne({
      where: { accountId },
    });

    if (!game) throw new NotFoundException('Game not found');

    const solutionIsCorrect = await this.levelsService.trySolution(
      game.levelId,
      solution,
    );

    if (solutionIsCorrect) {
      try {
        const nextLevel: { id: number } =
          await this.levelsService.getNextLevelId(game.levelId);

        await this.increaseLevel(game.id, nextLevel.id).then(
          (data: GameWithUserEmail) => {
            this.logger.log(
              `Increased level for Game: ${data.accountId}, User: ${data.account.user.email}`,
            );
            this.levelsService.initialiseLevel(
              data.levelId,
              data.account.user.email,
            );
          },
        );

        return { level: nextLevel };
      } catch (error) {
        throw new HttpException(
          'Cannot increase level',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        'Incorrect solution',
        HttpStatus.UNPROCESSABLE_ENTITY,
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
