import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { DeserializedJwtDto } from './models/deserialized.jwt.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: 'HS256',
      secretOrKey:
        config.get('KBSV_PORTFOLIO_JWT_SECRET') ||
        fs.readFileSync(config.get('KBSV_PORTFOLIO_JWT_PRIVATE_KEY_PATH')),
    });
  }

  async validate(payload: DeserializedJwtDto) {
    const account = this.authService.getAccountById(payload.sub);

    if (!account) {
      throw new UnauthorizedException();
    }

    return account;
  }
}
