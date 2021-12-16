import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CreateSkillDto } from '../models/create-skill.dto';
import { ObjectID } from 'bson';

export type SkillDocument = Skill & Document;

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

  constructor(createSkillDto: CreateSkillDto) {
    for (const props in createSkillDto) {
      this[props] = createSkillDto[props];
    }
  }
}
export const SkillSchema = SchemaFactory.createForClass(Skill);
