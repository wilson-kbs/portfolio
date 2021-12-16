import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateSkillDto } from './models/create-skill.dto';
import { SkillsService } from './skills.service';
import { UpdateSkillDto } from './models/update-skill.dto';
import { Skill } from './schemas/skill.schema';
import { AllowAny } from '../../../decorator/allow-any.decorator';
import { CurrentUser } from '../../../decorator/current-user.decorator';
import { ProfilesService } from '../profiles.service';
import { SkillDto } from './models/skill.dto';

@Controller('profiles/:profileId([a-f0-9]{24})/skills')
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @CurrentUser('id') userid: string,
    @Param('profileId') profileId: string,
    @Body() createSkillDto: CreateSkillDto,
  ): Promise<Skill> {
    if (
      !(await this.profilesService.userIsAllowToWriteProfile(profileId, userid))
    ) {
      throw new UnauthorizedException();
    }
    const skill = await this.skillsService.create(profileId, createSkillDto);
    return new SkillDto(skill);
  }

  @Get()
  @HttpCode(200)
  @AllowAny()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Param('profileId') profileId,
    @CurrentUser('id') userId: string,
  ) {
    const skills = await this.skillsService.findAll(profileId);
    return skills.map((item) => new SkillDto(item));
  }

  @Patch(':skillId([a-f0-9]{24})')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @CurrentUser('id') userid: string,
    @Param('profileId') profileId: string,
    @Param('skillId') skillId: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    if (
      !(await this.profilesService.userIsAllowToWriteProfile(profileId, userid))
    ) {
      throw new UnauthorizedException();
    }

    const skill = await this.skillsService.update(
      profileId,
      skillId,
      updateSkillDto,
    );
    return new SkillDto(skill);
  }

  @Delete(':skillId([a-f0-9]{24})')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(
    @CurrentUser('id') userid: string,
    @Param('profileId') profileId: string,
    @Param('skillId') skillId: string,
  ): Promise<Skill> {
    if (
      !(await this.profilesService.userIsAllowToWriteProfile(profileId, userid))
    ) {
      throw new UnauthorizedException();
    }
    const skill = await this.skillsService.delete(profileId, skillId);

    return new SkillDto(skill);
  }
}
