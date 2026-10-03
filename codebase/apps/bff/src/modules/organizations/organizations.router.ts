import { Router } from 'express';
import type { Request } from 'express';
import { requireAnyRole } from '../../auth/guards.js';
import { Role } from '../../auth/roles.js';
import { relay } from '../../downstream/relay.js';
import type { ServiceClient } from '../../downstream/service-client.js';
import { pickQuery, requestIdOf, userName, userRoles } from '../../shared/http.js';

const LIST_QUERY = ['page', 'limit', 'sort', 'type', 'status', 'search', 'parent_id'] as const;

const identity = (req: Request) => ({ userName: userName(req), userRoles: userRoles(req), requestId: requestIdOf(req) });

/**
 * /api/v1/organizations → party-management-service (API-SPEC-002).
 * La lectura es abierta a cualquier sesión; el alta es solo del Jefe de Ingeniería (BR-PTY-17),
 * y el servicio vuelve a validarlo.
 */
export function organizationsRouter(party: ServiceClient): Router {
  const r = Router();

  r.get('/', async (req, res) => {
    relay(res, await party.call({ path: '/api/v1/organizations', query: pickQuery(req, LIST_QUERY), ...identity(req) }));
  });

  r.get('/:orgId', async (req, res) => {
    relay(res, await party.call({ path: `/api/v1/organizations/${encodeURIComponent(req.params.orgId)}`, ...identity(req) }));
  });

  r.post('/', requireAnyRole(Role.JefeIngenieria), async (req, res) => {
    relay(res, await party.call({ method: 'POST', path: '/api/v1/organizations', body: req.body, ...identity(req) }));
  });

  return r;
}
