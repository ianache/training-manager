import { Router } from 'express';
import { requireAnyRole } from '../../auth/guards.js';
import { Role } from '../../auth/roles.js';
import { relay } from '../../downstream/relay.js';
import type { ServiceClient } from '../../downstream/service-client.js';
import { pickQuery, requestIdOf, userName, userRoles } from '../../shared/http.js';

const LIST_QUERY = ['page', 'limit', 'sort', 'status', 'unit_id', 'role', 'search'] as const;

/**
 * /api/v1/parties → party-management-service (API-SPEC-001 §3.1).
 * El BFF aplica RBAC grueso; la visibilidad por campo (P-08, BR-TRA-03…06) la decide el
 * servicio dueño de los datos según X-User-Name. Ver ARCHITECTURE.md, Q-03.
 */
export function partiesRouter(party: ServiceClient): Router {
  const r = Router();
  r.get('/', async (req, res) => {
    const out = await party.call({
      path: '/api/v1/parties',
      query: pickQuery(req, LIST_QUERY),
      userName: userName(req),
      userRoles: userRoles(req),
      requestId: requestIdOf(req),
    });
    relay(res, out);
  });

  r.get('/:partyId', async (req, res) => {
    const out = await party.call({
      path: `/api/v1/parties/${encodeURIComponent(req.params.partyId)}`,
      userName: userName(req),
      userRoles: userRoles(req),
      requestId: requestIdOf(req),
    });
    relay(res, out);
  });

  // US-015: solo el Jefe de Ingeniería registra colaboradores.
  r.post('/', requireAnyRole(Role.JefeIngenieria), async (req, res) => {
    const out = await party.call({
      method: 'POST',
      path: '/api/v1/parties',
      body: req.body,
      userName: userName(req),
      userRoles: userRoles(req),
      requestId: requestIdOf(req),
    });
    relay(res, out);
  });

  // US-016: el colaborador actualiza sus datos permitidos; el servicio valida qué campos.
  r.patch('/:partyId', async (req, res) => {
    const out = await party.call({
      method: 'PATCH',
      path: `/api/v1/parties/${encodeURIComponent(req.params.partyId)}`,
      body: req.body,
      userName: userName(req),
      userRoles: userRoles(req),
      requestId: requestIdOf(req),
    });
    relay(res, out);
  });

  return r;
}
