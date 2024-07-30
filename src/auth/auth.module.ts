import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountsModule } from 'src/modules/accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BcryptModule } from './bcrypt/bcrypt.module';

@Module({
  imports: [
    BcryptModule,
    AccountsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
