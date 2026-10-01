import type { RequestHandler } from 'express';
import { forbidden, unauthenticated } from '../shared/api-error.js';
import type { OidcPort } from './oidc.js';

/**
 * Exige sesión válida. Si el access token venció pero hay refresh token, lo renueva
 * en silencio; si no se puede, destruye la sesión y responde 401 (el portal muestra
 * "Sesión vencida").
 */
export function requireSession(oidc: OidcPort): RequestHandler {
  return async (req, _res, next) => {
    const s = req.session;
    if (!s?.user || !s.tokens) return next(unauthenticated());
    if (s.tokens.expiresAt > Date.now() + 10_000) return next();
    if (!s.tokens.refreshToken) return destroyAndFail();
    try {
      const t = await oidc.refresh(s.tokens.refreshToken);
      s.tokens = { accessToken: t.accessToken, refreshToken: t.refreshToken, idToken: t.idToken ?? s.tokens.idToken, expiresAt: t.expiresAt };
      s.user = { ...s.user, roles: t.identity.roles };
      return next();
    } catch {
      return destroyAndFail();
    }
    function destroyAndFail() {
      s.destroy(() => next(unauthenticated()));
    }
  };
}

/**
 * Autorización por rol en el BFF (ACP-002 TCON-002). Es la barrera real:
 * el portal solo oculta opciones.
 */
export function requireAnyRole(...roles: string[]): RequestHandler {
  return (req, _res, next) => {
    const mine = req.session.user?.roles ?? [];
    return roles.some((r) => mine.includes(r)) ? next() : next(forbidden());
  };
}
