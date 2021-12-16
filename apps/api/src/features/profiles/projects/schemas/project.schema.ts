import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';

@Schema()
export class Project {
  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectID() })
  _id: string;

  @Prop()
  index: number;

  @Prop()
  img: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  link: string;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
