import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../schemas/user.schema';

export class UserDto {
  @Expose({ name: 'id' })
  @Transform(({ value }) => (value ? value.valueOf() : value))
  _id: string;

  username: string;

  roles: Array<string>;

  email: string;

  @Exclude()
  passwordHash: string;

  @Exclude()
  __v: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    if (partial.roles) this.roles = partial.roles.concat(['user']);
  }
}
