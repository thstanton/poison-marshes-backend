import { Prisma } from '@prisma/client';

export type AccountWithUser = Prisma.AccountGetPayload<{
  include: { user: true };
}>;

export type AccountWithUserWithoutPassword = Omit<AccountWithUser, 'password'>;
