import { z } from 'zod';

/**
 * Configuración validada al arrancar. Si falta algo, el BFF no levanta (fail fast).
 * Los secretos (OIDC_CLIENT_SECRET, SESSION_SECRET, REDIS_URL) se sobrescriben desde Vault
 * cuando VAULT_ADDR está definido, y en producción DEBEN venir de Vault (secrets.ts, ADR-004).
 * El BFF no tiene configuración de base de datos: no persiste datos de negocio (ADR-001, ADR-003).
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),

  PUBLIC_ORIGIN: z.url(),

  OIDC_ISSUER: z.url(),
  OIDC_CLIENT_ID: z.string().min(1),
  /** Solo desarrollo. En producción se toma de Vault (auth/keycloak.client_secret). */
  OIDC_CLIENT_SECRET: z.string().default(''),
  OIDC_REDIRECT_URI: z.url(),
  /**
   * Opcional. Origen por el que el BFF llega a Keycloak dentro de la red interna
   * (p. ej. http://keycloak:8080) cuando difiere del origen público del issuer que ve el
   * navegador. Las llamadas servidor→Keycloak (discovery, token, logout) se reescriben a este
   * origen; el issuer y las URLs que recibe el navegador no cambian.
   */
  OIDC_INTERNAL_URL: z.union([z.url(), z.literal('')]).default(''),

  /** Solo desarrollo. En producción se toma de Vault (bff.session_secret). */
  SESSION_SECRET: z.string().default(''),
  SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(1800),
  REDIS_URL: z.string().optional(),

  PARTY_SERVICE_URL: z.url(),
  CATALOG_SERVICE_URL: z.union([z.url(), z.literal('')]).default(''),
  DOWNSTREAM_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),

  VAULT_ADDR: z.union([z.url(), z.literal('')]).default(''),
  VAULT_TOKEN: z.string().default(''),
  VAULT_KV_MOUNT: z.string().default('secret'),
  VAULT_BASE_PATH: z.string().default('gestion-formacion'),
});

export type Env = z.infer<typeof EnvSchema>;

/** Valida los secretos ya resueltos (entorno o Vault) antes de arrancar. */
export function assertSecrets(env: Env): void {
  if (!env.OIDC_CLIENT_SECRET) throw new Error('Falta el secreto del cliente OIDC (Vault auth/keycloak.client_secret)');
  if (env.SESSION_SECRET.length < 32) throw new Error('El secreto de sesión debe tener al menos 32 caracteres (Vault bff.session_secret)');
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Configuración inválida del BFF:\n${issues}`);
  }
  return parsed.data;
}
