import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../../entities/profile.entity';
import { Repository } from 'typeorm';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        ProfilesService,
        {
          provide: getRepositoryToken(Profile),
          useValue: Repository,
        },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
