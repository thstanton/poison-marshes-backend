import { Request } from 'express';

export function cookieExtractor(req: Request) {
  let token: string;

  if (req && req.signedCookies) {
    console.log(req.signedCookies);
    token = req.signedCookies['accessToken'];
  }
  return token;
}
