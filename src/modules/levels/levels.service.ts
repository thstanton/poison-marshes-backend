import { Injectable } from '@nestjs/common';
import { LevelsRepository } from './levels.repository';
import { ResendService } from '../resend/resend.service';
import { EmailCreateDto, EmailSendDto } from '../resend/email.dto';
import { LevelCreateDto, LevelCreateManyDto } from './level-create.dto';
import { Level, Prisma } from '@prisma/client';
import { LevelUpdateDto } from './level-update.dto';
import { EmailUpdateDto } from '../resend/email-update.dto';
import { LevelWithEmail } from 'src/types/prisma-custom-types';
import { CreateEmailResponse } from 'src/types/resend-types';
import { InitialiseLevelReturn } from 'src/types/custom-types';

@Injectable()
export class LevelsService {
  constructor(
    private repository: LevelsRepository,
    private resendService: ResendService,
  ) {}

  async getById(id: number): Promise<Level> {
    return this.repository.getById({ where: { id } });
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

  async getMaxLevel(): Promise<number> {
    const maxLevel: Level = (await this.repository.getOne({
      orderBy: {
        sequence: 'desc',
      },
      take: 1,
      select: {
        id: true,
      },
    })) as Level;
    return maxLevel.sequence;
  }

  private async sendEmail(
    userEmail: string,
    email: EmailCreateDto,
  ): Promise<CreateEmailResponse> {
    const { from, subject, text, html } = email;
    const sendEmail: EmailSendDto = {
      to: userEmail,
      from,
      subject,
      text,
      html,
    };

    return this.resendService.emailSingleUser(sendEmail);
  }

  async initialiseLevel(
    levelId: number,
    userEmail: string,
  ): Promise<InitialiseLevelReturn> {
    const level: LevelWithEmail = (await this.repository.getById({
      where: { id: levelId },
    })) as LevelWithEmail;

    if (level.email) {
      const emailResult: CreateEmailResponse = await this.sendEmail(
        userEmail,
        level.email,
      );
      return { level, email: emailResult };
    }

    return { level, email: 'No email' };
  }

  private formatLevelData(
    levelCreateDto: LevelCreateDto,
  ): Prisma.LevelCreateInput {
    const {
      sequence,
      act,
      name,
      flavourText,
      task,
      solution,
      hint,
      email,
      videoUrl,
    } = levelCreateDto;

    const formattedData: Prisma.LevelCreateInput = {
      sequence,
      act,
      name,
      flavourText,
      task,
      hint,
    };

    if (solution) formattedData.solution = solution;
    if (videoUrl) formattedData.videoUrl = videoUrl;
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

  private formatManyLevelsData(
    levelCreateManyDto: LevelCreateManyDto,
  ): Prisma.LevelCreateManyInput {
    const { sequence, act, name, flavourText, task, solution, hint, videoUrl } =
      levelCreateManyDto;

    const formattedData: Prisma.LevelCreateManyInput = {
      sequence,
      act,
      name,
      flavourText,
      task,
      hint,
    };

    if (solution) formattedData.solution = solution;
    if (videoUrl) formattedData.videoUrl = videoUrl;

    return formattedData;
  }

  async createLevel(levelCreateDto: LevelCreateDto): Promise<Level> {
    const data = this.formatLevelData(levelCreateDto);
    return this.repository.create({ data });
  }

  async createManyLevels(levels: LevelCreateManyDto[]): Promise<Level[]> {
    const data: Prisma.LevelCreateManyInput[] = [];
    levels.forEach((level) => {
      const formattedLevel = this.formatManyLevelsData(level);
      data.push(formattedLevel);
    });
    return this.repository.createMany({ data });
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
}
