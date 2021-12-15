import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    process.env.KBSV_PORTFOLIO_JWT_SECRET =
      'fybqkjgrhsjbdgjkltbskjbtguisnbknbt566d46h4d64g64684vd654';
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'portfolio',
      },
    });
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongod.getUri(),
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/signup (POST)', () => {
    it(`When invalid dto`, () => {
      return request(app.getHttpServer()).post('/signup').send({}).expect(400);
    });
    it('When valid models', () => {
      const account = {
        username: 'test1',
        password: '123456789',
      };
      return request(app.getHttpServer())
        .post('/signup')
        .set('Content-type', 'application/json')
        .send(JSON.stringify(account))
        .expect(201);
    });
  });

  describe('/login', () => {
    it('When account does not exists', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .expect(401);
    });
  });
});
