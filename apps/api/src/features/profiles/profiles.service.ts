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
    });

    await createProfile.save();
  }

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(fullName: string) {
    return this.profileModel.findOne({
      fullnamequery: {
        $regex: fullName,
        $options: 'i',
      },
    });
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
}
