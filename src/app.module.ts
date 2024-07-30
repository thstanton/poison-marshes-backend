import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { UsersModule } from './modules/users/users.module';
import { ResendModule } from './modules/resend/resend.module';
import { AccountsModule } from './accounts/accounts.module';
import { LevelsModule } from './modules/levels/levels.module';
import { GamesModule } from './modules/games/games.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ApiModule, UsersModule, ResendModule, AccountsModule, LevelsModule, GamesModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
