import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ActsService } from './acts.service';
import { ActCreateDto } from './act-create.dto';
import { ActUpdateDto } from './act-update.dto';

@Controller('acts')
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
