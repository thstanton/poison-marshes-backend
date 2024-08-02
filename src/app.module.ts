import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { UsersModule } from './modules/users/users.module';
import { ResendModule } from './modules/resend/resend.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { LevelsModule } from './modules/levels/levels.module';
import { GamesModule } from './modules/games/games.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QrCodesModule } from './modules/qrcodes/qrcodes.module';
import { ActsModule } from './modules/acts/acts.module';

@Module({
  imports: [
    ScheduleModule.forRoot({}),
    ApiModule,
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
