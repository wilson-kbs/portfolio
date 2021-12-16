import { Prop } from '@nestjs/mongoose';

export class Project {
  @Prop({ required: true })
  id: string;

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
}
