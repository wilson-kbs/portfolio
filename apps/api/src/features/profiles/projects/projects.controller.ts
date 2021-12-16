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
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AllowAny } from '../../../decorator/allow-any.decorator';
import { CurrentUser } from '../../../decorator/current-user.decorator';
import { ProjectsService } from './projects.service';
import { ProfilesService } from '../profiles.service';
import { Project } from './schemas/project.schema';
import { CreateProjectDto } from './models/create-project.dto';
import { UpdateProjectDto } from './models/update-project.dto';
import { ProjectDto } from './models/Project.dto';

@Controller('profiles/:profileId([a-f0-9]{24})/projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @CurrentUser('id') userid: string,
    @Param('profileId') profileId: string,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    if (
      !(await this.profilesService.userIsAllowToWriteProfile(profileId, userid))
    ) {
      throw new UnauthorizedException();
    }
    const project = await this.projectsService.create(
      profileId,
      createProjectDto,
    );
    return new ProjectDto(project);
  }

  @Get()
  @HttpCode(200)
  @AllowAny()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Param('profileId') profileId,
    @CurrentUser('id') userId: string,
  ) {
    const projects = await this.projectsService.findAll(profileId);
    return projects.map((item) => new ProjectDto(item));
  }

  @Patch(':projectId([a-f0-9]{24})')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @CurrentUser('id') userid: string,
    @Param('profileId') profileId: string,
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    if (
      !(await this.profilesService.userIsAllowToWriteProfile(profileId, userid))
    ) {
      throw new UnauthorizedException();
    }

    const project = await this.projectsService.update(
      profileId,
      projectId,
      updateProjectDto,
    );
    return new ProjectDto(project);
  }

  @Delete(':projectId([a-f0-9]{24})')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(
    @CurrentUser('id') userid: string,
    @Param('profileId') profileId: string,
    @Param('projectId') projectId: string,
  ): Promise<Project> {
    if (
      !(await this.profilesService.userIsAllowToWriteProfile(profileId, userid))
    ) {
      throw new UnauthorizedException();
    }
    const project = await this.projectsService.delete(profileId, projectId);

    return new ProjectDto(project);
  }
}
