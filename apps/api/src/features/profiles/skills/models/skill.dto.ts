import { Expose, Transform } from 'class-transformer';
import { Skill } from '../schemas/skill.schema';

export class SkillDto {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.valueOf())
  _id: string;

  index: number;

  name: string;

  img: string;

  lvl: number;

  constructor(partial: Partial<Skill>) {
    Object.assign(this, partial);
  }
}
