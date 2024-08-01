import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { UsersService } from '../users/users.service';
import { EmailDto, EmailSendDto } from './email.dto';
import { EmailsRepository } from './emails.repository';
import {
  CreateBatchResponse,
  CreateEmailResponse,
} from 'src/types/resend-types';

@Injectable()
export class ResendService extends Resend {
  constructor(
    private usersService: UsersService,
    private repository: EmailsRepository,
  ) {
    super(process.env.RESEND_API_KEY);
  }

  private readonly logger = new Logger();

  async emailAllUsers(email: EmailDto): Promise<CreateBatchResponse> {
    const users = await this.usersService.getAll();
    const emails: EmailSendDto[] = [];
    users.forEach((user) => {
      emails.push({
        from: email.from,
        to: user.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });
    });
    const response: CreateBatchResponse = await this.batch.send(emails);

    return response;
  }

  async emailSingleUser(email: EmailSendDto): Promise<CreateEmailResponse> {
    const response: CreateEmailResponse = await this.emails.send(email);
    return response;
  }
}
