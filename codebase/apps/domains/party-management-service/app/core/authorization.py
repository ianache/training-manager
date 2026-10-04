"""
Autorización por rol del usuario final (roles de realm de Keycloak, alineados con el BFF y el portal).

Visibilidad de datos maestros (UXR-000.5, decisión P-08 del 2026-09-27; API-SPEC-001 "visibility"):
- Jefe de Ingeniería y ADMIN: ficha completa.
- Cualquier otro colaborador: solo nombre, correo laboral, unidad, rol y estado.

Pendiente (no se infiere): reconocer "su propia ficha" requiere el vínculo con Keycloak (US-022),
que este servicio todavía no modela. Hasta entonces el colaborador ve su ficha en vista limitada.
"""
from fastapi import Depends

from app.core.auth import Caller, get_caller
from app.core.errors import authorization_failed

JEFE_INGENIERIA = "jefe_ingenieria"
ADMIN = "admin"
FULL_VIEW_ROLES = (JEFE_INGENIERIA, ADMIN)
WRITE_ROLES = (JEFE_INGENIERIA,)
STRUCTURE_ROLES = (JEFE_INGENIERIA, ADMIN)  # BR-PTY-17 ampliado el 2026-10-04 (EVD-2026-0238)


def can_see_full(caller: Caller) -> bool:
    return caller.has_any_role(*FULL_VIEW_ROLES)


async def require_jefe_ingenieria(caller: Caller = Depends(get_caller)) -> Caller:
    """US-015 / US-016: solo el Jefe de Ingeniería registra y modifica colaboradores."""
    if not caller.has_any_role(*WRITE_ROLES):
        raise authorization_failed("Solo el Jefe de Ingeniería puede realizar esta acción.")
    return caller


async def require_structure_manager(caller: Caller = Depends(get_caller)) -> Caller:
    """US-017/028/029/030: el Jefe de Ingeniería y ADMIN gestionan la estructura organizacional (BR-PTY-17)."""
    if not caller.has_any_role(*STRUCTURE_ROLES):
        raise authorization_failed("Solo el Jefe de Ingeniería o ADMIN pueden gestionar la estructura organizacional.")
    return caller
