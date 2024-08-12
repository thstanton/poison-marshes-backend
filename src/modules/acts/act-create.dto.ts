import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsOptional()
  @IsString()
  preStartMessage?: string;
}
