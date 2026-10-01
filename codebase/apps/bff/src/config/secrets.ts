import type { Env } from './env.js';
import type { Logger } from 'pino';

/**
 * Carga los secretos del BFF desde HashiCorp Vault, motor KV v2 (ADR-004).
 *
 * Rutas (convención de ACP-002 §2, ADR-004; sin tildes en la ruta):
 *   <mount>/data/<base>/auth/keycloak  → client_secret            (cliente confidencial bff-app)
 *   <mount>/data/<base>/bff            → session_secret, redis_url
 *
 * Reglas:
 * - En producción Vault es obligatorio y los secretos NO pueden venir de variables de entorno.
 * - En desarrollo, sin VAULT_ADDR se usan las variables de .env y se avisa en el log.
 * - Los valores nunca se registran en logs.
 *
 * SUPUESTO: autenticación a Vault por token (VAULT_TOKEN). El método en QA/PROD
 * (AppRole, Kubernetes…) no está decidido (ADR-004 "No se decidió"; ARCHITECTURE.md Q-07).
 */
export interface VaultSecrets {
  oidcClientSecret?: string;
  sessionSecret?: string;
  redisUrl?: string;
}

export type FetchLike = typeof fetch;

export async function withVaultSecrets(env: Env, log: Logger, fetchImpl: FetchLike = fetch): Promise<Env> {
  if (!env.VAULT_ADDR) {
    if (env.NODE_ENV === 'production') {
      throw new Error('ADR-004: VAULT_ADDR es obligatorio en producción; los secretos no pueden venir del entorno');
    }
    log.warn('Vault no configurado: se usan secretos de variables de entorno (solo desarrollo, ADR-004)');
    return env;
  }

  const read = async (path: string): Promise<Record<string, string>> => {
    const url = new URL(`/v1/${env.VAULT_KV_MOUNT}/data/${env.VAULT_BASE_PATH}/${path}`, env.VAULT_ADDR);
    const res = await fetchImpl(url, {
      headers: { 'X-Vault-Token': env.VAULT_TOKEN },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Vault respondió ${res.status} al leer ${env.VAULT_BASE_PATH}/${path}`);
    const body = (await res.json()) as { data?: { data?: Record<string, string> } };
    return body.data?.data ?? {};
  };

  const [keycloak, bff] = await Promise.all([read('auth/keycloak'), read('bff')]);
  const secrets: VaultSecrets = {
    oidcClientSecret: keycloak['client_secret'],
    sessionSecret: bff['session_secret'],
    redisUrl: bff['redis_url'],
  };

  const missing = [
    !secrets.oidcClientSecret && 'auth/keycloak.client_secret',
    !secrets.sessionSecret && 'bff.session_secret',
  ].filter(Boolean);
  if (missing.length && env.NODE_ENV === 'production') {
    throw new Error(`ADR-004: faltan secretos en Vault: ${missing.join(', ')}`);
  }
  if (secrets.sessionSecret && secrets.sessionSecret.length < 32) {
    throw new Error('bff.session_secret en Vault debe tener al menos 32 caracteres');
  }

  log.info({ base: env.VAULT_BASE_PATH, keys: ['auth/keycloak', 'bff'] }, 'Secretos cargados desde Vault');
  return {
    ...env,
    OIDC_CLIENT_SECRET: secrets.oidcClientSecret ?? env.OIDC_CLIENT_SECRET,
    SESSION_SECRET: secrets.sessionSecret ?? env.SESSION_SECRET,
    REDIS_URL: secrets.redisUrl ?? env.REDIS_URL,
  };
}
