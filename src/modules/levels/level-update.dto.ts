import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsArray,
  IsString,
  MinLength,
} from 'class-validator';

export class LevelUpdateDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sequence?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  flavourText?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  task?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  solution?: string;

  @IsOptional()
  @IsArray()
  hint?: string[];

  @IsString()
  @IsOptional()
  @MinLength(1)
  videoId?: string;
}
