import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile.entity';

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: getRepositoryToken(Profile),
          useValue: Repository,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
