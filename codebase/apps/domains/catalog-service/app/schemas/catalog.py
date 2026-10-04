"""Esquemas de entrada y salida del catálogo (API-SPEC-003). Entrada estricta: extra=forbid."""
from datetime import datetime
from enum import Enum
from typing import Generic, Optional, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

T = TypeVar("T")
LevelCode = str  # L1..L4 (BR-CAT-02)


class Status(str, Enum):
    active = "ACTIVE"
    inactive = "INACTIVE"


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


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


# ---------------------------------------------------------------- entrada


class LevelCompetencyIn(Strict):
    competency_id: UUID
    version_id: UUID
    required_level: str = Field(pattern=r"^L[1-4]$")


class RoleLevelIn(Strict):
    id: Optional[UUID] = None
    """Presente al editar un nivel existente (renombrar o cambiar sus competencias). Ausente: nivel nuevo."""
    name: str = Field(min_length=1, max_length=80)
    ordinal: int = Field(ge=1, le=32767)
    competencies: list[LevelCompetencyIn] = Field(min_length=1)  # CHK-A


class RoleIn(Strict):
    name: str = Field(min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=500)
    levels: list[RoleLevelIn] = Field(min_length=1)  # CHK-A

    @field_validator("name")
    @classmethod
    def _name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío.")
        return v


# ---------------------------------------------------------------- salida


class LevelSummaryOut(BaseModel):
    id: str
    name: str
    ordinal: int
    status: str
    usable: bool
    evidence_requirements: int


class RoleSummaryOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    status: str
    competency_count: int
    row_version: int
    levels: list[LevelSummaryOut]


class VersionRefOut(BaseModel):
    id: str
    version_number: int
    status: str


class LevelCompetencyOut(BaseModel):
    competency_id: str
    name: str
    required_level: str
    version: VersionRefOut
    is_current: bool
    suggested_version_id: Optional[str] = None


class LevelDetailOut(LevelSummaryOut):
    competencies: list[LevelCompetencyOut]


class RoleDetailOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    status: str
    row_version: int
    created_at: datetime
    created_by: str
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None
    levels: list[LevelDetailOut]


class RubricLevelOut(BaseModel):
    level: str
    behavior_description: str


class EvidenceRequirementOut(BaseModel):
    id: str
    level: str
    category: str
    description: str
    is_required: bool
    course_ref: Optional[str] = None


class VersionOut(BaseModel):
    id: str
    version_number: int
    status: str
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    rubric: list[RubricLevelOut]
    evidence_requirements: list[EvidenceRequirementOut]


class CompetencySummaryOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    status: str
    current_version: Optional[VersionRefOut] = None
    levels_with_requirements: int = 0
    """Niveles L1 a L4 con al menos un requisito de evidencia en la versión vigente (SCR-001-01: «2 de 4»)."""
    row_version: int


class CompetencyDetailOut(CompetencySummaryOut):
    versions: list[VersionOut]
