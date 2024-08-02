import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailCreateDto {
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
}

export class EmailSendDto {
  @IsNotEmpty()
  @IsEmail({
    require_display_name: true,
  })
  from: string;

  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  html: string;
}
