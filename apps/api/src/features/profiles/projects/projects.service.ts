import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../schemas/profile.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './models/create-project.dto';
import { Project } from './schemas/project.schema';
import { UpdateProfileDto } from '../models/update-profile.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  public async getProjectByProfileId(
    profileId: string,
  ): Promise<ProfileDocument> {
    const profile = await this.profileModel
      .findById(profileId)
      .select('projects')
      .exec();
    if (!profile) throw new BadRequestException();
    return profile;
  }

  async create(profileId: string, createProjectDto: CreateProjectDto) {
    const profile = await this.getProjectByProfileId(profileId);

    profile.projects.push(new Project(createProjectDto));

    const updatedProfile = await profile.save();

    return updatedProfile.toJSON().projects.pop();
  }

  async findAll(profileId: string) {
    const profile = await this.getProjectByProfileId(profileId);

    return profile.toJSON().projects;
  }

  async update(
    profileId: string,
    projectId: string,
    updateProjectDto: UpdateProfileDto,
  ) {
    const profile = await this.getProjectByProfileId(profileId);

    const projectIndex = profile.projects.findIndex(
      (item) => item._id == projectId,
    );
    if (projectIndex < 0) throw new BadRequestException();

    Object.assign(profile.projects[projectIndex], updateProjectDto);

    const updatedProfile = await profile.save();

    return updatedProfile
      .toJSON()
      .projects.find((item) => item._id == projectId);
  }

  async delete(profileId: string, projectId: string) {
    const profile = await this.getProjectByProfileId(profileId);

    const projectIndex = profile.projects.findIndex(
      (item) => item._id == projectId,
    );

    if (projectIndex < 0) throw new BadRequestException();

    const project = Object.assign({}, profile.toJSON().projects[projectIndex]);

    profile.projects.splice(projectIndex, 1);

    await profile.save();

    return project;
  }
}
