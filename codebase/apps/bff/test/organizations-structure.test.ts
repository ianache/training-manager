import request from 'supertest';
import { MemoryStore } from 'express-session';
import { pino } from 'pino';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import type { OidcPort, TokenSet } from '../src/auth/oidc.js';

/** DCP-004 fase 3: proxy autorizado de la gestión de unidades (API-SPEC-006) y de la lectura de la organización interna (API-SPEC-007). */

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

const tokens = (roles: string[]): TokenSet => ({
  accessToken: 'user-at',
  refreshToken: 'user-rt',
  idToken: 'user-idt',
  expiresAt: Date.now() + 300_000,
  identity: { sub: 'u1', preferred_username: 'jefe.ing', name: 'Jefe', email: 'j@comsatel.com.pe', roles },
});

const fakeOidc = (roles: string[]): OidcPort => ({
  startLogin: async () => ({ authorizationUrl: 'http://kc.test/auth?state=st-1', codeVerifier: 'v-1', state: 'st-1' }),
  completeLogin: async () => tokens(roles),
  refresh: async () => tokens(roles),
  serviceToken: async () => ({ accessToken: 'svc-token', expiresAt: Date.now() + 300_000 }),
  logoutUrl: (_id, post) => post,
});

interface Reply {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
}

function setup(roles: string[], reply: Reply = { status: 200, body: { data: {} } }) {
  const calls: { url: string; method?: string; headers: Record<string, string>; body?: unknown }[] = [];
  const fetchImpl = (async (input: URL | RequestInfo, init?: RequestInit) => {
    calls.push({ url: String(input), method: init?.method, headers: init?.headers as Record<string, string>, body: init?.body });
    return new Response(JSON.stringify(reply.body), { status: reply.status, headers: { 'Content-Type': 'application/json', ...reply.headers } });
  }) as typeof fetch;
  const app = createApp({ env, logger: pino({ level: 'silent' }), oidc: fakeOidc(roles), sessionStore: new MemoryStore(), fetchImpl });
  return { calls, agent: request.agent(app) };
}

async function login(agent: ReturnType<typeof request.agent>): Promise<string> {
  const start = await agent.get('/auth/login?returnTo=/x');
  await agent.get('/auth/callback?code=abc&state=st-1');
  const c = ([] as string[]).concat(start.headers['set-cookie'] ?? []).find((x) => x.startsWith('XSRF-TOKEN='));
  return c ? decodeURIComponent(c.split(';')[0]!.split('=')[1]!) : '';
}

const ORG = '11111111-1111-4111-8111-111111111111';
const PARENT = '22222222-2222-4222-8222-222222222222';
const ANC = '33333333-3333-4333-8333-333333333333';
const MANAGERS = ['jefe_ingenieria', 'admin'];

describe('GET /api/v1/organizations ampliado', () => {
  it('reenvía status, ancestor_id, sort, fechas y view; descarta lo desconocido', async () => {
    const { agent, calls } = setup(['colaborador']);
    await login(agent);
    await agent
      .get(`/api/v1/organizations?status=all&ancestor_id=${ANC}&sort=parent_name:desc&view=tree&from_date=2026-01-01&thru_date=2026-12-31&evil=1`)
      .expect(200);
    const url = new URL(calls.at(-1)!.url);
    expect(url.searchParams.get('status')).toBe('all');
    expect(url.searchParams.get('ancestor_id')).toBe(ANC);
    expect(url.searchParams.get('sort')).toBe('parent_name:desc');
    expect(url.searchParams.get('view')).toBe('tree');
    expect(url.searchParams.get('from_date')).toBe('2026-01-01');
    expect(url.searchParams.get('thru_date')).toBe('2026-12-31');
    expect(url.searchParams.has('evil')).toBe(false);
  });

  it('el listado sigue abierto a cualquier sesión autenticada', async () => {
    const { agent, calls } = setup(['colaborador']);
    await login(agent);
    await agent.get('/api/v1/organizations?view=tree').expect(200);
    expect(calls).toHaveLength(1);
  });

  it('type=internal_organization no se reescribe: el 400 del servicio llega tal cual', async () => {
    const body = { error: { code: 'VALIDATION_ERROR', message: 'type inválido', status: 400 } };
    const { agent, calls } = setup(['jefe_ingenieria'], { status: 400, body });
    await login(agent);
    const res = await agent.get('/api/v1/organizations?type=internal_organization').expect(400);
    expect(res.body).toEqual(body);
    expect(new URL(calls.at(-1)!.url).searchParams.get('type')).toBe('internal_organization');
  });
});

describe.each([
  ['PATCH', `/api/v1/organizations/${ORG}`, { name: 'Soporte' }],
  ['POST', `/api/v1/organizations/${ORG}/parent`, { parent_id: PARENT, from_date: '2026-10-03' }],
  ['POST', `/api/v1/organizations/${ORG}/deactivate`, undefined],
  ['POST', `/api/v1/organizations/${ORG}/reactivate`, { from_date: '2026-10-04', parent_id: null }],
] as const)('%s %s (escritura de estructura)', (method, path, payload) => {
  const send = (agent: ReturnType<typeof request.agent>, xsrf: string, headers: Record<string, string> = {}) => {
    const t = method === 'PATCH' ? agent.patch(path) : agent.post(path);
    t.set('X-XSRF-TOKEN', xsrf);
    for (const [k, v] of Object.entries(headers)) t.set(k, v);
    return payload === undefined ? t : t.send(payload);
  };

  it.each(MANAGERS)('%s: reenvía método, ruta, cuerpo, If-Match y devuelve ETag', async (role) => {
    const { agent, calls } = setup([role], { status: 200, body: { id: ORG }, headers: { ETag: '"4"' } });
    const xsrf = await login(agent);
    const res = await send(agent, xsrf, { 'If-Match': '"3"' }).expect(200);
    const call = calls.at(-1)!;
    expect(call.url).toBe(`http://party.test${path}`);
    expect(call.method).toBe(method);
    expect(call.headers['If-Match']).toBe('"3"');
    expect(call.headers['X-User-Name']).toBe('jefe.ing');
    expect(call.headers['X-User-Roles']).toBe(role);
    if (payload !== undefined) expect(JSON.parse(String(call.body))).toEqual(payload);
    expect(res.headers['etag']).toBe('"4"');
  });

  it.each(['colaborador', 'jefe_proyecto', 'product_owner'])('%s recibe 403 y no se llama al servicio', async (role) => {
    const { agent, calls } = setup([role]);
    const xsrf = await login(agent);
    const res = await send(agent, xsrf).expect(403);
    expect(res.body.error.code).toBe('AUTHORIZATION_FAILED');
    expect(calls).toHaveLength(0);
  });

  it.each([
    [412, 'PRECONDITION_FAILED', undefined],
    [409, 'ORGANIZATION_HAS_DEPENDENCIES', { active_children_count: 3, current_people_count: 12 }],
    [409, 'PARENT_INACTIVE', { id: PARENT, name: 'Padre' }],
    [409, 'ORGANIZATION_DUPLICATE', undefined],
    [409, 'ORGANIZATION_INACTIVE', undefined],
    [400, 'VALIDATION_ERROR', undefined],
  ])('propaga %i %s sin reescribirlo', async (status, code, details) => {
    const body = { error: { code, message: 'm', status, details } };
    const { agent } = setup(['jefe_ingenieria'], { status, body });
    const xsrf = await login(agent);
    const res = await send(agent, xsrf).expect(status);
    expect(res.body).toEqual(JSON.parse(JSON.stringify(body)));
  });
});

describe('GET /api/v1/organizations/:id/relationships', () => {
  it.each(MANAGERS)('%s lee el historial; reenvía la paginación', async (role) => {
    const { agent, calls } = setup([role]);
    await login(agent);
    await agent.get(`/api/v1/organizations/${ORG}/relationships?page=2&limit=5&evil=1`).expect(200);
    const u = new URL(calls.at(-1)!.url);
    expect(u.pathname).toBe(`/api/v1/organizations/${ORG}/relationships`);
    expect(u.searchParams.get('page')).toBe('2');
    expect(u.searchParams.get('limit')).toBe('5');
    expect(u.searchParams.has('evil')).toBe(false);
  });

  it('un colaborador recibe 403 sin llamar al servicio', async () => {
    const { agent, calls } = setup(['colaborador']);
    await login(agent);
    await agent.get(`/api/v1/organizations/${ORG}/relationships`).expect(403);
    expect(calls).toHaveLength(0);
  });
});

describe('GET /api/v1/internal-organization', () => {
  it.each(MANAGERS)('%s lee la organización interna', async (role) => {
    const { agent, calls } = setup([role], { status: 200, body: { data: { name: 'COMSATEL' } } });
    await login(agent);
    const res = await agent.get('/api/v1/internal-organization?x=1').expect(200);
    expect(res.body.data.name).toBe('COMSATEL');
    expect(calls.at(-1)!.url).toBe('http://party.test/api/v1/internal-organization');
  });

  it('un colaborador recibe 403 sin llamar al servicio', async () => {
    const { agent, calls } = setup(['colaborador']);
    await login(agent);
    await agent.get('/api/v1/internal-organization').expect(403);
    expect(calls).toHaveLength(0);
  });

  it('propaga el 404 INTERNAL_ORGANIZATION_NOT_FOUND', async () => {
    const body = { error: { code: 'INTERNAL_ORGANIZATION_NOT_FOUND', message: 'm', status: 404 } };
    const { agent } = setup(['admin'], { status: 404, body });
    await login(agent);
    const res = await agent.get('/api/v1/internal-organization').expect(404);
    expect(res.body).toEqual(body);
  });

  it('sin sesión recibe 401', async () => {
    const { agent } = setup(['admin']);
    await agent.get('/api/v1/internal-organization').expect(401);
  });
});

describe('POST /api/v1/organizations (alta) con Q-2 resuelta', () => {
  it('ADMIN también registra unidades (EVD-2026-0238)', async () => {
    const { agent, calls } = setup(['admin']);
    const xsrf = await login(agent);
    await agent.post('/api/v1/organizations').set('X-XSRF-TOKEN', xsrf).send({ name: 'X', type: 'internal_unit' }).expect(200);
    expect(calls).toHaveLength(1);
  });
});
