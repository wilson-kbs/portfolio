import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../schemas/profile.schema';
import { Model } from 'mongoose';
import { CreateSkillDto } from './models/create-skill.dto';
import { Skill } from './schemas/skill.schema';
import { UpdateSkillDto } from './models/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  public async getSkillByProfileId(
    profileId: string,
  ): Promise<ProfileDocument> {
    const profile = await this.profileModel
      .findById(profileId)
      .select('skills')
      .exec();
    if (!profile) throw new BadRequestException();
    return profile;
  }

  async create(profileId: string, createSkillDto: CreateSkillDto) {
    const profile = await this.getSkillByProfileId(profileId);

    profile.skills.push(new Skill(createSkillDto));

    const newProfile = await profile.save();

    return newProfile.toJSON().skills.pop();
  }

  async findAll(profileId: string) {
    const profile = await this.getSkillByProfileId(profileId);

    return profile.toJSON().skills;
  }

  async update(
    profileId: string,
    skillId: string,
    updateSkillDto: UpdateSkillDto,
  ) {
    const profile = await this.getSkillByProfileId(profileId);

    const skillIndex = profile.skills.findIndex((item) => item._id == skillId);
    if (skillIndex < 0) throw new BadRequestException();

    for (const props in updateSkillDto) {
      profile.skills[skillIndex][props] = updateSkillDto[props];
    }

    const newProfile = await profile.save();

    return newProfile.toJSON().skills.find((item) => item._id == skillId);
  }

  async delete(profileId: string, skillId: string) {
    const profile = await this.getSkillByProfileId(profileId);

    const skillIndex = profile.skills.findIndex((item) => item._id == skillId);

    if (skillIndex < 0) throw new BadRequestException();

    const skill = Object.assign({}, profile.toJSON().skills[skillIndex]);

    profile.skills.splice(skillIndex, 1);

    await profile.save();

    return skill;
  }
}
