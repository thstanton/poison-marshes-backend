import { AccountWithUserWithoutPassword } from './prisma-custom-types';

export interface AccessTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  email: string;
  sub: string;
}

export type GuardedRequest = Request & {
  account?: AccountWithUserWithoutPassword;
};
