import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import * as fs from 'fs';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const jwtModuleOptions: JwtModuleOptions = {
          signOptions: {
            algorithm: 'HS256',
            expiresIn: 3600,
          },
        };

        const jwtSecret = config.get('KBSV_PORTFOLIO_JWT_SECRET');
        const jwtPrivateKeyPath = config.get(
          'KBSV_PORTFOLIO_JWT_PRIVATE_KEY_PATH',
        );
        const jwtPublicKeyPath = config.get(
          'KBSV_PORTFOLIO_JWT_PUBLIC_KEY_PATH',
        );

        if (!jwtSecret && (!jwtPublicKeyPath || !jwtPrivateKeyPath)) {
          console.error(
            'KBSV_PORTFOLIO_JWT_SECRET or KBSV_PORTFOLIO_JWT_PRIVATE_KEY_PATH and KBSV_PORTFOLIO_JWT_PUBLIC_KEY_PATH env are not found',
          );
          process.exit(1);
        }

        if (jwtSecret) {
          jwtModuleOptions.secret = jwtSecret;
          return jwtModuleOptions;
        }

        if (jwtPublicKeyPath && jwtPrivateKeyPath) {
          try {
            const jwtPublicKey = fs.readFileSync(jwtPublicKeyPath);
            const jwtPrivateKey = fs.readFileSync(jwtPrivateKeyPath);
            jwtModuleOptions.publicKey = jwtPublicKey;
            jwtModuleOptions.privateKey = jwtPrivateKey;
            return jwtModuleOptions;
          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        }
      },
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    Logger,
    {
      provide: APP_GUARD,
      useFactory: (ref) => new JwtAuthGuard(ref),
      inject: [Reflector],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
