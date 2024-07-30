import { IsNotEmpty } from 'class-validator';

export class AccountCreateDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  name: string;
}
