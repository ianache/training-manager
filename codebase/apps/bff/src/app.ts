import express, { type Express } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import type { Store } from 'express-session';
import type { Logger } from 'pino';
import type { Env } from './config/env.js';
import type { OidcPort } from './auth/oidc.js';
import { authRouter } from './auth/auth.router.js';
import { requireSession } from './auth/guards.js';
import { createSessionMiddleware } from './auth/session.js';
import { ServiceClient, type FetchLike } from './downstream/service-client.js';
import { ServiceTokenProvider } from './downstream/service-token.js';
import { healthRouter, type ReadinessCheck } from './health/health.router.js';
import { csrf } from './middleware/csrf.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { requestId } from './middleware/request-id.js';
import { catalogRouter } from './modules/catalog/catalog.router.js';
import { partiesRouter } from './modules/parties/parties.router.js';

export interface AppDeps {
  env: Env;
  logger: Logger;
  oidc: OidcPort;
  sessionStore?: Store;
  fetchImpl?: FetchLike;
  readiness?: ReadinessCheck;
}

/**
 * Composición del BFF. Capas, de afuera hacia adentro:
 *   transversal (helmet, request-id, logs, cookies, sesión, CSRF)
 *   → /auth (público)  → /api/v1 (requireSession) → módulos por dominio → ServiceClient
 */
export function createApp(deps: AppDeps): Express {
  const { env, logger, oidc } = deps;
  const secureCookies = env.NODE_ENV === 'production';
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.id, // id ya asignado por requestId
      autoLogging: { ignore: (req) => req.url?.startsWith('/health') ?? false }, // sin ruido de healthchecks
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(cookieParser());

  app.use('/health', healthRouter(deps.readiness ?? (async () => ({}))));

  app.use(
    createSessionMiddleware({
      secret: env.SESSION_SECRET,
      ttlSeconds: env.SESSION_TTL_SECONDS,
      secureCookies,
      store: deps.sessionStore,
    }),
  );
  app.use(csrf(secureCookies));

  app.use('/auth', authRouter({ oidc, publicOrigin: env.PUBLIC_ORIGIN, redirectUri: env.OIDC_REDIRECT_URI }));

  const tokens = new ServiceTokenProvider(oidc);
  const client = (name: string, url: string) =>
    new ServiceClient(name, url, tokens, env.DOWNSTREAM_TIMEOUT_MS, deps.fetchImpl);

  const api = express.Router();
  api.use(requireSession(oidc));
  api.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  api.use('/parties', partiesRouter(client('party-management-service', env.PARTY_SERVICE_URL)));
  api.use('/catalog', catalogRouter(env.CATALOG_SERVICE_URL ? client('catalog-service', env.CATALOG_SERVICE_URL) : null));
  app.use('/api/v1', api);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
