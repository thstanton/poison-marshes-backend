import { Body, Controller, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountCreateDto } from './account-create.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post('register')
  async register(@Body() { userId, password, name }: AccountCreateDto) {
    return this.accountsService.create(userId, password, name);
  }
}
