import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsArray, IsUrl } from 'class-validator';

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

  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}
