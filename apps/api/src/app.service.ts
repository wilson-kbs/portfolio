import { Injectable } from '@nestjs/common';
import { lib } from '@portfolio/lib';

@Injectable()
export class AppService {
  getHello(): string {
    return lib();
  }
}
