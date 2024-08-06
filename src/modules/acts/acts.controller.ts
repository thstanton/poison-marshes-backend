import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ActsService } from './acts.service';
import { ActCreateDto } from './act-create.dto';
import { ActUpdateDto } from './act-update.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('acts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UsePipes(new ValidationPipe({ transform: true }))
export class ActsController {
  constructor(private readonly actsService: ActsService) {}

  @Get()
  getAll() {
    return this.actsService.getAll();
  }

  @Get(':sequence')
  getById(@Param('sequence') sequence: number) {
    return this.actsService.getBySequenceId(sequence);
  }

  @Post()
  create(@Body('act') act: ActCreateDto) {
    return this.actsService.create(act);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() act: ActUpdateDto) {
    return this.actsService.update(id, act);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.actsService.delete(id);
  }
}
