import type { Request } from 'express';

/**
 * Reads `voz_access_token` from Cookie header (same as /auth/me).
 * @throws Error if cookie header or token is missing
 */
export function readVozAccessTokenFromCookie(request: Request): string {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) {
    throw new Error('MISSING_COOKIE');
  }

  const tokenPair = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('voz_access_token='));

  const token = tokenPair?.split('=')[1];
  if (!token) {
    throw new Error('MISSING_TOKEN');
  }

  return decodeURIComponent(token);
}


