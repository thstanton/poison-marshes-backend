import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ResendService } from 'src/modules/resend/resend.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateEmailResponse } from 'resend';
import { JwtService } from '@nestjs/jwt';

@Controller('api')
export class ApiController {
  constructor(
    private readonly userService: UsersService,
    private readonly resendService: ResendService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('new-user')
  async newUserConfirm(@Req() req: Request) {
    const { email } = req.body;
    console.log(email);
    const token = this.jwtService.sign({ email }, { expiresIn: '1d' });
    const user = await this.userService.create({ email });
    if (user) {
      const { data, error }: CreateEmailResponse =
        await this.resendService.emails.send({
          from: 'truthseeker <poisonmarshestruth@cliki.in>',
          to: email,
          subject: 'Welcome Truthseeker',
          text: `
        Dear Truthseeker, 
        We need your help. There is much to learn.
        Go to this address to begin your journey: ${process.env.REGISTER_URL}?token=${token} 
        From, The Poison Marshes Team
        `,
          html: `
        <p>Dear Truthseeker,</p>
        <p>We need your help. There is much to learn.</p>
        <a href="${process.env.REGISTER_URL}?token=${token}">Click here to begin your journey to enlightenment.</a>
        <p>From, The Poison Marshes Team</p>
        `,
        });
      if (error) {
        return error;
      }
      return data;
    }
  }

  @Get('register')
  async register(@Query('token') token: string) {
    const { email } = this.jwtService.verify(token);
    if (email) {
      const user = await this.userService.registerUser({ email });
      if (user) {
        const { data, error }: CreateEmailResponse =
          await this.resendService.emails.send({
            from: 'truthseeker <poisonmarshestruth@cliki.in>',
            to: email,
            subject: 'Your Path to Enlightenment Has Begun',
            text: `
              Dear Truthseeker,
              Well met. You have taken your first step towards the truth.
              The village needs you.
              Further instructions will follow when the festival begins.
              `,
            html: `
              <p>Dear Truthseeker,</p>
              <p>Well met. You have taken your first step towards the truth.</p>
              <p>The village needs you.</p>
              <p>Further instructions will follow when the festival begins.</p>
              `,
          });
        if (error) {
          return error;
        }
        return data;
      }
    }
  }

  @Get('users')
  async users() {
    return this.userService.getAll();
  }
}
