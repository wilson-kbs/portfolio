import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Profile {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  constructor(firstname: string, lastname: string) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
}
