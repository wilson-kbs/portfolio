import { IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNumber()
  index: number;

  @IsString()
  img: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  link: string;
}
