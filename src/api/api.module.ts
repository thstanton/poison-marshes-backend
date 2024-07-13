import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { ResendModule } from 'src/modules/resend/resend.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    UsersModule,
    ResendModule,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
