import { Injectable } from '@nestjs/common';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  constructor(private repository: GamesRepository) {}

  async create(accountId: number) {
    return this.repository.createNew({
      data: {
        account: {
          connect: { id: accountId },
        },
      },
    });
  }
}
