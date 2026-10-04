import { Router, type Request } from 'express';
import { requireAnyRole } from '../../auth/guards.js';
import { Role } from '../../auth/roles.js';
import type { ServiceClient } from '../../downstream/service-client.js';
import { ApiError } from '../../shared/api-error.js';
import { pickQuery, requestIdOf, userName, userRoles } from '../../shared/http.js';
import { relay } from '../../downstream/relay.js';

/**
 * /api/v1/catalog → catalog-service (US-001, US-019; API-SPEC-003 §1).
 * Sin CATALOG_SERVICE_URL responde 503 y el portal muestra el estado de error.
 * El BFF solo filtra por rol y reenvía: el servicio vuelve a validar roles y reglas (ADR-011).
 * Las escrituras no se reintentan: el contrato no las hace idempotentes (ADR-012, abierto).
 */
export function catalogRouter(catalog: ServiceClient | null): Router {
  const r = Router();

  r.use((_req, _res, next) =>
    catalog
      ? next()
      : next(new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'El catálogo todavía no está disponible.', { service: 'catalog' })),
  );

  const call = (req: Request, path: string, extra: { method?: string; query?: string[]; body?: boolean; ifMatch?: boolean } = {}) =>
    catalog!.call({
      method: extra.method,
      path,
      query: extra.query ? pickQuery(req, extra.query) : undefined,
      body: extra.body ? req.body : undefined,
      ifMatch: extra.ifMatch ? req.get('if-match') : undefined,
      userName: userName(req),
      userRoles: userRoles(req),
      requestId: requestIdOf(req),
    });
  const id = (v: string | string[] | undefined) => encodeURIComponent(String(v));

  // Lectura: cualquier sesión (AC-12).
  r.get('/roles', async (req, res) => relay(res, await call(req, '/api/v1/roles', { query: ['page', 'limit', 'sort', 'search', 'status'] })));
  r.get('/roles/:roleId', async (req, res) => relay(res, await call(req, `/api/v1/roles/${id(req.params.roleId)}`)));
  r.get('/competencies', async (req, res) =>
    relay(res, await call(req, '/api/v1/competencies', { query: ['page', 'limit', 'search', 'status'] })),
  );
  r.get('/competencies/:competencyId', async (req, res) =>
    relay(res, await call(req, `/api/v1/competencies/${id(req.params.competencyId)}`)),
  );

  // BR-CAT-04/05: editan roles el Jefe de Ingeniería, el Responsable de producto y ADMIN.
  const roleEditors = requireAnyRole(Role.JefeIngenieria, Role.ProductOwner, Role.Admin);
  r.post('/roles', roleEditors, async (req, res) => relay(res, await call(req, '/api/v1/roles', { method: 'POST', body: true })));
  r.put('/roles/:roleId', roleEditors, async (req, res) =>
    relay(res, await call(req, `/api/v1/roles/${id(req.params.roleId)}`, { method: 'PUT', body: true, ifMatch: true })),
  );
  r.post('/roles/:roleId/deactivate', roleEditors, async (req, res) =>
    relay(res, await call(req, `/api/v1/roles/${id(req.params.roleId)}/deactivate`, { method: 'POST', ifMatch: true })),
  );

  // BR-CAT-30: desactivar o reactivar un nivel es del Jefe de Ingeniería o ADMIN.
  const levelEditors = requireAnyRole(Role.JefeIngenieria, Role.Admin);
  for (const action of ['deactivate', 'reactivate'] as const) {
    r.post(`/roles/:roleId/levels/:levelId/${action}`, levelEditors, async (req, res) =>
      relay(res, await call(req, `/api/v1/roles/${id(req.params.roleId)}/levels/${id(req.params.levelId)}/${action}`, { method: 'POST' })),
    );
  }

  return r;
}
