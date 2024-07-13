import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { UsersModule } from './modules/users/users.module';
import { ResendModule } from './modules/resend/resend.module';

@Module({
  imports: [ApiModule, UsersModule, ResendModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
