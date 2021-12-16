import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { ObjectID } from 'bson';

@Schema()
export class Skill {
  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectID() })
  _id: string;

  @Prop()
  index: number;

  @Prop()
  img: string;

  @Prop()
  name: string;

  @Prop()
  lvl: number;

  constructor(partial: Partial<Skill>) {
    Object.assign(this, partial);
  }
}
export const SkillSchema = SchemaFactory.createForClass(Skill);
