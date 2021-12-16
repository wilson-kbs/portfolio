import { IsNumber, IsString } from 'class-validator';

export class CreateSkillDto {
  @IsNumber()
  index: number;

  @IsString()
  name: string;

  @IsString()
  img: string;

  @IsNumber()
  lvl: number;
}
