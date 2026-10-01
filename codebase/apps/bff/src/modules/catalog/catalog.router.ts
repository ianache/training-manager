import { Router } from 'express';
import { requireAnyRole } from '../../auth/guards.js';
import { Role } from '../../auth/roles.js';
import type { ServiceClient } from '../../downstream/service-client.js';
import { ApiError } from '../../shared/api-error.js';
import { pickQuery, requestIdOf, userName, userRoles } from '../../shared/http.js';
import { relay } from '../../downstream/relay.js';

/**
 * /api/v1/catalog → catalog-service (US-001, US-002).
 * El servicio todavía no existe: sin CATALOG_SERVICE_URL responde 503 y el portal muestra
 * el estado de error. Los paths downstream son SUPUESTOS hasta que haya API-SPEC del catálogo.
 */
export function catalogRouter(catalog: ServiceClient | null): Router {
  const r = Router();

  r.use((_req, _res, next) =>
    catalog
      ? next()
      : next(new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'El catálogo todavía no está disponible.', { service: 'catalog' })),
  );

  r.get('/roles', async (req, res) => {
    const out = await catalog!.call({
      path: '/api/v1/roles',
      query: pickQuery(req, ['page', 'limit', 'sort', 'search', 'status']),
      userName: userName(req),
      userRoles: userRoles(req),
      requestId: requestIdOf(req),
    });
    relay(res, out);
  });

  r.get('/roles/:roleId', async (req, res) => {
    const out = await catalog!.call({
      path: `/api/v1/roles/${encodeURIComponent(req.params.roleId)}`,
      userName: userName(req),
      userRoles: userRoles(req),
      requestId: requestIdOf(req),
    });
    relay(res, out);
  });

  // BR-CAT-04: solo el Jefe de Ingeniería modifica el catálogo.
  r.post('/roles', requireAnyRole(Role.JefeIngenieria), async (req, res) => {
    const out = await catalog!.call({
      method: 'POST',
      path: '/api/v1/roles',
      body: req.body,
      userName: userName(req),
      userRoles: userRoles(req),
      requestId: requestIdOf(req),
    });
    relay(res, out);
  });

  return r;
}
