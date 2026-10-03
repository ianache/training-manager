/**
 * Pruebas de conformidad con las ADR aceptadas (fitness functions).
 * Si una falla, el cambio contradice una decisión de arquitectura: corregir el código
 * o registrar una ADR nueva que reemplace a la anterior.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pino } from 'pino';
import { loadEnv } from '../src/config/env.js';
import { withVaultSecrets } from '../src/config/secrets.js';

const root = join(import.meta.dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  dependencies: Record<string, string>;
};
const silent = pino({ level: 'silent' });

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? sources(p) : p.endsWith('.ts') ? [p] : [];
  });
}
const allSource = sources(join(root, 'src')).map((p) => ({ p, code: readFileSync(p, 'utf8') }));

const baseEnv = {
  PUBLIC_ORIGIN: 'http://portal.test',
  OIDC_ISSUER: 'https://kc.test/realms/gestion-formacion',
  OIDC_CLIENT_ID: 'bff-app',
  OIDC_REDIRECT_URI: 'http://portal.test/auth/callback',
  PARTY_SERVICE_URL: 'http://party.test',
};

describe('ADR-001 — el BFF es intermediario, no dueño de datos', () => {
  it('no depende de drivers ni ORMs de base de datos', () => {
    const forbidden = ['mysql', 'mysql2', 'pg', 'postgres', 'knex', 'typeorm', 'prisma', 'sequelize', 'mongoose', 'drizzle-orm'];
    expect(Object.keys(pkg.dependencies).filter((d) => forbidden.includes(d))).toEqual([]);
  });

  it('solo llama microservicios a través de ServiceClient', () => {
    const offenders = allSource
      .filter(({ p }) => !p.replaceAll('\\', '/').match(/downstream|config\/secrets|auth\/oidc/))
      .filter(({ code }) => /\bfetch\(/.test(code))
      .map(({ p }) => p);
    expect(offenders).toEqual([]);
  });
});

describe('ADR-002 / ADR-005 — Keycloak con PKCE en el BFF', () => {
  const oidc = readFileSync(join(root, 'src/auth/oidc.ts'), 'utf8');
  it('usa Authorization Code con PKCE S256 y state', () => {
    expect(oidc).toContain("code_challenge_method: 'S256'");
    expect(oidc).toContain('pkceCodeVerifier');
    expect(oidc).toContain('expectedState');
  });
  it('la cookie de sesión es HTTP-only y SameSite', () => {
    const session = readFileSync(join(root, 'src/auth/session.ts'), 'utf8');
    expect(session).toMatch(/httpOnly: true/);
    expect(session).toMatch(/sameSite: 'lax'/);
  });
  it('no reenvía el token del usuario a los microservicios', () => {
    const client = readFileSync(join(root, 'src/downstream/service-client.ts'), 'utf8');
    expect(client).toContain('this.tokens.get()');
    expect(client).toContain("'X-User-Name'");
    expect(client).toContain("'X-User-Roles'");
    expect(client).not.toMatch(/accessToken/);
  });
});

describe('ADR-003 — persistencia portable MySQL/PostgreSQL', () => {
  it('ningún código del BFF contiene SQL ni dialectos de motor', () => {
    const sql = /\b(SELECT\s+.+\s+FROM|INSERT\s+INTO|CREATE\s+TABLE|AUTO_INCREMENT|SERIAL\b|jsonb)\b/i;
    expect(allSource.filter(({ code }) => sql.test(code)).map(({ p }) => p)).toEqual([]);
  });
  it('la configuración no conoce bases de datos (las poseen los microservicios)', () => {
    const env = readFileSync(join(root, 'src/config/env.ts'), 'utf8');
    expect(env).not.toMatch(/DATABASE_URL|MYSQL|POSTGRES/);
  });
});

describe('ADR-004 — secretos en HashiCorp Vault', () => {
  it('en producción exige Vault', async () => {
    const env = loadEnv({ ...baseEnv, NODE_ENV: 'production', OIDC_CLIENT_SECRET: 'x', SESSION_SECRET: 'y'.repeat(40) });
    await expect(withVaultSecrets(env, silent)).rejects.toThrow(/ADR-004/);
  });

  it('lee auth/keycloak y bff del KV v2 y los superpone al entorno', async () => {
    const seen: string[] = [];
    const fake = (async (url: URL | RequestInfo, init?: RequestInit) => {
      seen.push(`${String(url)}|${(init?.headers as Record<string, string>)['X-Vault-Token']}`);
      const data = String(url).endsWith('/auth/keycloak')
        ? { client_secret: 'kc-from-vault' }
        : { session_secret: 's'.repeat(40), redis_url: 'redis://vault' };
      return new Response(JSON.stringify({ data: { data } }), { status: 200 });
    }) as typeof fetch;
    const env = loadEnv({ ...baseEnv, NODE_ENV: 'production', VAULT_ADDR: 'http://vault.test:8200', VAULT_TOKEN: 'tok' });
    const out = await withVaultSecrets(env, silent, fake);
    expect(seen.sort()).toEqual([
      'http://vault.test:8200/v1/secret/data/gestion-formacion/auth/keycloak|tok',
      'http://vault.test:8200/v1/secret/data/gestion-formacion/bff|tok',
    ]);
    expect(out.OIDC_CLIENT_SECRET).toBe('kc-from-vault');
    expect(out.SESSION_SECRET).toBe('s'.repeat(40));
    expect(out.REDIS_URL).toBe('redis://vault');
  });

  it('falla en producción si Vault no tiene los secretos', async () => {
    const empty = (async () => new Response(JSON.stringify({ data: { data: {} } }), { status: 200 })) as typeof fetch;
    const env = loadEnv({ ...baseEnv, NODE_ENV: 'production', VAULT_ADDR: 'http://vault.test:8200', VAULT_TOKEN: 'tok' });
    await expect(withVaultSecrets(env, silent, empty)).rejects.toThrow(/faltan secretos/);
  });

  it('ningún secreto real está escrito en el código', () => {
    const leaks = allSource.filter(({ code }) => /(client_secret|password)\s*[:=]\s*['"][^'"]{6,}['"]/i.test(code));
    expect(leaks.map(({ p }) => p)).toEqual([]);
  });
});
