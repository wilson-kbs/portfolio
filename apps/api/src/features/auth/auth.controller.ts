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

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(@Body() credentials: CredentialsDto): Promise<void> {
    await this.authService.createAccount(credentials);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() credentials: CredentialsDto): Promise<any> {
    return this.authService.login(credentials);
  }
}
