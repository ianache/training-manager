"""
Mapeo ORM sobre el modelo físico PDM-001 alineado a STD-DB-001 (Q-11).

El esquema lo crea Alembic (migrations/), no este módulo: estas clases solo declaran las
tablas y columnas que el servicio usa. Los nombres son los que dejan V003/V004
(prefijos tb_, pk_, fk_). Los identificadores son CHAR(36) con GUID en texto.

Tablas que usa la API de partes:
    tb_party ─┬─ tb_person                      (nombres, código de colaborador, anonimización)
              ├─ tb_party_role                  (EMPLOYEE / CONTRACTOR con vigencia)
              ├─ tb_party_identification        (DNI / CE / PASSPORT + país)
              └─ tb_party_contact_mechanism ── tb_contact_mechanism
                                                (WORK_EMAIL → EMAIL, WORK_PHONE → PHONE)

Las demás tablas de PDM-001 (organización, relaciones, rol-nivel, identidad de acceso,
anonimización) existen en la base, pero este servicio todavía no las usa.
"""
from __future__ import annotations

from datetime import date, datetime, timezone

from sqlalchemy import CHAR, Date, DateTime, ForeignKey, ForeignKeyConstraint, Index, String, func, text
from sqlalchemy.orm import Mapped, foreign, mapped_column, relationship

from app.models.base import Base

PERSON = "PERSON"

# Catálogos (los llena la migración 0001 con los datos semilla de PDM-001)
ROLE_EMPLOYEE = "EMPLOYEE"
ROLE_CONTRACTOR = "CONTRACTOR"
WORKFORCE_ROLES = (ROLE_EMPLOYEE, ROLE_CONTRACTOR)
MECH_EMAIL = "EMAIL"
MECH_PHONE = "PHONE"
PURPOSE_WORK_EMAIL = "WORK_EMAIL"
PURPOSE_WORK_PHONE = "WORK_PHONE"


def _utcnow() -> datetime:
    # En la base hay DEFAULT (now() AT TIME ZONE 'UTC'); el ORM pone el mismo valor desde
    # Python para que las pruebas con SQLite funcionen igual.
    return datetime.now(timezone.utc).replace(tzinfo=None)


class PartyRoleType(Base):
    __tablename__ = "tb_party_role_type"
    pk_code: Mapped[str] = mapped_column(String(40), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    applies_to_kind: Mapped[str] = mapped_column(String(12))


class IdentificationType(Base):
    __tablename__ = "tb_identification_type"
    pk_code: Mapped[str] = mapped_column(String(40), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    applies_to_kind: Mapped[str] = mapped_column(String(12))


class ContactMechanismType(Base):
    __tablename__ = "tb_contact_mechanism_type"
    pk_code: Mapped[str] = mapped_column(String(40), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))


class ContactPurposeType(Base):
    __tablename__ = "tb_contact_purpose_type"
    pk_code: Mapped[str] = mapped_column(String(40), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    fk_contact_mechanism_type_code: Mapped[str] = mapped_column(
        String(40), ForeignKey("tb_contact_mechanism_type.pk_code")
    )


class Party(Base):
    __tablename__ = "tb_party"

    pk_party_id: Mapped[str] = mapped_column(CHAR(36), primary_key=True)
    party_kind: Mapped[str] = mapped_column(String(12))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    created_by: Mapped[str] = mapped_column(String(36))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime)
    updated_by: Mapped[str | None] = mapped_column(String(36))


class Person(Base):
    __tablename__ = "tb_person"

    pk_party_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("tb_party.pk_party_id"), primary_key=True)
    party_kind: Mapped[str] = mapped_column(String(12), default=PERSON)
    employee_code: Mapped[str] = mapped_column(CHAR(36), unique=True)
    given_names: Mapped[str | None] = mapped_column(String(100))
    family_names: Mapped[str | None] = mapped_column(String(100))
    preferred_name: Mapped[str | None] = mapped_column(String(100))
    anonymized_at: Mapped[datetime | None] = mapped_column(DateTime)
    anonymized_by: Mapped[str | None] = mapped_column(String(36))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    created_by: Mapped[str] = mapped_column(String(36))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime)
    updated_by: Mapped[str | None] = mapped_column(String(36))

    roles: Mapped[list[PartyRole]] = relationship(
        primaryjoin=lambda: Person.pk_party_id == foreign(PartyRole.fk_party_id),
        lazy="raise",
        viewonly=True,
        order_by=lambda: (PartyRole.from_date.desc(), PartyRole.created_at.desc()),
    )
    identifications: Mapped[list[PartyIdentification]] = relationship(
        primaryjoin=lambda: Person.pk_party_id == foreign(PartyIdentification.fk_party_id),
        lazy="raise",
        viewonly=True,
    )
    contact_links: Mapped[list[PartyContactMechanism]] = relationship(
        primaryjoin=lambda: Person.pk_party_id == foreign(PartyContactMechanism.fk_party_id),
        lazy="raise",
        viewonly=True,
    )


class PartyRole(Base):
    __tablename__ = "tb_party_role"

    pk_party_role_id: Mapped[str] = mapped_column(CHAR(36), primary_key=True)
    fk_party_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("tb_party.pk_party_id"))
    party_kind: Mapped[str] = mapped_column(String(12))
    fk_party_role_type_code: Mapped[str] = mapped_column(String(40), ForeignKey("tb_party_role_type.pk_code"))
    from_date: Mapped[date] = mapped_column(Date)
    thru_date: Mapped[date | None] = mapped_column(Date)
    thru_recorded_at: Mapped[datetime | None] = mapped_column(DateTime)
    thru_recorded_by: Mapped[str | None] = mapped_column(String(36))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    created_by: Mapped[str] = mapped_column(String(36))

    __table_args__ = (
        Index("idx_party_role_fk_party_id_fk_party_role_type_code", "fk_party_id", "fk_party_role_type_code"),
    )


class PartyIdentification(Base):
    __tablename__ = "tb_party_identification"

    pk_party_identification_id: Mapped[str] = mapped_column(CHAR(36), primary_key=True)
    fk_party_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("tb_party.pk_party_id"))
    party_kind: Mapped[str] = mapped_column(String(12))
    fk_identification_type_code: Mapped[str] = mapped_column(String(40), ForeignKey("tb_identification_type.pk_code"))
    identification_number: Mapped[str | None] = mapped_column(String(20))
    issuing_country_code: Mapped[str] = mapped_column(CHAR(2))
    anonymized_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    created_by: Mapped[str] = mapped_column(String(36))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime)
    updated_by: Mapped[str | None] = mapped_column(String(36))

    __table_args__ = (
        # BR-PTY-07 + BR-PTY-14 (índice parcial de PDM-001; también en SQLite para las pruebas)
        Index(
            "idx_party_identification_active_number",
            "fk_identification_type_code",
            "identification_number",
            "issuing_country_code",
            unique=True,
            postgresql_where=text("anonymized_at IS NULL"),
            sqlite_where=text("anonymized_at IS NULL"),
        ),
    )


class ContactMechanism(Base):
    __tablename__ = "tb_contact_mechanism"

    pk_contact_mechanism_id: Mapped[str] = mapped_column(CHAR(36), primary_key=True)
    fk_contact_mechanism_type_code: Mapped[str] = mapped_column(
        String(40), ForeignKey("tb_contact_mechanism_type.pk_code")
    )
    contact_value: Mapped[str | None] = mapped_column(String(500))
    anonymized_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    created_by: Mapped[str] = mapped_column(String(36))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime)
    updated_by: Mapped[str | None] = mapped_column(String(36))

    __table_args__ = (
        # DM-05: una dirección de correo es un único medio, sin distinguir mayúsculas
        Index(
            "idx_contact_mechanism_email_active",
            func.lower(text("contact_value")),
            unique=True,
            postgresql_where=text("fk_contact_mechanism_type_code = 'EMAIL' AND anonymized_at IS NULL"),
            sqlite_where=text("fk_contact_mechanism_type_code = 'EMAIL' AND anonymized_at IS NULL"),
        ),
    )


class PartyContactMechanism(Base):
    __tablename__ = "tb_party_contact_mechanism"

    pk_party_contact_mechanism_id: Mapped[str] = mapped_column(CHAR(36), primary_key=True)
    fk_party_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("tb_party.pk_party_id"))
    fk_contact_mechanism_id: Mapped[str] = mapped_column(CHAR(36))
    fk_contact_mechanism_type_code: Mapped[str] = mapped_column(String(40))
    fk_contact_purpose_type_code: Mapped[str] = mapped_column(String(40))
    fk_profile_platform_code: Mapped[str | None] = mapped_column(String(40))
    from_date: Mapped[date] = mapped_column(Date)
    thru_date: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    created_by: Mapped[str] = mapped_column(String(36))

    mechanism: Mapped[ContactMechanism] = relationship(
        primaryjoin=lambda: foreign(PartyContactMechanism.fk_contact_mechanism_id)
        == ContactMechanism.pk_contact_mechanism_id,
        lazy="raise",
        viewonly=True,
    )

    __table_args__ = (
        ForeignKeyConstraint(
            ["fk_contact_mechanism_id"],
            ["tb_contact_mechanism.pk_contact_mechanism_id"],
        ),
        # BR-PTY-08: un correo laboral vigente pertenece a una sola parte
        Index(
            "idx_party_contact_mechanism_current_work_email",
            "fk_contact_mechanism_id",
            unique=True,
            postgresql_where=text("fk_contact_purpose_type_code = 'WORK_EMAIL' AND thru_date IS NULL"),
            sqlite_where=text("fk_contact_purpose_type_code = 'WORK_EMAIL' AND thru_date IS NULL"),
        ),
    )
