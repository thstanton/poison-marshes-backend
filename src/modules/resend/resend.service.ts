import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailCreateDto, EmailSendDto } from './email.dto';
import {
  CreateBatchResponse,
  CreateEmailResponse,
} from 'src/types/resend-types';

@Injectable()
export class ResendService extends Resend {
  constructor() {
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
}
