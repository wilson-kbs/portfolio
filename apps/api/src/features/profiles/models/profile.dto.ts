import { Exclude, Expose, Transform } from 'class-transformer';
import { Profile } from '../schemas/profile.schema';

export class ProfileDto {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.valueOf())
  _id: string;

  firstname: string;

  lastname: string;

  @Expose({ name: 'image' })
  img: string;

  bio: string;

  @Exclude()
  fullnamequery: string;
  @Exclude()
  skills: Array<any>;

  @Exclude()
  projects: Array<any>;

  @Exclude()
  user: object;

  @Exclude()
  __v: number;

  constructor(profile: Partial<Profile>) {
    Object.assign(this, profile);
  }
}
