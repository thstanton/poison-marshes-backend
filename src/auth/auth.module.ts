import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../modules/users/users.module';
import { BcryptService } from './bcrypt/bcrypt.service';

@Module({
  imports: [UsersModule],
  providers: [AuthService, BcryptService],
  exports: [AuthService, BcryptService],
})
export class AuthModule {}
