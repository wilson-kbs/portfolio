import { Module } from '@nestjs/common';
import { ProfilesModule } from './features/profiles/profiles.module';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        KBSV_PORTFOLIO_SERVER_PORT: Joi.number().default(3000),
        KBSV_PORTFOLIO_DATABASE_SCHEME: Joi.string()
          .valid('mongodb://', 'mongodb+srv://')
          .default('mongodb://'),
        KBSV_PORTFOLIO_DATABASE_PORT: Joi.number().default(27017),
        KBSV_PORTFOLIO_DATABASE_DBNAME: Joi.string().default('portfolio'),
        KBSV_PORTFOLIO_DATABASE_USERNAME: Joi.string(),
        KBSV_PORTFOLIO_DATABASE_PASSWORD: Joi.string(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        let uri = configService.get('KBSV_PORTFOLIO_DATABASE_SCHEME');
        const dbUsername = configService.get(
          'KBSV_PORTFOLIO_DATABASE_USERNAME',
        );
        const dbPassword = configService.get(
          'KBSV_PORTFOLIO_DATABASE_PASSWORD',
        );
        const dbHost = configService.get('KBSV_PORTFOLIO_DATABASE_HOST');
        const dbPort = configService.get('KBSV_PORTFOLIO_DATABASE_PORT');
        const dbname = configService.get('KBSV_PORTFOLIO_DATABASE_DBNAME');
        if (!!dbUsername && !!dbPassword) {
          uri += `${dbUsername}:${dbPassword}@`;
        }
        uri += `${dbHost}:${dbPort}/${dbname}`;

        return {
          uri: uri,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        };
      },
      inject: [ConfigService],
    }),
    ProfilesModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
