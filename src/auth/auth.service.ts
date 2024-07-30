import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.account.password === pass) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        account: { password },
        ...result
      } = user;
      return result;
    }
    return null;
  }
}
