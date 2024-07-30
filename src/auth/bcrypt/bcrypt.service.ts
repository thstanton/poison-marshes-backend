import { Injectable } from '@nestjs/common';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor(private bcrypt: Bcrypt) {}

  async hashPassword(password: string) {
    return await this.bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return await this.bcrypt.compare(password, hash);
  }
}
