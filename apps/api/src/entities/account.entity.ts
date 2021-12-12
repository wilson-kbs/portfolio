import { Entity, ObjectID, ObjectIdColumn, Column, Index } from 'typeorm';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class Account {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Index({ unique: true })
  username: string;

  @Exclude()
  @Column()
  passwordHash: string;

  constructor(username: string, passwordHash: string) {
    this.username = username;
    this.passwordHash = passwordHash;
  }
}
