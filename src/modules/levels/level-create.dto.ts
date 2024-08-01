import { IsNotEmpty, IsUrl } from 'class-validator';
import { EmailDto } from '../resend/email.dto';

export class LevelCreateDto {
  @IsNotEmpty()
  id: number;

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

  email?: EmailDto;

  @IsUrl()
  videoUrl?: string;
}

export class LevelCreateManyDto {
  @IsNotEmpty()
  id: number;

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
