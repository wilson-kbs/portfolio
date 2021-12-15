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
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './models/create-profile.dto';
import { UpdateProfileDto } from './models/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtIsAdminAuthGuard } from '../auth/jwt-is-admin-auth.guard';

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
  @UseGuards(JwtIsAdminAuthGuard)
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':fullname')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('fullname') fullname: string) {
    return this.profilesService.findOne(fullname);
  }

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
