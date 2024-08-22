import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountCreateDto } from './account-create.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('accounts')
@UsePipes(new ValidationPipe())
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('register')
  async register(@Body('account') account: AccountCreateDto) {
    return this.accountsService.create(account);
  }

  @Post('register/super')
  async registerSuperUser(@Body('account') account: AccountCreateDto) {
    return this.accountsService.createSuperUser(account);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllAccounts() {
    return this.accountsService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.getOneByAccountIdWithUserAndGame(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.deleteAccount(id);
  }

  @Put('/admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async makeAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.makeAdmin(id);
  }

  @Put('/password-reset/:accountId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async resetPassword(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.accountsService.resetPassword(accountId);
  }

  @Put('/password-update/:accountId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updatePassword(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.accountsService.updatePassword(
      accountId,
      oldPassword,
      newPassword,
    );
  }
}
