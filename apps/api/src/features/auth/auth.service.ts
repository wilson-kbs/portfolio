import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../../entities/account.entity';
import { MongoRepository } from 'typeorm';
import { CredentialsDto } from './models/credentials.dto';
import * as bcrypt from 'bcrypt';

const PASSWORD_SALT = 10;

const MONGO_UNIQUE_CONSTRAINT_VIOLATION = 11000;

const isDatabaseError = (err: unknown): err is Error & { code: string } => {
  return typeof err === 'object' && !!err && err.hasOwnProperty('code');
};

const isUniqueViolationError = (err: unknown) => {
  return (
    isDatabaseError(err) &&
    parseInt(err.code) === MONGO_UNIQUE_CONSTRAINT_VIOLATION
  );
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: MongoRepository<Account>,
    @Inject(Logger)
    private readonly logger: Logger,
  ) {}

  public async createAccount({ username, password }: CredentialsDto) {
    const account = new Account(
      username,
      bcrypt.hashSync(password, PASSWORD_SALT),
    );
    try {
      return await this.accountsRepository.save(account);
    } catch (err) {
      if (isUniqueViolationError(err)) {
        throw new ConflictException('Login already exists');
      }
      this.logger.error(err);
      console.log('test');
      throw new InternalServerErrorException();
    }
  }

  public async login({ username, password }: CredentialsDto) {
    const account = await this.accountsRepository.findOne({ username });
    if (!account || AuthService.compareHash(password, account.passwordHash)) {
      throw new UnauthorizedException();
    }
    return {
      token: 'token',
    };
  }

  private static compareHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
