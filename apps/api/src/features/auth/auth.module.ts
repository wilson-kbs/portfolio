import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AuthService, Logger],
  controllers: [AuthController],
})
export class AuthModule {}
