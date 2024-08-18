import { Injectable, Logger } from '@nestjs/common';
import { LevelsRepository } from './levels.repository';
import { ResendService } from '../resend/resend.service';
import { EmailCreateDto, EmailSendDto } from '../resend/email.dto';
import { LevelCreateDto } from './level-create.dto';
import { Level, Prisma } from '@prisma/client';
import { LevelUpdateDto } from './level-update.dto';
import { EmailUpdateDto } from '../resend/email-update.dto';
import {
  LevelWithActAndActEndEmail,
  LevelWithActAndEmail,
  LevelWithEmail,
} from 'src/types/prisma-custom-types';
import { InitialiseLevelReturn } from 'src/types/custom-types';

@Injectable()
export class LevelsService {
  constructor(
    private repository: LevelsRepository,
    private resendService: ResendService,
  ) {}

  private readonly logger = new Logger(LevelsService.name);

  async getById(id: number): Promise<Level> {
    return this.repository.getById({ where: { id } });
  }

  async getByActAndSequence(act: number, sequence: number): Promise<Level> {
    return this.repository.getOne({
      where: { sequence, act: { sequence: act } },
    });
  }

  async getAll(): Promise<LevelWithActAndEmail[]> {
    return this.repository.getAll({
      include: {
        act: true,
        email: true,
      },
      orderBy: [{ actSequence: 'asc' }, { sequence: 'asc' }],
    });
  }

  async getAllNames() {
    return this.repository.getAll({
      select: {
        name: true,
        id: true,
        sequence: true,
        actSequence: true,
      },
    });
  }

  async getCompletedLevels(levelId: number): Promise<LevelWithEmail[]> {
    const { sequence, actSequence }: Level = await this.getById(levelId);

    const levels = await this.repository.getAll({
      where: {
        OR: [
          {
            actSequence,
            sequence: {
              lt: sequence,
            },
          },
          {
            actSequence: {
              lt: actSequence,
            },
          },
        ],
      },
      include: {
        email: true,
      },
      orderBy: [{ actSequence: 'desc' }, { sequence: 'desc' }],
    });
    return levels;
  }

  async getNextLevel(levelId: number): Promise<LevelWithActAndActEndEmail> {
    const { sequence, actSequence }: Level = await this.getById(levelId);
    return this.repository.getOne({
      where: {
        OR: [
          {
            actSequence,
            sequence: {
              gt: sequence,
            },
          },
          {
            actSequence: {
              gt: actSequence,
            },
          },
        ],
      },
      orderBy: [{ actSequence: 'asc' }, { sequence: 'asc' }],
      include: {
        act: {
          include: {
            endEmail: true,
          },
        },
      },
    });
  }

  async trySolution(levelId: number, solution: string): Promise<boolean> {
    const level = await this.repository.getById({ where: { id: levelId } });

    const cleanUserSolution = solution.trim().toLowerCase();
    const cleanLevelSolution = level.solution.trim().toLowerCase();

    if (cleanLevelSolution === cleanUserSolution) {
      return true;
    }
    return false;
  }

  async initialiseLevel(
    levelId: number,
    userName: string,
    userEmail: string,
  ): Promise<InitialiseLevelReturn> {
    const level: LevelWithActAndEmail = await this.repository.getById({
      where: { id: levelId },
      include: { act: true, email: true },
    });

    const bodyPrepend = `Dear ${userName}`;
    const bodyAppend =
      'This email is part of The Poison Marshes. https://poison-marshes.alrewas-artsfest.co.uk';

    const email: EmailSendDto = {
      to: userEmail,
      from: level.email.from,
      subject: level.email.subject,
      text: `${bodyPrepend} ${level.email.text} ${bodyAppend}`,
      html: `<p>${bodyPrepend}</p>${level.email.html}<br /><br /><p><i>${bodyAppend}</i></p>`,
    };

    if (level.email) {
      if (level.act.inProgress) {
        try {
          const emailResponse = await this.resendService.emailSingleUser(email);
          return { level, email: 'sent', emailResponse: emailResponse };
        } catch (error) {
          this.logger.error(error);
        }
      } else {
        try {
          const scheduleEmailResponse = await this.resendService.scheduleEmail({
            to: userEmail,
            scheduledFor: level.act.startDate,
            levelId: level.id,
          });
          return {
            level,
            email: 'scheduled',
            emailResponse: scheduleEmailResponse,
          };
        } catch (error) {
          this.logger.error(error);
        }
      }
    } else {
      return { level, email: 'none', emailResponse: null };
    }
  }

  private formatLevelData(
    levelCreateDto: LevelCreateDto,
  ): Prisma.LevelCreateInput {
    const {
      sequence,
      actSequence,
      name,
      flavourText,
      task,
      solution,
      hints,
      email,
      videoId,
    } = levelCreateDto;

    const formattedData: Prisma.LevelCreateInput = {
      sequence,
      name,
      flavourText,
      task,
      hints,
      solution,
      act: {
        connect: {
          sequence: actSequence,
        },
      },
    };

    if (videoId) formattedData.videoId = videoId;
    if (email) {
      formattedData.email = {
        create: {
          from: email.from,
          subject: email.subject,
          text: email.text,
          html: email.html,
        },
      };
    }

    return formattedData;
  }

  async createLevel(levelCreateDto: LevelCreateDto): Promise<Level> {
    const data = this.formatLevelData(levelCreateDto);
    return this.repository.create({ data });
  }

  async createLevelEmail(
    email: EmailCreateDto,
    levelId: number,
  ): Promise<LevelWithEmail> {
    const { from, subject, text, html } = email;
    return this.repository.update({
      where: {
        id: levelId,
      },
      data: {
        email: {
          create: {
            from,
            subject,
            text,
            html,
          },
        },
      },
      include: {
        email: true,
      },
    }) as Promise<LevelWithEmail>;
  }

  async updateLevel(
    levelId: number,
    levelUpdateDto: LevelUpdateDto,
  ): Promise<Level> {
    return this.repository.update({
      where: {
        id: levelId,
      },
      data: {
        ...levelUpdateDto,
      },
    }) as Promise<Level>;
  }

  async updateLevelEmail(
    levelId: number,
    emailUpdateDto: EmailUpdateDto,
  ): Promise<LevelWithEmail> {
    return this.repository.update({
      where: {
        id: levelId,
      },
      data: {
        email: {
          update: {
            ...emailUpdateDto,
          },
        },
      },
    }) as Promise<LevelWithEmail>;
  }

  async deleteLevel(id: number): Promise<Level> {
    return this.repository.delete({ where: { id } }) as Promise<Level>;
  }

  async deleteLevelEmail(id: number) {
    return this.resendService.deleteEmail(id);
  }
}
