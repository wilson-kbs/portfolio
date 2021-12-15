import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import { User } from '../../users/schemas/user.schema';
import * as mongoose from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Exclude()
  user: User;

  @Prop()
  img: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  @Exclude()
  fullnamequery: string;

  @Prop()
  bio: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
