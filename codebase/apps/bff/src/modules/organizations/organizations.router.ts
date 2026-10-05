import { Router } from 'express';
import type { Request } from 'express';
import { requireAnyRole } from '../../auth/guards.js';
import { Role } from '../../auth/roles.js';
import { relay } from '../../downstream/relay.js';
import type { ServiceClient } from '../../downstream/service-client.js';
import { pickQuery, requestIdOf, userName, userRoles } from '../../shared/http.js';

/** API-SPEC-006 §3.1: listado ampliado (ancestor_id, view, fechas de vigencia; sort y status admiten más valores en el servicio). */
const LIST_QUERY = ['page', 'limit', 'sort', 'type', 'status', 'search', 'parent_id', 'ancestor_id', 'view', 'from_date', 'thru_date'] as const;
const RELATIONSHIPS_QUERY = ['page', 'limit'] as const;

const identity = (req: Request) => ({ userName: userName(req), userRoles: userRoles(req), requestId: requestIdOf(req) });
const orgPath = (req: Request) => `/api/v1/organizations/${encodeURIComponent(String(req.params.orgId))}`;

/**
 * /api/v1/organizations → party-management-service (API-SPEC-002, API-SPEC-006).
 * La lectura (listado y detalle) es abierta a cualquier sesión (la usa el asistente de US-015);
 * el alta, la edición, el cambio de padre, desactivar y reactivar, y el historial son del Jefe de
 * Ingeniería o ADMIN (BR-PTY-17, EVD-2026-0238), y el servicio vuelve a validarlo.
 * Los errores 400/409/412 y la cabecera ETag del servicio se reenvían sin reescribir (relay).
 */
export function organizationsRouter(party: ServiceClient): Router {
  const r = Router();
  const managers = requireAnyRole(Role.JefeIngenieria, Role.Admin);

  r.get('/', async (req, res) => {
    relay(res, await party.call({ path: '/api/v1/organizations', query: pickQuery(req, LIST_QUERY), ...identity(req) }));
  });

  r.get('/:orgId', async (req, res) => {
    relay(res, await party.call({ path: orgPath(req), ...identity(req) }));
  });

  r.get('/:orgId/relationships', managers, async (req, res) => {
    relay(res, await party.call({ path: `${orgPath(req)}/relationships`, query: pickQuery(req, RELATIONSHIPS_QUERY), ...identity(req) }));
  });

  r.post('/', managers, async (req, res) => {
    relay(res, await party.call({ method: 'POST', path: '/api/v1/organizations', body: req.body, ...identity(req) }));
  });

  r.patch('/:orgId', managers, async (req, res) => {
    relay(res, await party.call({ method: 'PATCH', path: orgPath(req), body: req.body, ifMatch: req.get('if-match'), ...identity(req) }));
  });

  r.post('/:orgId/parent', managers, async (req, res) => {
    relay(res, await party.call({ method: 'POST', path: `${orgPath(req)}/parent`, body: req.body, ifMatch: req.get('if-match'), ...identity(req) }));
  });

  r.post('/:orgId/deactivate', managers, async (req, res) => {
    relay(res, await party.call({ method: 'POST', path: `${orgPath(req)}/deactivate`, ifMatch: req.get('if-match'), ...identity(req) }));
  });

  r.post('/:orgId/reactivate', managers, async (req, res) => {
    relay(res, await party.call({ method: 'POST', path: `${orgPath(req)}/reactivate`, body: req.body, ifMatch: req.get('if-match'), ...identity(req) }));
  });

  return r;
}

/** /api/v1/internal-organization → party-management-service (API-SPEC-007, borrador): solo lectura, Jefe de Ingeniería o ADMIN. */
export function internalOrganizationRouter(party: ServiceClient): Router {
  const r = Router();
  r.get('/', requireAnyRole(Role.JefeIngenieria, Role.Admin), async (req, res) => {
    relay(res, await party.call({ path: '/api/v1/internal-organization', ...identity(req) }));
  });
  return r;
}
