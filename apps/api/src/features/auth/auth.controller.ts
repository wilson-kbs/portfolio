import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './models/credentials.dto';
import { AllowAny } from '../../decorator/allow-any.decorator';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  @AllowAny()
  async signup(@Body() credentials: CredentialsDto): Promise<void> {
    await this.authService.createAccount(credentials);
  }

  @Post('login')
  @HttpCode(200)
  @AllowAny()
  login(@Body() credentials: CredentialsDto): Promise<any> {
    return this.authService.login(credentials);
  }
}
