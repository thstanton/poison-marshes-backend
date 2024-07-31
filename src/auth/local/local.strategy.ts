import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('Validate function');
    const userAccount = await this.authService.validateUserAccount(
      email,
      password,
    );
    console.log(userAccount);
    if (!userAccount) {
      throw new UnauthorizedException();
    }
    return userAccount;
  }
}
