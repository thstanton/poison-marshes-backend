import { Module } from '@nestjs/common';
import { ResendService } from './resend.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [ResendService],
  exports: [ResendService],
})
export class ResendModule {}
