import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailCreateDto, EmailSendDto } from './email.dto';
import {
  CreateBatchResponse,
  CreateEmailResponse,
} from 'src/types/resend-types';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailsRepository } from './emails.repository';
import { ScheduledEmail } from '@prisma/client';
import { ScheduledEmailDto } from './scheduled-email.dto';

@Injectable()
export class ResendService extends Resend {
  constructor(private repository: EmailsRepository) {
    super(process.env.RESEND_API_KEY);
  }

  private readonly logger = new Logger(ResendService.name);

  async emailSingleUser(email: EmailSendDto): Promise<CreateEmailResponse> {
    const response: CreateEmailResponse = await this.emails.send(email);

    if (response.error) {
      this.logger.error(response.error);
    }

    return response;
  }

  async emailGroup(email: EmailCreateDto, users: string[]) {
    const emails: EmailSendDto[] = [];
    users.forEach((user) => {
      emails.push({
        from: email.from,
        to: user,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });
    });
    const response: CreateBatchResponse = await this.batch.send(emails);

    if (response.error) {
      this.logger.error(response.error);
    }

    return response;
  }

  async scheduleEmail(email: ScheduledEmailDto) {
    return this.repository.create({
      data: {
        to: email.to,
        scheduledFor: email.scheduledFor,
        from: email.from,
        subject: email.subject,
        text: email.text,
        html: email.html,
      },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async sendScheduledEmails() {
    const emails: ScheduledEmail[] = await this.repository.getAll({
      where: {
        scheduledFor: { lte: new Date() },
        sent: false,
      },
    });

    const batch: EmailSendDto[] = emails.map((email) => {
      return {
        from: email.from,
        to: email.to,
        subject: email.subject,
        text: email.text,
        html: email.html,
      };
    });

    const response: CreateBatchResponse = await this.batch.send(batch);
    this.logger.log(`Batch sending scheduled emails: ${response}`);

    if (response.data) {
      await this.repository.updateMany({
        where: {
          id: {
            in: emails.map((email) => email.id),
          },
        },
        data: {
          sent: true,
        },
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async cleanUpScheduledEmails() {
    const response = await this.repository.deleteMany({
      where: {
        scheduledFor: { lt: new Date() },
        sent: true,
      },
    });

    this.logger.log(`Batch deleting sent scheduled emails: ${response}`);
  }
}
