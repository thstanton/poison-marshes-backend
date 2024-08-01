import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountCreateDto } from './account-create.dto';

@Controller('accounts')
@UsePipes(new ValidationPipe())
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('register')
  async register(@Body('account') account: AccountCreateDto) {
    return this.accountsService.create(account);
  }

  @Get(':id')
  async getAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOneByAccountId(id);
  }
}
