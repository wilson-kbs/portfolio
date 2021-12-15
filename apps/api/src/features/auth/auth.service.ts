import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from './models/credentials.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';

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
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(Logger)
    private readonly logger: Logger,
    private jwtService: JwtService,
  ) {}

  public async getAccountById(id: string) {
    return await this.userModel
      .findOne({ _id: id })
      .select('-passwordHash')
      .exec();
  }

  public async createAccount({ username, password }: CredentialsDto) {
    const createUser = new this.userModel({
      username,
      passwordHash: bcrypt.hashSync(password, PASSWORD_SALT),
    });
    try {
      return await createUser.save();
    } catch (err) {
      if (isUniqueViolationError(err)) {
        throw new ConflictException('Login already exists');
      }
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  public async login({ username, password }: CredentialsDto) {
    const account = await this.userModel.findOne({ username }).exec();
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
