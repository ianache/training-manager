"""
Contratos de API-SPEC-001 §3.1 (PARTY) y §4.1 (paginación).

Se persiste en el modelo físico PDM-001 (ver app/services/party_service.py para el mapeo).
`unit_id`, `direct_manager_id`, `role_assignments` y `program_roles` todavía no se exponen y
se devuelven vacíos (ver README, "Brechas").
"""
from datetime import datetime
from enum import Enum
from typing import Generic, Literal, Optional, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

T = TypeVar("T")


class PartyType(str, Enum):
    EMPLOYEE = "Employee"
    CONTRACTOR = "Contractor"


class IdentificationType(str, Enum):
    DNI = "DNI"
    CE = "CE"
    PASSPORT = "Passport"


PartyStatus = Literal["active", "inactive", "anonymized"]


# ---------- Entrada ----------


class PartyCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    first_names: str = Field(..., min_length=1, max_length=100)
    last_names: str = Field(..., min_length=1, max_length=100)
    preferred_name: Optional[str] = Field(None, max_length=100)

    identification_type: IdentificationType
    identification_number: str = Field(
        ..., min_length=5, max_length=20, pattern=r"^[A-Za-z0-9-]+$"  # VARCHAR(20) en PDM-001
    )
    identification_country: str = Field(..., min_length=2, max_length=2, pattern=r"^[A-Z]{2}$")

    email_work: EmailStr
    phone_work: Optional[str] = Field(None, max_length=20, pattern=r"^\+?[0-9 ()-]{6,20}$")

    party_type: PartyType


class PartyUpdateRequest(BaseModel):
    """US-016: solo campos de contacto y nombre preferido (sin sobrescribir identidad)."""

    model_config = ConfigDict(extra="forbid")

    preferred_name: Optional[str] = Field(None, max_length=100)
    phone_work: Optional[str] = Field(None, max_length=20, pattern=r"^\+?[0-9 ()-]{6,20}$")


# ---------- Salida ----------


class Identification(BaseModel):
    type: Optional[str]
    number: Optional[str]
    country: Optional[str]


class ContactLimited(BaseModel):
    email_work: Optional[str]


class Contact(ContactLimited):
    phone_work: Optional[str]


class PartySummary(BaseModel):
    """Vista limitada (otros colaboradores): nombre, correo laboral, unidad, rol y estado."""

    id: UUID
    code: str
    first_names: Optional[str]
    last_names: Optional[str]
    preferred_name: Optional[str]
    contact: ContactLimited
    role: str
    unit_id: Optional[UUID] = None
    status: str


class PartyDetail(PartySummary):
    """Vista completa (Jefe de Ingeniería, ADMIN)."""

    identification: Identification
    contact: Contact
    direct_manager_id: Optional[UUID] = None
    created_by: str
    created_at: datetime
    updated_by: Optional[str]
    updated_at: Optional[datetime]
    role_assignments: list[dict] = []
    program_roles: list[dict] = []


class Pagination(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int
    has_next: bool
    has_prev: bool


class Page(BaseModel, Generic[T]):
    data: list[T]
    pagination: Pagination
    filters_applied: dict[str, str] = {}
