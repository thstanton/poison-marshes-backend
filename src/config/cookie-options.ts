import { CookieOptions } from 'express';

const domain: string =
  process.env.NODE_ENV !== 'local' ? process.env.COOKIE_DOMAIN : undefined;
const secure: boolean =
  process.env.NODE_ENV !== 'local'
    ? process.env.COOKIE_SECURE === 'true'
    : false;
// const sameSite: boolean | 'none' | 'lax' | 'strict' =
//   process.env.NODE_ENV !== 'local' ? 'none' : 'lax';

export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  signed: true,
  domain,
  secure,
  sameSite: 'lax',
};

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  signed: true,
  domain,
  secure,
  sameSite: 'lax',
};
