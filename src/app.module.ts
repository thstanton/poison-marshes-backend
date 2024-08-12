import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ResendModule } from './modules/resend/resend.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { LevelsModule } from './modules/levels/levels.module';
import { GamesModule } from './modules/games/games.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QrCodesModule } from './modules/qrcodes/qrcodes.module';
import { ActsModule } from './modules/acts/acts.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    UsersModule,
    ResendModule,
    AccountsModule,
    LevelsModule,
    GamesModule,
    AuthModule,
    QrCodesModule,
    ActsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
