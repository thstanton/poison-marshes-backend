import { Request } from 'express';

export function cookieAccessTokenExtractor(req: Request) {
  let accessToken: string;

  if (req && req.signedCookies) {
    accessToken = req.signedCookies['access_token'];
  }
  return accessToken;
}

export function cookieRefreshTokenExtractor(req: Request) {
  let refreshToken: string;

  if (req && req.signedCookies) {
    refreshToken = req.signedCookies['refresh_token'];
  }
  return refreshToken;
}
