"""
Autorización por rol del usuario final (roles de realm de Keycloak, alineados con el BFF y el portal).
API-SPEC-003 §3:

- Leer: cualquier sesión autenticada (AC-12, EVD-2026-0118).
- Alta y edición de roles: jefe_ingenieria, product_owner y admin (BR-CAT-04/05, EVD-2026-0147/0150/0168).
- Desactivar o reactivar un nivel de rol: jefe_ingenieria o admin (BR-CAT-30, EVD-2026-0183).
"""
from fastapi import Depends

from app.core.auth import Caller, get_caller
from app.core.errors import authorization_failed

JEFE_INGENIERIA = "jefe_ingenieria"
PRODUCT_OWNER = "product_owner"
ADMIN = "admin"
ROLE_WRITE_ROLES = (JEFE_INGENIERIA, PRODUCT_OWNER, ADMIN)
LEVEL_STATUS_ROLES = (JEFE_INGENIERIA, ADMIN)


async def require_role_editor(caller: Caller = Depends(get_caller)) -> Caller:
    if not caller.has_any_role(*ROLE_WRITE_ROLES):
        raise authorization_failed("Solo el Jefe de Ingeniería, el Responsable de producto o ADMIN editan roles.")
    return caller


async def require_level_status_editor(caller: Caller = Depends(get_caller)) -> Caller:
    if not caller.has_any_role(*LEVEL_STATUS_ROLES):
        raise authorization_failed("Solo el Jefe de Ingeniería o ADMIN desactivan o reactivan niveles.")
    return caller
