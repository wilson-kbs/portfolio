import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Profile } from '../../entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly usersRepository: MongoRepository<Profile>,
  ) {}
  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(id: string) {
    return `This action returns a #${id} profile`;
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: string) {
    return `This action removes a #${id} profile`;
  }
}
