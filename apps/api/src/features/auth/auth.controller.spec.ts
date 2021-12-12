import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  closeInMongodbConnection,
  rootTypeOrmTestModule,
} from '../../test-utils/typeorm/TypeOrmDatabaseTest';
import { Account } from '../../entities/account.entity';
import { AuthModule } from './auth.module';

describe('AuthController (e2e)', () => {
  let controller: AuthController;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        rootTypeOrmTestModule({
          entities: [Account],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await closeInMongodbConnection();
  });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });

  describe('/auth/signup (POST)', () => {
    it(`When invalid dto`, () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({})
        .expect(400);
    });
    it('When valid dto', () => {
      const account = {
        username: 'test1',
        password: '123456789',
      };
      return request(app.getHttpServer())
        .post('/auth/signup')
        .set('Content-type', 'application/json')
        .send(JSON.stringify(account))
        .expect(201);
    });
  });

  describe('/auth/login', () => {
    it('When account does not exists', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .expect(401);
    });
  });
});
