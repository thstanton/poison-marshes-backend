import { IsEmail, IsNotEmpty } from 'class-validator';

export class AccountCreateDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
