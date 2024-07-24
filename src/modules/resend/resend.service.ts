import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { UsersService } from '../users/users.service';
import { EmailDto } from './email.dto';

@Injectable()
export class ResendService extends Resend {
  constructor(private usersService: UsersService) {
    super(process.env.RESEND_API_KEY);
  }

  async emailAllUsers(email: EmailDto) {
    const users = await this.usersService.getAll();
    users.forEach((user) => {
      this.emails.send({
        from: email.from,
        to: user.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });
    });
  }

  async emailSingleUser(email: EmailDto) {
    if (email.to) {
      this.emails.send({
        from: email.from,
        to: email.to,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });
    }
  }
}
