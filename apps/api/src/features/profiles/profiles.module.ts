import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { SkillsController } from './skills/skills.controller';
import { SkillsService } from './skills/skills.service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { Skill, SkillSchema } from './skills/schemas/skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [ProfilesController, SkillsController, ProjectsController],
  providers: [ProfilesService, SkillsService, ProjectsService],
})
export class ProfilesModule {}
