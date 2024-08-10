import { CookieOptions } from 'express';

export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  signed: true,
  domain: process.env.COOKIE_DOMAIN || undefined,
  secure: process.env.COOKIE_SECURE === 'true',
};

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  signed: true,
  domain: process.env.COOKIE_DOMAIN || undefined,
  secure: process.env.COOKIE_SECURE === 'true',
};
