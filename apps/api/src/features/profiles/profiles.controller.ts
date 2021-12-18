import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpCode,
  UnauthorizedException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './models/create-profile.dto';
import { UpdateProfileDto } from './models/update-profile.dto';
import { AllowAny } from '../../decorator/allow-any.decorator';
import { ProfileDto } from './models/profile.dto';
import { CurrentUser } from '../../decorator/current-user.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @HttpCode(201)
  async create(@Request() req, @Body() createProfileDto: CreateProfileDto) {
    await this.profilesService.create(req.user.id, createProfileDto);
  }

  @Get()
  @AllowAny()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() query, @CurrentUser('roles') roles: string[]) {
    if (roles.indexOf('admin') !== -1) {
      console.log('admin');
    }
    if (!query.name) throw new BadRequestException();
    const profile = await this.profilesService.findByFullName(query.name);
    return new ProfileDto(profile.toJSON());
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @AllowAny()
  async findOne(@Param('id') id: string) {
    const profile = await this.profilesService.findById(id);
    return new ProfileDto(profile.toJSON());
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @CurrentUser('id') userid: string,
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    if (!(await this.profilesService.userIsAllowToWriteProfile(id, userid))) {
      throw new UnauthorizedException();
    }
    const profile = await this.profilesService.update(id, updateProfileDto);
    return new ProfileDto(profile.toJSON());
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async remove(@CurrentUser('id') userid: string, @Param('id') id: string) {
    if (!(await this.profilesService.userIsAllowToWriteProfile(id, userid))) {
      throw new UnauthorizedException();
    }
    const profile = await this.profilesService.remove(id);
    return new ProfileDto(profile.toJSON());
  }
}
