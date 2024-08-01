import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AccountCreateDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsNotEmpty()
  name: string;
}
