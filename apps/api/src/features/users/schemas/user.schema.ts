import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop()
  @Exclude()
  passwordHash: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
