import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { UsersService } from '../users/users.service';
import { EmailDto, EmailSendDto } from './email.dto';
import { EmailsRepository } from './emails.repository';
import {
  CreateBatchResponse,
  CreateBatchSuccessResponse,
  CreateEmailResponse,
  CreateEmailResponseSuccess,
  ErrorResponse,
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

  async emailAllUsers(
    email: EmailDto,
  ): Promise<CreateBatchSuccessResponse | ErrorResponse> {
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
    const { data, error }: CreateBatchResponse = await this.batch.send(emails);

    if (error) return error;

    return data;
  }

  async emailSingleUser(
    email: EmailSendDto,
  ): Promise<ErrorResponse | CreateEmailResponseSuccess> {
    const { data, error }: CreateEmailResponse = await this.emails.send(email);

    if (error) return error;

    return data;
  }
}
