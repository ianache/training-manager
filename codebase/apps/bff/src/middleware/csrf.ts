import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';
import { ApiError } from '../shared/api-error.js';

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);
export const CSRF_COOKIE = 'XSRF-TOKEN';
const CSRF_HEADER = 'x-xsrf-token';

/**
 * Protección CSRF por double-submit, necesaria porque la sesión viaja en una cookie (ADR-005).
 * - Emite la cookie legible XSRF-TOKEN (Angular la copia al header X-XSRF-TOKEN).
 * - En métodos no seguros exige header (o campo _csrf en formularios) igual a la cookie.
 * Complementa SameSite=Lax en la cookie de sesión.
 */
export function csrf(secureCookies: boolean): RequestHandler {
  return (req, res, next) => {
    let token: string | undefined = req.cookies?.[CSRF_COOKIE];
    if (!token) {
      token = randomBytes(32).toString('base64url');
      res.cookie(CSRF_COOKIE, token, { sameSite: 'lax', secure: secureCookies, httpOnly: false, path: '/' });
    }
    if (SAFE.has(req.method)) return next();

    const sent = req.header(CSRF_HEADER) ?? (req.body as { _csrf?: string } | undefined)?._csrf;
    if (!sent || !req.cookies?.[CSRF_COOKIE] || !equal(sent, req.cookies[CSRF_COOKIE])) {
      return next(new ApiError(403, 'CSRF_FAILED', 'La solicitud no pudo verificarse. Recarga la página.'));
    }
    next();
  };
}

function equal(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
