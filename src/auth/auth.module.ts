import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountsModule } from 'src/modules/accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from 'src/database/prisma.module';
import { RefreshTokensService } from './refresh-tokens/refresh-tokens.service';
import { RefreshTokensRepository } from './refresh-tokens/refresh-tokens.repository';

@Module({
  imports: [
    BcryptModule,
    AccountsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ThrottlerModule.forRoot(),
    PrismaModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    RefreshTokensService,
    RefreshTokensRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
