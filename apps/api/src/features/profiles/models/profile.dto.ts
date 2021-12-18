import { Exclude, Expose, Transform } from 'class-transformer';
import { Profile } from '../schemas/profile.schema';
import { Skill } from '../skills/schemas/skill.schema';
import { Project } from '../projects/schemas/project.schema';

export class ProfileDto {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.valueOf())
  _id: string;

  firstname: string;

  lastname: string;

  img: string;

  bio: string;

  @Exclude()
  fullnamequery: string;

  @Exclude()
  skills: Array<Skill>;

  @Exclude()
  projects: Array<Project>;

  @Exclude()
  user: object;

  @Exclude()
  __v: number;

  constructor(profile: Partial<Profile>) {
    Object.assign(this, profile);
  }
}
