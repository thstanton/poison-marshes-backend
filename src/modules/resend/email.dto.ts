import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class EmailDto {
  @IsNotEmpty()
  @IsEmail({
    require_display_name: true,
  })
  from: string;

  @IsOptional()
  @IsEmail()
  to?: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  text: string;
  html: string;
}
