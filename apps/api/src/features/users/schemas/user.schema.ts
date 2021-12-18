import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude } from 'class-transformer';
import { ObjectID } from 'bson';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ get: (roles: string[]) => roles.concat(['user']), default: [] })
  roles: Array<string>;

  @Prop()
  email: string;

  @Prop({ required: true })
  @Exclude()
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
