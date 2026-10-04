"""
Autenticación del llamante según ADR-005 §2.

El servicio NO autentica usuarios finales. Solo acepta llamadas del BFF:

    Authorization: Bearer <JWT de la cuenta de servicio del BFF, emitido por Keycloak>
    X-User-Name:   <usuario final, para auditoría y autorización>
    X-User-Roles:  <roles del usuario final, separados por coma>   (ver ARCHITECTURE.md, D-07)
    X-Request-ID:  <trazabilidad>

Se verifica firma (JWKS de Keycloak), emisor, vigencia y que el cliente (`azp`) sea uno de los
autorizados. Los headers de identidad solo se confían DESPUÉS de validar el token del BFF.
"""
import re
from dataclasses import dataclass
from functools import lru_cache

import jwt
from fastapi import Header, Request

from app.config import config
from app.core.errors import authentication_failed

_USERNAME = re.compile(r"^[\w.@+-]{1,255}$")
_ROLE = re.compile(r"^[a-z0-9_.-]{1,64}$")


@dataclass(frozen=True)
class Caller:
    """Usuario final en cuyo nombre actúa el BFF."""

    username: str
    roles: frozenset[str]
    client_id: str

    def has_any_role(self, *roles: str) -> bool:
        return any(r in self.roles for r in roles)


@lru_cache(maxsize=1)
def _jwks_client() -> jwt.PyJWKClient:
    return jwt.PyJWKClient(config.KEYCLOAK_JWKS_URL, cache_keys=True, lifespan=300, timeout=5)


def verify_service_token(token: str) -> dict:
    """Valida el JWT del BFF. Lanza ApiError 401 si no es válido."""
    try:
        signing_key = _jwks_client().get_signing_key_from_jwt(token).key
        claims = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256", "RS384", "RS512", "PS256", "ES256"],
            issuer=config.KEYCLOAK_ISSUER,
            leeway=config.AUTH_LEEWAY_SECONDS,
            options={"require": ["exp", "iat", "iss"], "verify_aud": False},
        )
    except jwt.ExpiredSignatureError:
        raise authentication_failed("El token del servicio llamante venció.")
    except (jwt.PyJWTError, jwt.PyJWKClientError) as exc:
        raise authentication_failed(f"Token del servicio llamante inválido: {type(exc).__name__}.")

    client_id = claims.get("azp") or claims.get("client_id")
    if client_id not in config.allowed_clients:
        raise authentication_failed("El servicio llamante no está autorizado.")
    return claims


async def get_caller(
    request: Request,
    authorization: str | None = Header(default=None),
    x_user_name: str | None = Header(default=None),
    x_user_roles: str | None = Header(default=None),
) -> Caller:
    """Dependencia FastAPI: valida el token del BFF y devuelve el usuario final."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise authentication_failed("Falta el token del servicio llamante.")
    claims = verify_service_token(authorization.split(" ", 1)[1].strip())

    if not x_user_name or not _USERNAME.match(x_user_name):
        raise authentication_failed("Falta o es inválido el header X-User-Name.")
    roles = frozenset(r.strip() for r in (x_user_roles or "").split(",") if _ROLE.match(r.strip()))

    caller = Caller(username=x_user_name, roles=roles, client_id=claims.get("azp", ""))
    request.state.caller = caller
    return caller
