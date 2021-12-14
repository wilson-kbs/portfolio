import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Account } from '../../entities/account.entity';
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
    private jwtService: JwtService,
  ) {}

  public getAccountById(id: string) {
    return this.accountsRepository.findOne(new ObjectID(id), {
      select: ['username'],
    });
  }

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
      throw new InternalServerErrorException();
    }
  }

  public async login({ username, password }: CredentialsDto) {
    const account = await this.accountsRepository.findOne({ username });
    if (!account || !AuthService.compareHash(password, account.passwordHash)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: account.id, username: account.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private static compareHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
