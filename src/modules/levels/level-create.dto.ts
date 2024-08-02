import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { EmailCreateDto } from '../resend/email.dto';
import { Type } from 'class-transformer';

export class LevelCreateDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  sequence: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  act: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  flavourText: string;

  @IsNotEmpty()
  task: string;

  @IsOptional()
  solution?: string;

  @IsArray()
  hint: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => EmailCreateDto)
  email?: EmailCreateDto;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}

export class LevelCreateManyDto {
  @IsNotEmpty()
  sequence: number;

  @IsNotEmpty()
  act: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  flavourText: string;

  @IsNotEmpty()
  task: string;

  solution?: string;

  hint: string[];

  @IsUrl()
  videoUrl?: string;
}
