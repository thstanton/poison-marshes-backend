import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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

  @Get()
  async getAllAccounts() {
    return this.accountsService.getAll();
  }

  @Get(':id')
  async getAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOneByAccountId(id);
  }

  @Delete(':id')
  async deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.deleteAccount(id);
  }

  @Put('/admin/:id')
  async makeAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.makeAdmin(id);
  }
}
