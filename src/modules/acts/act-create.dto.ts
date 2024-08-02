import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class ActCreateDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  sequence: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;
}
