import logging
from fastapi import HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.auth import get_current_user

logger = logging.getLogger(__name__)


async def get_user_roles(username: str) -> list[str]:
    """
    Fetch user roles from Keycloak.
    TODO: Implement real Keycloak integration.
    For now, hardcode roles for testing.
    """
    # Placeholder: in production, query Keycloak
    if username == "admin":
        return ["jefe_ingeniera", "developer"]
    return ["developer"]


async def check_jefe_ingeniera(
    current_user: str = Depends(get_current_user)
) -> str:
    """
    Verify user has jefe_ingeniera role.
    Raises: HTTPException 403 if unauthorized
    """
    roles = await get_user_roles(current_user)
    if "jefe_ingeniera" not in roles:
        raise HTTPException(
            status_code=403,
            detail="Only Jefe de Ingeniería can perform this action"
        )
    return current_user


async def check_party_access(
    party_id: str,
    current_user: str = Depends(get_current_user),
) -> None:
    """
    Verify user can access party (early auth check, before DB query).
    Raises: HTTPException 403 if unauthorized
    """
    roles = await get_user_roles(current_user)

    # Jefe de Ingeniería can access all parties
    if "jefe_ingeniera" in roles:
        return

    # Colaborador can only access their own party
    # TODO: Implement actual party lookup
    raise HTTPException(
        status_code=403,
        detail="Cannot access other party's data"
    )
