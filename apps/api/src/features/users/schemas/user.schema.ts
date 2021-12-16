import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude } from 'class-transformer';
import { ObjectID } from 'bson';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  @Exclude()
  passwordHash: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
