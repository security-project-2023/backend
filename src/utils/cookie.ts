import { type CookieOptions } from 'express';
import config, { isProduction } from './config';

export const REFRESH_TOKEN_KEY = 'Refresh';
export const REFRESH_TOKEN_OPTION = (): CookieOptions => ({
  ...(isProduction() ? { domain: config.get<string>('SERVICE_DOMAIN') } : {}),
  httpOnly: isProduction(),
  secure: isProduction(),
  maxAge: 2592000000,
  ...(isProduction() ? { sameSite: 'none' } : {}),
});
