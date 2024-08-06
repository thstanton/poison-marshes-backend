import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsArray, IsString } from 'class-validator';

export class LevelUpdateDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sequence?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  flavourText?: string;

  @IsOptional()
  task?: string;

  @IsOptional()
  solution?: string;

  @IsOptional()
  @IsArray()
  hint?: string[];

  @IsString()
  @IsOptional()
  videoId?: string;
}
