import { Injectable } from '@nestjs/common';
import { ActsRepository } from './acts.repository';
import { ActCreateDto } from './act-create.dto';
import { ActUpdateDto } from './act-update.dto';

@Injectable()
export class ActsService {
  constructor(private repository: ActsRepository) {}

  async getAll() {
    return this.repository.getAll();
  }

  async getById(id: number) {
    return this.repository.getById({ where: { id } });
  }

  async getByIdWithLevelsAndGames(id: number) {
    return this.repository.getById({
      where: { id },
      include: {
        levels: {
          include: {
            games: true,
          },
        },
      },
    });
  }

  async create(act: ActCreateDto) {
    return this.repository.create({ data: act });
  }

  async update(id: number, act: ActUpdateDto) {
    const { levels, ...data } = act;
    return this.repository.update({
      where: { id },
      data: { levels: { create: levels }, ...data },
    });
  }

  async delete(id: number) {
    return this.repository.delete({ where: { id } });
  }
}
