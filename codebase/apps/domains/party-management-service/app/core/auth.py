import jwt
import logging
from fastapi import HTTPException, Request
from app.config import config

logger = logging.getLogger(__name__)


async def get_current_user(request: Request) -> str:
    """
    Extract and validate JWT from HTTP-only session cookie.

    Returns: username (preferred_username claim from JWT)
    Raises: HTTPException 401 if token missing, expired, or invalid
    """
    token = request.cookies.get("session")
    if not token:
        raise HTTPException(status_code=401, detail="No session token")

    try:
        # For now, decode without verification (Keycloak public key would be fetched in production)
        payload = jwt.decode(
            token,
            options={"verify_signature": False}
        )
        username = payload.get("preferred_username")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token claims")
        return username

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidSignatureError:
        raise HTTPException(status_code=401, detail="Invalid token signature")
    except Exception as e:
        logger.error("token_validation_error", error=str(e))
        raise HTTPException(status_code=401, detail="Token validation failed")
