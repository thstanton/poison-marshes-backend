import { Prisma } from '@prisma/client';

export type AccountWithUser = Prisma.AccountGetPayload<{
  include: { user: true };
}>;

export type AccountWithUserAndGame = Prisma.AccountGetPayload<{
  include: { user: true; game: true };
}>;

export type AccountWithUserAndGameWithoutPassword = Omit<
  AccountWithUserAndGame,
  'password' | 'refreshToken'
>;

export type AccountWithUserWithoutPassword = Omit<
  Omit<AccountWithUser, 'password'>,
  'refreshToken'
>;

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

export type GameWithLevelAndAct = Prisma.GameGetPayload<{
  include: {
    level: {
      include: {
        act: true;
      };
    };
  };
}>;

export type LevelWithActAndEmail = Prisma.LevelGetPayload<{
  include: {
    act: true;
    email: true;
  };
}>;
