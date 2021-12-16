import { ConflictException, Injectable } from '@nestjs/common';
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

  async findByName(fullName: string) {
    return await this.profileModel
      .findOne({
        fullnamequery: {
          $regex: fullName,
          $options: 'i',
        },
      })
      .exec();
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  async remove(userid: string): Promise<any> {
    return await this.profileModel
      .deleteOne({
        user: userid,
      })
      .exec();
  }

  async userIsAllowToWriteProfile(profileId: string, userId: string) {
    const profile = await this.profileModel
      .findById(profileId)
      .populate('user')
      .exec();
    return profile.user._id == userId;
  }
}
