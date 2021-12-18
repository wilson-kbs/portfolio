import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateProfileDto } from './models/create-profile.dto';
import { UpdateProfileDto } from './models/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  public async getProfileById(id: string) {
    const profile = await this.profileModel
      .findById(id)
      .select('-skills -projects')
      .exec();
    if (!profile) throw new BadRequestException();
    return profile;
  }

  async create(userid: string, createProfileDto: CreateProfileDto) {
    const profiledb = await this.profileModel.findOne({
      user: userid,
    });
    if (profiledb) {
      throw new ConflictException('Profile already exists');
    }

    const createProfile = new this.profileModel({
      user: userid,
      firstname: createProfileDto.firstname.trim(),
      lastname: createProfileDto.lastname.trim(),
      fullnamequery:
        `${createProfileDto.firstname
          .trim()
          .toLocaleLowerCase()
          .split(' ')
          .join('-')}` +
        '-' +
        `${createProfileDto.lastname
          .trim()
          .toLocaleLowerCase()
          .split(' ')
          .join('-')}`,
      skills: [],
      projects: [],
    });

    await createProfile.save();
  }

  findAll() {
    return `This action returns all profiles`;
  }

  async findByFullName(fullName: string) {
    const profile = await this.profileModel
      .findOne({
        fullnamequery: fullName,
      })
      .exec();
    if (!profile) throw new BadRequestException();
    return profile;
  }

  async findById(id: string) {
    return await this.getProfileById(id);
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.getProfileById(id);

    for (const prop in updateProfileDto) {
      profile[prop] = updateProfileDto[prop];
    }

    const updatedProfile = await profile.save();
    return updatedProfile;
  }

  async remove(id: string): Promise<any> {
    const profile = this.getProfileById(id);
    await this.profileModel
      .deleteOne({
        _id: id,
      })
      .exec();
    return profile;
  }

  async userIsAllowToWriteProfile(profileId: string, userId: string) {
    const profile = await this.profileModel
      .findById(profileId)
      .populate('user')
      .exec();
    return profile.user._id == userId;
  }
}
