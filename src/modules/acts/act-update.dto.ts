import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LevelCreateManyDto } from '../levels/level-create.dto';

export class ActUpdateDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sequence: number;

  @IsOptional()
  name: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsString()
  preStartMessage?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => LevelCreateManyDto)
  levels: LevelCreateManyDto[];
}
