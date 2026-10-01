import { setTimeout as sleep } from 'node:timers/promises';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import type { Logger } from 'pino';
import { createApp } from './app.js';
import { DeferredOidc } from './auth/deferred-oidc.js';
import { createKeycloakOidc } from './auth/oidc.js';
import { assertSecrets, loadEnv } from './config/env.js';
import { withVaultSecrets } from './config/secrets.js';
import type { DependencyStatus } from './health/health.router.js';
import { createLogger } from './observability/logger.js';

/**
 * Arranque resiliente:
 *   1. Config + secretos de Vault (con reintentos; sin secretos no hay nada que servir).
 *   2. Abre el puerto YA: /health/live responde y /health/ready explica qué falta.
 *   3. Redis y el discovery de Keycloak se conectan en segundo plano, con reintentos y logs.
 * Así un Keycloak lento o inaccesible se ve en `docker compose logs bff` y en /health/ready,
 * en lugar de dejar el contenedor colgado y "unhealthy" sin explicación.
 */
async function main() {
  const baseEnv = loadEnv();
  const logger = createLogger(baseEnv.LOG_LEVEL);

  const env = await retry(logger, 'vault', () => withVaultSecrets(baseEnv, logger), 10);
  assertSecrets(env);

  let redis: ReturnType<typeof createClient> | undefined;
  let redisError: string | undefined;
  let sessionStore;
  if (env.REDIS_URL) {
    redis = createClient({ url: env.REDIS_URL, socket: { connectTimeout: 5000 } });
    redis.on('error', (err: Error) => {
      if (redisError !== err.message) logger.error({ err: err.message }, 'Redis no disponible');
      redisError = err.message;
    });
    redis.on('ready', () => {
      redisError = undefined;
      logger.info('Redis conectado');
    });
    sessionStore = new RedisStore({ client: redis, prefix: 'gf:sess:', ttl: env.SESSION_TTL_SECONDS });
    void redis.connect().catch(() => undefined); // node-redis reintenta solo
  } else if (env.NODE_ENV === 'production') {
    throw new Error('REDIS_URL es obligatorio en producción');
  } else {
    logger.warn('Sin REDIS_URL: sesiones en memoria (solo desarrollo, se pierden al reiniciar)');
  }

  const oidc = new DeferredOidc();
  const app = createApp({
    env,
    logger,
    oidc: oidc.port,
    sessionStore,
    readiness: async () => {
      const checks: Record<string, DependencyStatus> = {
        keycloak: { ok: oidc.ready, ...(oidc.lastError ? { error: oidc.lastError } : {}) },
      };
      if (redis) checks['redis'] = { ok: redis.isReady, ...(redisError ? { error: redisError } : {}) };
      return checks;
    },
  });

  const server = app.listen(env.PORT, () => logger.info({ port: env.PORT }, 'BFF escuchando'));

  // Discovery de Keycloak con reintentos indefinidos (backoff hasta 15 s).
  void (async () => {
    for (let attempt = 1, wait = 1000; !oidc.ready; attempt++, wait = Math.min(wait * 2, 15_000)) {
      try {
        oidc.resolve(await createKeycloakOidc(env));
        logger.info({ issuer: env.OIDC_ISSUER }, 'Keycloak listo (discovery OIDC)');
      } catch (err) {
        oidc.lastError = describe(err);
        logger.warn({ attempt, issuer: env.OIDC_ISSUER, err: oidc.lastError }, 'Keycloak no disponible, reintentando');
        await sleep(wait);
      }
    }
  })();

  const shutdown = () => {
    logger.info('Cerrando BFF');
    server.close(() => void (redis?.isOpen ? redis.quit() : Promise.resolve()).finally(() => process.exit(0)));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

async function retry<T>(logger: Logger, name: string, fn: () => Promise<T>, attempts: number): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i >= attempts) throw err;
      logger.warn({ attempt: i, err: describe(err) }, `${name} no disponible, reintentando`);
      await sleep(Math.min(1000 * 2 ** (i - 1), 10_000));
    }
  }
}

/** Mensaje útil incluyendo la causa (fetch failed → ECONNREFUSED, ENOTFOUND…). */
function describe(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  const cause = (err as Error & { cause?: unknown }).cause;
  const c = cause instanceof Error ? `${(cause as NodeJS.ErrnoException).code ?? ''} ${cause.message}`.trim() : '';
  return c ? `${err.message} (${c})` : err.message;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
