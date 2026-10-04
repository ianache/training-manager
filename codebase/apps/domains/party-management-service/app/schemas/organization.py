"""API-SPEC-002: organizaciones (unidades y proveedores)."""
import re
from enum import Enum
from datetime import date
from typing import Optional, Self
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

RUC_RE = re.compile(r"^\d{11}$")


class OrganizationType(str, Enum):
    internal_unit = "internal_unit"
    external_provider = "external_provider"


class OrganizationStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class OrganizationStatusFilter(str, Enum):
    """Valores del parámetro `status` del listado (API-SPEC-006 §3.1)."""

    active = "active"
    inactive = "inactive"
    all = "all"


class OrganizationView(str, Enum):
    list = "list"
    tree = "tree"


class OrganizationContact(BaseModel):
    """Contacto vigente de la organización (IMD-002 R-31): 1..N correos y 0..N teléfonos."""

    emails: list[str] = Field(default_factory=list)
    phones: list[str] = Field(default_factory=list)


class OrganizationOut(BaseModel):
    id: str
    name: str
    type: OrganizationType
    parent_id: Optional[str] = None
    status: OrganizationStatus
    code: Optional[str] = None
    location: Optional[str] = None
    ruc: Optional[str] = None
    contact: OrganizationContact = Field(default_factory=OrganizationContact)
    # solo internal_unit (API-SPEC-006 §3.1); nulos para los proveedores
    from_date: Optional[date] = None
    thru_date: Optional[date] = None
    active_children_count: Optional[int] = None
    current_people_count: Optional[int] = None
    children: Optional[list["OrganizationOut"]] = None  # solo con view=tree
    row_version: Optional[int] = None  # versión para If-Match (Q-8); también viaja en la cabecera ETag


class OrganizationContactIn(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email_work: EmailStr
    phone_work: Optional[str] = Field(None, max_length=20, pattern=r"^\+?[0-9 ()-]{6,20}$")


class OrganizationCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=200)
    type: OrganizationType
    parent_id: Optional[UUID] = None
    code: Optional[str] = Field(None, max_length=40)
    location: Optional[str] = Field(None, max_length=120)
    ruc: Optional[str] = None
    contact: OrganizationContactIn

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


class OrganizationRenameRequest(BaseModel):
    """PATCH /organizations/{id}: solo el nombre en esta versión (API-SPEC-006 §3.3)."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=200)


class ParentChangeRequest(BaseModel):
    """POST /organizations/{id}/parent (API-SPEC-006 §3.4). `parent_id: null` deja la unidad como superior (Q-6)."""

    model_config = ConfigDict(extra="forbid")

    parent_id: Optional[UUID] = Field(...)
    from_date: date


class ReactivateRequest(BaseModel):
    """POST /organizations/{id}/reactivate (API-SPEC-006 §3.6). Sin `parent_id` conserva el padre con el que se desactivó."""

    model_config = ConfigDict(extra="forbid")

    from_date: date
    parent_id: Optional[UUID] = None


class ParentRef(BaseModel):
    id: str
    name: str


class RelationshipOut(BaseModel):
    """Un periodo de la relación de estructura de una unidad (API-SPEC-006 §3.7, SCR-029-04)."""

    previous_parent: Optional[ParentRef] = None
    new_parent: Optional[ParentRef] = None
    from_date: date
    thru_date: Optional[date] = None
    changed_by: str


class InternalOrganizationOut(BaseModel):
    """API-SPEC-007 §2: la organización interna vigente (registro único, BR-PTY-28)."""

    id: str
    name: str
    ruc: Optional[str] = None
    ruc_country: Optional[str] = None
    from_date: date
    thru_date: Optional[date] = None


class InternalOrganizationEnvelope(BaseModel):
    data: InternalOrganizationOut
