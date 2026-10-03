"""API-SPEC-002: organizaciones (unidades y proveedores)."""
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class OrganizationType(str, Enum):
    internal_unit = "internal_unit"
    external_provider = "external_provider"


class OrganizationStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class OrganizationOut(BaseModel):
    id: str
    name: str
    type: OrganizationType
    parent_id: Optional[str] = None
    status: OrganizationStatus
    code: Optional[str] = None
    location: Optional[str] = None
    ruc: Optional[str] = None
