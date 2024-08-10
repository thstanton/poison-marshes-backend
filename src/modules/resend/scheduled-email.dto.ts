import { IsDate, IsEmail, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduledEmailDto {
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsNotEmpty()
  @IsEmail({
    require_display_name: true,
  })
  from: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  html: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  scheduledFor: Date;
}
