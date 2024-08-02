import { IsEmail, IsOptional } from 'class-validator';

export class EmailUpdateDto {
  @IsOptional()
  @IsEmail({
    require_display_name: true,
  })
  from?: string;

  @IsOptional()
  @IsEmail()
  to?: string;

  @IsOptional()
  subject?: string;

  @IsOptional()
  text?: string;

  @IsOptional()
  html?: string;
}
