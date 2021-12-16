import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import { User } from '../../users/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Skill, SkillSchema } from '../skills/schemas/skill.schema';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  img: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  fullnamequery: string;

  @Prop()
  bio: string;

  @Prop([SkillSchema])
  skills: Skill[];

  @Prop([ProjectSchema])
  projects: Project[];

  constructor(partial: Partial<Profile>) {
    Object.assign(this, partial);
  }
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
