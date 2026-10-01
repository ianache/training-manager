import { Router } from 'express';
import type { OidcPort } from './oidc.js';
import { SESSION_COOKIE, toSessionUser } from './session.js';
import { unauthenticated } from '../shared/api-error.js';

export interface AuthRouterOptions {
  oidc: OidcPort;
  publicOrigin: string;
  redirectUri: string;
}

/**
 * Flujo Authorization Code + PKCE ejecutado por el BFF (ADR-002, ADR-005 §5):
 *
 *   GET  /auth/login?returnTo=/catalogo  → 302 a Keycloak (code_challenge S256, state)
 *   GET  /auth/callback?code&state       → canjea el código, crea la sesión, 302 a returnTo
 *   GET  /auth/session                   → vista mínima del usuario para el portal (sin tokens)
 *   POST /auth/logout                    → destruye la sesión y 302 al end_session de Keycloak
 */
export function authRouter({ oidc, publicOrigin, redirectUri }: AuthRouterOptions): Router {
  const r = Router();

  r.get('/login', async (req, res, next) => {
    try {
      const login = await oidc.startLogin();
      req.session.pendingLogin = {
        codeVerifier: login.codeVerifier,
        state: login.state,
        returnTo: safeReturnTo(req.query['returnTo']),
      };
      req.session.save((err) => (err ? next(err) : res.redirect(302, login.authorizationUrl)));
    } catch (err) {
      next(err);
    }
  });

  r.get('/callback', async (req, res, next) => {
    const pending = req.session.pendingLogin;
    if (!pending) return res.redirect(302, `${publicOrigin}/sesion-vencida`);
    try {
      // Reconstruye la URL pública registrada en Keycloak, con los query params recibidos.
      const callbackUrl = new URL(redirectUri);
      callbackUrl.search = new URL(req.originalUrl, 'http://placeholder').search;
      const tokens = await oidc.completeLogin(callbackUrl, pending.codeVerifier, pending.state);

      // Regenerar el id de sesión tras autenticar (evita session fixation).
      req.session.regenerate((err) => {
        if (err) return next(err);
        req.session.user = toSessionUser(tokens);
        req.session.tokens = {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          idToken: tokens.idToken,
          expiresAt: tokens.expiresAt,
        };
        req.session.save((e) => (e ? next(e) : res.redirect(302, `${publicOrigin}${pending.returnTo}`)));
      });
    } catch (err) {
      req.log?.warn({ err }, 'Callback OIDC rechazado');
      res.redirect(302, `${publicOrigin}/sesion-vencida`);
    }
  });

  r.get('/session', (req, res, next) => {
    const user = req.session.user;
    if (!user) return next(unauthenticated());
    const expires = req.session.cookie.expires ?? new Date(Date.now() + (req.session.cookie.maxAge ?? 0));
    res.setHeader('Cache-Control', 'no-store');
    res.json({ ...user, expiresAt: expires.toISOString() });
  });

  r.post('/logout', (req, res, next) => {
    const idToken = req.session.tokens?.idToken;
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie(SESSION_COOKIE, { path: '/' });
      res.redirect(302, oidc.logoutUrl(idToken, `${publicOrigin}/`));
    });
  });

  return r;
}

/** Solo rutas relativas internas: evita open redirect. */
export function safeReturnTo(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return '/';
  }
  return value;
}
