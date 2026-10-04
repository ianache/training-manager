"""
Modelo ORM del catálogo (LDM-002). El esquema real lo crea Alembic desde el DDL de LDM-002;
estas clases solo lo mapean. Las reglas entre filas (CHK-A..CHK-D) las aplica el servicio.
"""
from datetime import datetime

from sqlalchemy import Boolean, CHAR, DateTime, ForeignKey, Integer, SmallInteger, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Competency(Base):
    __tablename__ = "tb_competency"

    id: Mapped[str] = mapped_column("pk_competency_id", CHAR(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    description: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(8), default="ACTIVE")
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[str] = mapped_column(String(100))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_by: Mapped[str | None] = mapped_column(String(100))

    versions: Mapped[list["CompetencyVersion"]] = relationship(back_populates="competency", order_by="CompetencyVersion.version_number")


class CompetencyVersion(Base):
    __tablename__ = "tb_competency_version"

    id: Mapped[str] = mapped_column("pk_competency_version_id", CHAR(36), primary_key=True)
    competency_id: Mapped[str] = mapped_column("fk_competency_id", CHAR(36), ForeignKey("tb_competency.pk_competency_id"))
    version_number: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(12), default="DRAFT")
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    approved_by: Mapped[str | None] = mapped_column(String(100))
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[str] = mapped_column(String(100))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_by: Mapped[str | None] = mapped_column(String(100))

    competency: Mapped[Competency] = relationship(back_populates="versions")
    rubric: Mapped[list["RubricLevel"]] = relationship(back_populates="version", order_by="RubricLevel.level_code")
    requirements: Mapped[list["EvidenceRequirement"]] = relationship(back_populates="version")


class RubricLevel(Base):
    __tablename__ = "tb_competency_rubric_level"

    competency_version_id: Mapped[str] = mapped_column(
        "fk_competency_version_id", CHAR(36), ForeignKey("tb_competency_version.pk_competency_version_id"), primary_key=True
    )
    level_code: Mapped[str] = mapped_column(String(2), primary_key=True)
    behavior_description: Mapped[str] = mapped_column(String(1000))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[str] = mapped_column(String(100))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_by: Mapped[str | None] = mapped_column(String(100))

    version: Mapped[CompetencyVersion] = relationship(back_populates="rubric")


class EvidenceRequirement(Base):
    __tablename__ = "tb_evidence_requirement"

    id: Mapped[str] = mapped_column("pk_evidence_requirement_id", CHAR(36), primary_key=True)
    competency_version_id: Mapped[str] = mapped_column(
        "fk_competency_version_id", CHAR(36), ForeignKey("tb_competency_version.pk_competency_version_id")
    )
    level_code: Mapped[str] = mapped_column(String(2))
    category: Mapped[str] = mapped_column(String(20))
    description: Mapped[str] = mapped_column(String(300))
    is_required: Mapped[bool] = mapped_column(Boolean)
    course_ref: Mapped[str | None] = mapped_column(CHAR(36))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[str] = mapped_column(String(100))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_by: Mapped[str | None] = mapped_column(String(100))

    version: Mapped[CompetencyVersion] = relationship(back_populates="requirements")


class Role(Base):
    __tablename__ = "tb_role"

    id: Mapped[str] = mapped_column("pk_role_id", CHAR(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    description: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(8), default="ACTIVE")
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[str] = mapped_column(String(100))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_by: Mapped[str | None] = mapped_column(String(100))

    levels: Mapped[list["RoleLevel"]] = relationship(back_populates="role", order_by="RoleLevel.ordinal")


class RoleLevel(Base):
    __tablename__ = "tb_role_level"

    id: Mapped[str] = mapped_column("pk_role_level_id", CHAR(36), primary_key=True)
    role_id: Mapped[str] = mapped_column("fk_role_id", CHAR(36), ForeignKey("tb_role.pk_role_id"))
    name: Mapped[str] = mapped_column(String(80))
    ordinal: Mapped[int] = mapped_column(SmallInteger)
    status: Mapped[str] = mapped_column(String(8), default="ACTIVE")
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[str] = mapped_column(String(100))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_by: Mapped[str | None] = mapped_column(String(100))

    role: Mapped[Role] = relationship(back_populates="levels")
    competencies: Mapped[list["RoleLevelCompetency"]] = relationship(back_populates="level")


class RoleLevelCompetency(Base):
    __tablename__ = "tb_role_level_competency"

    role_level_id: Mapped[str] = mapped_column(
        "fk_role_level_id", CHAR(36), ForeignKey("tb_role_level.pk_role_level_id"), primary_key=True
    )
    competency_id: Mapped[str] = mapped_column("fk_competency_id", CHAR(36), primary_key=True)
    competency_version_id: Mapped[str] = mapped_column("fk_competency_version_id", CHAR(36))
    required_level: Mapped[str] = mapped_column(String(2))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[str] = mapped_column(String(100))

    level: Mapped[RoleLevel] = relationship(back_populates="competencies")
