import request from 'supertest';
import { MemoryStore } from 'express-session';
import { pino } from 'pino';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import type { OidcPort, TokenSet } from '../src/auth/oidc.js';
import { safeReturnTo } from '../src/auth/auth.router.js';

const env = loadEnv({
  NODE_ENV: 'test',
  PUBLIC_ORIGIN: 'http://portal.test',
  OIDC_ISSUER: 'http://kc.test/realms/gestion-formacion',
  OIDC_CLIENT_ID: 'bff-app',
  OIDC_CLIENT_SECRET: 'secret',
  OIDC_REDIRECT_URI: 'http://portal.test/auth/callback',
  SESSION_SECRET: 'x'.repeat(40),
  PARTY_SERVICE_URL: 'http://party.test',
});

function tokens(roles: string[]): TokenSet {
  return {
    accessToken: 'user-at',
    refreshToken: 'user-rt',
    idToken: 'user-idt',
    expiresAt: Date.now() + 300_000,
    identity: { sub: 'u1', preferred_username: 'ana.colaboradora', name: 'Ana Colaboradora', email: 'ana@comsatel.com.pe', roles },
  };
}

function fakeOidc(roles: string[]): OidcPort {
  return {
    startLogin: async () => ({ authorizationUrl: 'http://kc.test/auth?state=st-1', codeVerifier: 'v-1', state: 'st-1' }),
    completeLogin: async (url, verifier, state) => {
      if (url.searchParams.get('state') !== state || verifier !== 'v-1') throw new Error('bad state');
      return tokens(roles);
    },
    refresh: async () => tokens(roles),
    serviceToken: async () => ({ accessToken: 'svc-token', expiresAt: Date.now() + 300_000 }),
    logoutUrl: (_id, post) => `http://kc.test/logout?post_logout_redirect_uri=${encodeURIComponent(post)}`,
  };
}

function setup(roles: string[] = ['colaborador'], downstreamStatus = 200, downstreamHeaders: Record<string, string> = {}) {
  const calls: { url: string; headers: Record<string, string> }[] = [];
  const fetchImpl = (async (input: URL | RequestInfo, init?: RequestInit) => {
    calls.push({ url: String(input), headers: init?.headers as Record<string, string> });
    if (downstreamStatus !== 200)
      return new Response('{"error":{"code":"X","status":' + downstreamStatus + '}}', { status: downstreamStatus, headers: downstreamHeaders });
    return new Response(JSON.stringify({ data: [], pagination: { page: 1, limit: 20, total: 0, total_pages: 0, has_next: false, has_prev: false } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;
  const app = createApp({ env, logger: pino({ level: 'silent' }), oidc: fakeOidc(roles), sessionStore: new MemoryStore(), fetchImpl });
  return { app, calls, agent: request.agent(app) };
}

async function login(agent: ReturnType<typeof request.agent>) {
  const start = await agent.get('/auth/login?returnTo=/colaboradores');
  expect(start.status).toBe(302);
  expect(start.headers['location']).toBe('http://kc.test/auth?state=st-1');
  const cb = await agent.get('/auth/callback?code=abc&state=st-1');
  expect(cb.status).toBe(302);
  expect(cb.headers['location']).toBe('http://portal.test/colaboradores');
  return Object.assign(cb, { xsrf: xsrfFrom(start) });
}

function xsrfFrom(res: request.Response): string {
  const cookies = ([] as string[]).concat(res.headers['set-cookie'] ?? []);
  const c = cookies.find((x) => x.startsWith('XSRF-TOKEN='));
  return c ? decodeURIComponent(c.split(';')[0]!.split('=')[1]!) : '';
}

describe('BFF', () => {
  it('responde liveness sin sesión', async () => {
    const { app } = setup();
    await request(app).get('/health/live').expect(200, { status: 'alive' });
  });

  it('rechaza la API sin sesión con el formato de error estándar', async () => {
    const { app } = setup();
    const res = await request(app).get('/api/v1/parties').set('X-Request-ID', 'req-42').expect(401);
    expect(res.body.error).toMatchObject({ code: 'AUTHENTICATION_FAILED', status: 401, request_id: 'req-42' });
  });

  it('completa login PKCE, emite cookie HTTP-only y no expone tokens', async () => {
    const { agent } = setup();
    const cb = await login(agent);
    const sid = ([] as string[]).concat(cb.headers['set-cookie'] ?? []).find((c) => c.startsWith('gf.sid='));
    expect(sid).toMatch(/HttpOnly/i);
    expect(sid).toMatch(/SameSite=Lax/i);

    const s = await agent.get('/auth/session').expect(200);
    expect(s.body).toMatchObject({ username: 'ana.colaboradora', roles: ['colaborador'] });
    expect(JSON.stringify(s.body)).not.toContain('user-at');
    expect(s.body.expiresAt).toBeTruthy();
  });

  it('propaga identidad con token de servicio + X-User-Name (ADR-005 §2)', async () => {
    const { agent, calls } = setup();
    await login(agent);
    await agent.get('/api/v1/parties?search=ana&evil=1').expect(200);
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe('http://party.test/api/v1/parties?search=ana');
    expect(calls[0]!.headers['Authorization']).toBe('Bearer svc-token');
    expect(calls[0]!.headers['X-User-Name']).toBe('ana.colaboradora');
    expect(calls[0]!.headers['X-User-Roles']).toBe('colaborador');
    expect(calls[0]!.headers['X-Request-ID']).toBeTruthy();
  });

  it('exige CSRF en escrituras', async () => {
    const { agent } = setup(['jefe_ingenieria']);
    const cb = await login(agent);
    await agent.post('/api/v1/parties').send({}).expect(403);
    const xsrf = cb.xsrf;
    await agent.post('/api/v1/parties').set('X-XSRF-TOKEN', xsrf).send({ first_names: 'X' }).expect(200);
  });

  it('aplica RBAC: un colaborador no registra colaboradores', async () => {
    const { agent } = setup(['colaborador']);
    const cb = await login(agent);
    const xsrf = cb.xsrf;
    const res = await agent.post('/api/v1/parties').set('X-XSRF-TOKEN', xsrf).send({}).expect(403);
    expect(res.body.error.code).toBe('AUTHORIZATION_FAILED');
  });

  it('reenvía la lectura de organizaciones con solo los query params permitidos', async () => {
    const { agent, calls } = setup(['colaborador']);
    await login(agent);
    await agent.get('/api/v1/organizations?type=internal_unit&search=ing&limit=10&evil=1').expect(200);
    expect(calls.at(-1)!.url).toBe('http://party.test/api/v1/organizations?limit=10&type=internal_unit&search=ing');
  });

  it('lee una organización por id con el id codificado', async () => {
    const { agent, calls } = setup(['colaborador']);
    await login(agent);
    await agent.get('/api/v1/organizations/abc%2F1').expect(200);
    expect(calls.at(-1)!.url).toBe('http://party.test/api/v1/organizations/abc%2F1');
  });

  it('aplica RBAC: un colaborador no crea organizaciones y no se llama al servicio', async () => {
    const { agent, calls } = setup(['colaborador']);
    const cb = await login(agent);
    const res = await agent.post('/api/v1/organizations').set('X-XSRF-TOKEN', cb.xsrf).send({ name: 'X', type: 'internal_unit' }).expect(403);
    expect(res.body.error.code).toBe('AUTHORIZATION_FAILED');
    expect(calls).toHaveLength(0);
  });

  it('el Jefe de Ingeniería crea una organización: exige CSRF y reenvía el cuerpo', async () => {
    const { agent, calls } = setup(['jefe_ingenieria']);
    const cb = await login(agent);
    await agent.post('/api/v1/organizations').send({}).expect(403);
    expect(calls).toHaveLength(0);
    await agent.post('/api/v1/organizations').set('X-XSRF-TOKEN', cb.xsrf).send({ name: 'Ingeniería', type: 'internal_unit' }).expect(200);
    expect(calls.at(-1)!.url).toBe('http://party.test/api/v1/organizations');
  });

  it('responde 503 cuando el catálogo aún no existe', async () => {
    const { agent } = setup(['jefe_ingenieria']);
    await login(agent);
    const res = await agent.get('/api/v1/catalog/roles').expect(503);
    expect(res.body.error.code).toBe('UPSTREAM_UNAVAILABLE');
  });

  it('logout destruye la sesión y redirige a Keycloak', async () => {
    const { agent } = setup();
    const cb = await login(agent);
    const xsrf = cb.xsrf;
    const out = await agent.post('/auth/logout').type('form').send({ _csrf: xsrf }).expect(302);
    expect(out.headers['location']).toContain('http://kc.test/logout');
    await agent.get('/auth/session').expect(401);
  });

  it('rechaza un callback con state inválido', async () => {
    const { agent } = setup();
    await agent.get('/auth/login');
    const cb = await agent.get('/auth/callback?code=abc&state=otro').expect(302);
    expect(cb.headers['location']).toBe('http://portal.test/sesion-vencida');
  });

  it('un 401 del microservicio no se confunde con sesión vencida (502)', async () => {
    const { agent } = setup(['colaborador'], 401);
    await login(agent);
    const res = await agent.get('/api/v1/parties').expect(502);
    expect(res.body.error).toMatchObject({ code: 'UPSTREAM_AUTH_FAILED', details: { service: 'party-management-service' } });
    await agent.get('/auth/session').expect(200);
  });

  it('reenvía el 429 del servicio con Retry-After y X-RateLimit-* (API-SPEC-001 §4.5)', async () => {
    const { agent } = setup(['colaborador'], 429, {
      'Retry-After': '120',
      'X-RateLimit-Limit': '1000',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': '1790000000',
      'X-Internal-Secret': 'no-reenviar',
    });
    await login(agent);
    const res = await agent.get('/api/v1/parties').expect(429);
    expect(res.headers['retry-after']).toBe('120');
    expect(res.headers['x-ratelimit-remaining']).toBe('0');
    expect(res.headers['x-internal-secret']).toBeUndefined();
  });

  it('evita open redirect en returnTo', () => {
    expect(safeReturnTo('https://evil.com')).toBe('/');
    expect(safeReturnTo('//evil.com')).toBe('/');
    expect(safeReturnTo('/catalogo?x=1')).toBe('/catalogo?x=1');
  });
});
