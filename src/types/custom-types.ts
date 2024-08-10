import { Level, ScheduledEmail } from '@prisma/client';
import { AccountWithUserWithoutPassword } from './prisma-custom-types';
import { CreateEmailResponse } from './resend-types';

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  email: string;
  sub: string;
}

export type GuardedRequest = Request & {
  account?: AccountWithUserWithoutPassword;
};

export interface InitialiseLevelReturn {
  level: Level;
  email: 'sent' | 'scheduled' | 'none';
  emailResponse: CreateEmailResponse | ScheduledEmail | null;
}
