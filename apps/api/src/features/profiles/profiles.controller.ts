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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtIsAdminAuthGuard } from '../auth/jwt-is-admin-auth.guard';
import { AllowAny } from '../../decorator/allow-any.decorator';
import { ProfileDto } from './models/profile.dto';
import {Profile} from "./schemas/profile.schema";

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createProfileDto: CreateProfileDto) {
    await this.profilesService.create(req.user.id, createProfileDto);
  }

  @Get()
  @AllowAny()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() query) {
    if (!query.name) throw new BadRequestException();
    const profile = await this.profilesService.findByName(query.name);
    return new ProfileDto(profile.toJSON());
  }

  // @Get(':fullname')
  // @UseInterceptors(ClassSerializerInterceptor)
  // @AllowAny()
  // findOne(@Param('fullname') fullname: string) {
  //   return this.profilesService.findOne(fullname);
  // }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(req.user.id, updateProfileDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    if (req.user.username === 'admin' || req.user.id == id) {
      await this.profilesService.remove(id);
      return;
    }
    throw new UnauthorizedException();
  }
}
