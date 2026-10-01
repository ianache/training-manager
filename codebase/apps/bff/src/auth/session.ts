import session, { type Store } from 'express-session';
import type { RequestHandler } from 'express';
import type { TokenSet } from './oidc.js';

/**
 * Sesión del usuario final (ADR-005).
 * - El navegador solo recibe una cookie opaca `gf.sid` HTTP-only + SameSite=Lax (+ Secure fuera de dev).
 * - Los tokens de Keycloak se guardan del lado servidor (Redis), nunca en el navegador.
 * - Expiración deslizante de 30 min (`rolling`), alineada con la sesión de Keycloak.
 */
export const SESSION_COOKIE = 'gf.sid';

export interface SessionUser {
  username: string;
  displayName: string;
  email: string;
  roles: string[];
}

declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
    tokens?: Pick<TokenSet, 'accessToken' | 'refreshToken' | 'idToken' | 'expiresAt'>;
    pendingLogin?: { codeVerifier: string; state: string; returnTo: string };
  }
}

export interface SessionOptions {
  secret: string;
  ttlSeconds: number;
  secureCookies: boolean;
  store?: Store;
}

export function createSessionMiddleware(opts: SessionOptions): RequestHandler {
  return session({
    name: SESSION_COOKIE,
    secret: opts.secret,
    store: opts.store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: opts.secureCookies,
      maxAge: opts.ttlSeconds * 1000,
      path: '/',
    },
  });
}

export function toSessionUser(t: TokenSet): SessionUser {
  return {
    username: t.identity.preferred_username,
    displayName: t.identity.name ?? t.identity.preferred_username,
    email: t.identity.email ?? '',
    roles: t.identity.roles,
  };
}
