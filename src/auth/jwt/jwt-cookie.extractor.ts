import { Request } from 'express';

export function cookieAccessTokenExtractor(req: Request) {
  let accessToken: string;

  if (req && req.signedCookies) {
    accessToken = req.signedCookies['accessToken'];
  }
  return accessToken;
}

export function cookieRefreshTokenExtractor(req: Request) {
  let refreshToken: string;

  if (req && req.signedCookies) {
    refreshToken = req.signedCookies['refreshToken'];
  }
  return refreshToken;
}
