import { Prisma } from '@prisma/client';

export type AccountWithUser = Prisma.AccountGetPayload<{
  include: { user: true };
}>;

export type AccountWithUserWithoutPassword = Omit<AccountWithUser, 'password'>;

export type GameWithAccountAndUser = Prisma.GameGetPayload<{
  include: {
    account: {
      include: {
        user: true;
      };
    };
  };
}>;

export type LevelWithEmail = Prisma.LevelGetPayload<{
  include: {
    email: true;
  };
}>;
