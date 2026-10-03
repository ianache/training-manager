"""API-SPEC-002: organizaciones (unidades y proveedores)."""
import re
from enum import Enum
from typing import Optional, Self
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

RUC_RE = re.compile(r"^\d{11}$")


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


class OrganizationCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=200)
    type: OrganizationType
    parent_id: Optional[UUID] = None
    code: Optional[str] = Field(None, max_length=40)
    location: Optional[str] = Field(None, max_length=120)
    ruc: Optional[str] = None

    @field_validator("ruc")
    @classmethod
    def _ruc_format(cls, v):
        if v is not None and not RUC_RE.match(v):
            raise ValueError("El RUC debe tener 11 dígitos.")
        return v

    @model_validator(mode="after")
    def _by_type(self) -> Self:
        if self.type == OrganizationType.external_provider:
            if self.ruc is None:
                raise ValueError("El proveedor requiere RUC.")
            if self.parent_id or self.code or self.location:
                raise ValueError("El proveedor no admite parent_id, code ni location.")
        elif self.ruc is not None:
            raise ValueError("La unidad no admite RUC.")
        return self
