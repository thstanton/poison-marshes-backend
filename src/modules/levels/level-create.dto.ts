import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
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
  actSequence: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  flavourText: string;

  @IsNotEmpty()
  @IsString()
  task: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsArray()
  hints: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => EmailCreateDto)
  email?: EmailCreateDto;

  @IsString()
  @IsOptional()
  videoId?: string;
}

export class LevelCreateManyDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  sequence: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  flavourText: string;

  @IsNotEmpty()
  task: string;

  @IsOptional()
  solution?: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsArray()
  hints: string[];

  @IsString()
  @IsOptional()
  videoId?: string;
}
