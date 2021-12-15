import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Account } from '../../../schemas/account.entity';
import { ObjectID } from 'typeorm';

export class AccountDto {
  constructor(partial: Partial<Account>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  readonly id: ObjectID;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @Exclude()
  readonly passwordHash: string;
}
