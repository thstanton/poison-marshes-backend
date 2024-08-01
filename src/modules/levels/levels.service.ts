import { Injectable } from '@nestjs/common';
import { LevelsRepository } from './levels.repository';
import { ResendService } from '../resend/resend.service';
import { EmailSendDto } from '../resend/email.dto';
import { LevelCreateDto, LevelCreateManyDto } from './level-create.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LevelsService {
  constructor(
    private repository: LevelsRepository,
    private resendService: ResendService,
  ) {}

  async getOne(id: number) {
    return this.repository.getById(id);
  }

  async trySolution(levelId: number, solution: string) {
    const level = await this.repository.getById(levelId);
    const cleanSolution = solution.trim().toLowerCase();
    if (level.solution === cleanSolution) {
      return true;
    }
    return false;
  }

  async getMaxLevel() {
    const maxLevel = await this.repository.getMaxLevel();
    return maxLevel.id;
  }

  async initialiseLevel(levelId: number, userEmail: string) {
    const level = await this.repository.levelHasEmail(levelId);
    if (level.email) {
      const { from, subject, text, html } = level.email;
      const email: EmailSendDto = {
        to: userEmail,
        from,
        subject,
        text,
        html,
      };
      const emailResult = await this.resendService.emailSingleUser(email);

      if (emailResult.error) {
        // TODO: handle error
      }

      return emailResult;
    }
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

  async createLevel(levelCreateDto: LevelCreateDto) {
    const data = this.formatLevelData(levelCreateDto);
    return this.repository.create({ data });
  }

  async createManyLevels(levels: LevelCreateManyDto[]) {
    const data: Prisma.LevelCreateManyInput[] = [];
    levels.forEach((level) => {
      const formattedLevel = this.formatManyLevelsData(level);
      data.push(formattedLevel);
    });
    return this.repository.createMany({ data });
  }
}
