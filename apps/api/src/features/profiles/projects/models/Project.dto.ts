import { Expose, Transform } from 'class-transformer';
import { Project } from '../schemas/project.schema';

export class ProjectDto {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.valueOf())
  _id: string;

  index: number;

  name: string;

  img: string;

  description: string;

  link: string;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}
