import { Injectable } from '@nestjs/common';
import { LevelsRepository } from './levels.repository';
import { ResendService } from '../resend/resend.service';
import { EmailDto } from '../resend/email.dto';

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
      const email: EmailDto = {
        to: userEmail,
        from,
        subject,
        text,
        html,
      };
      await this.resendService.emailSingleUser(email);
    }
  }
}
