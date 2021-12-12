import { MongoMemoryServer } from 'mongodb-memory-server';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

let mongo: MongoMemoryServer;

export const rootTypeOrmTestModule = (
  options: Partial<MongoConnectionOptions> = {},
) =>
  TypeOrmModule.forRootAsync({
    useFactory: async () => {
      mongo = await MongoMemoryServer.create({
        instance: {
          dbName: 'portfolio',
        },
      });
      return {
        type: 'mongodb',
        url: `${mongo.getUri()}portfolio`,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        keepConnectionAlive: true,
        synchronize: true,
        ...options,
      };
    },
  });

export const closeInMongodbConnection = async () => {
  if (mongo) await mongo.stop();
};
