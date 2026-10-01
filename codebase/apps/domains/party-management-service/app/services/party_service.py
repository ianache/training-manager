"""
Reglas de negocio de Party sobre el modelo físico PDM-001 (Q-11).

La API (API-SPEC-001 §3.1) sigue exponiendo una "parte" plana. Este módulo la arma a
partir de las tablas normalizadas y la descompone al escribir:

    API                     PDM-001 (alineado a STD-DB-001)
    ─────────────────────   ───────────────────────────────────────────────────────────
    id                      tb_party.pk_party_id
    code                    tb_person.employee_code (GUID, BR-PTY-06 / D25)
    first_names/last_names  tb_person.given_names / family_names
    preferred_name          tb_person.preferred_name
    identification.*        tb_party_identification vigente (sin anonimizar)
    contact.email_work      tb_contact_mechanism EMAIL ligado como WORK_EMAIL vigente
    contact.phone_work      tb_contact_mechanism PHONE ligado como WORK_PHONE vigente
    role                    último tb_party_role EMPLOYEE / CONTRACTOR
    status                  anonymized si tb_person.anonymized_at; active si hay un rol
                            EMPLOYEE/CONTRACTOR vigente; si no, inactive
    created_*/updated_*     tb_person
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timezone
from math import ceil
from uuid import UUID, uuid4

from sqlalchemy import case, exists, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.errors import ApiError, not_found
from app.core.logging import logger
from app.models.party import (
    MECH_EMAIL,
    MECH_PHONE,
    PERSON,
    PURPOSE_WORK_EMAIL,
    PURPOSE_WORK_PHONE,
    ROLE_CONTRACTOR,
    ROLE_EMPLOYEE,
    WORKFORCE_ROLES,
    ContactMechanism,
    Party,
    PartyContactMechanism,
    PartyIdentification,
    PartyRole,
    Person,
)
from app.schemas.party import PartyCreateRequest, PartyUpdateRequest

# Traducción entre los valores de la API y los códigos de catálogo de PDM-001
ROLE_TO_DB = {"Employee": ROLE_EMPLOYEE, "Contractor": ROLE_CONTRACTOR}
ROLE_FROM_DB = {v: k for k, v in ROLE_TO_DB.items()}
ID_TYPE_TO_DB = {"DNI": "DNI", "CE": "CE", "Passport": "PASSPORT"}
ID_TYPE_FROM_DB = {v: k for k, v in ID_TYPE_TO_DB.items()}

AUDIT_MAX = 36  # created_by / updated_by son VARCHAR(36) en PDM-001


def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _today() -> date:
    return datetime.now(timezone.utc).date()


def _guid() -> str:
    return str(uuid4())


def _audit(actor: str) -> str:
    return actor[:AUDIT_MAX]


# ---------------------------------------------------------------------------
# Vista de lectura
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class PartyView:
    id: str
    code: str
    first_names: str | None
    last_names: str | None
    preferred_name: str | None
    email_work: str | None
    phone_work: str | None
    role: str | None
    status: str
    identification_type: str | None
    identification_number: str | None
    identification_country: str | None
    created_by: str
    created_at: datetime
    updated_by: str | None
    updated_at: datetime | None


def _current_contact(person: Person, purpose: str) -> str | None:
    links = [
        link for link in person.contact_links if link.fk_contact_purpose_type_code == purpose and link.thru_date is None
    ]
    links.sort(key=lambda link: (link.from_date, link.created_at or datetime.min), reverse=True)
    return links[0].mechanism.contact_value if links else None


def _is_active_role(role: PartyRole, today: date) -> bool:
    return role.fk_party_role_type_code in WORKFORCE_ROLES and (role.thru_date is None or role.thru_date > today)


def to_view(person: Person) -> PartyView:
    today = _today()
    workforce = [r for r in person.roles if r.fk_party_role_type_code in WORKFORCE_ROLES]  # ya vienen ordenados
    if person.anonymized_at is not None:
        status = "anonymized"
    elif any(_is_active_role(r, today) for r in workforce):
        status = "active"
    else:
        status = "inactive"
    ident = next((i for i in person.identifications if i.anonymized_at is None), None)
    return PartyView(
        id=person.pk_party_id,
        code=person.employee_code,
        first_names=person.given_names,
        last_names=person.family_names,
        preferred_name=person.preferred_name,
        email_work=_current_contact(person, PURPOSE_WORK_EMAIL),
        phone_work=_current_contact(person, PURPOSE_WORK_PHONE),
        role=ROLE_FROM_DB.get(workforce[0].fk_party_role_type_code) if workforce else None,
        status=status,
        identification_type=ID_TYPE_FROM_DB.get(ident.fk_identification_type_code, ident.fk_identification_type_code)
        if ident
        else None,
        identification_number=ident.identification_number if ident else None,
        identification_country=ident.issuing_country_code if ident else None,
        created_by=person.created_by,
        created_at=person.created_at,
        updated_by=person.updated_by,
        updated_at=person.updated_at,
    )


def _with_children():
    return (
        selectinload(Person.roles),
        selectinload(Person.identifications),
        selectinload(Person.contact_links).selectinload(PartyContactMechanism.mechanism),
    )


# ---------------------------------------------------------------------------
# Expresiones SQL equivalentes a to_view (para filtrar y buscar en la base)
# ---------------------------------------------------------------------------


def _current_contact_expr(purpose: str):
    return (
        select(ContactMechanism.contact_value)
        .join(
            PartyContactMechanism,
            PartyContactMechanism.fk_contact_mechanism_id == ContactMechanism.pk_contact_mechanism_id,
        )
        .where(
            PartyContactMechanism.fk_party_id == Person.pk_party_id,
            PartyContactMechanism.fk_contact_purpose_type_code == purpose,
            PartyContactMechanism.thru_date.is_(None),
        )
        .order_by(PartyContactMechanism.from_date.desc(), PartyContactMechanism.created_at.desc())
        .limit(1)
        .correlate(Person)
        .scalar_subquery()
    )


def _role_expr():
    return (
        select(PartyRole.fk_party_role_type_code)
        .where(PartyRole.fk_party_id == Person.pk_party_id, PartyRole.fk_party_role_type_code.in_(WORKFORCE_ROLES))
        .order_by(PartyRole.from_date.desc(), PartyRole.created_at.desc())
        .limit(1)
        .correlate(Person)
        .scalar_subquery()
    )


def _status_expr(today: date):
    active = exists().where(
        PartyRole.fk_party_id == Person.pk_party_id,
        PartyRole.fk_party_role_type_code.in_(WORKFORCE_ROLES),
        or_(PartyRole.thru_date.is_(None), PartyRole.thru_date > today),
    )
    return case((Person.anonymized_at.is_not(None), "anonymized"), (active, "active"), else_="inactive")


SORTABLE = {"created_at": Person.created_at, "code": Person.employee_code, "last_names": Person.family_names}


# ---------------------------------------------------------------------------
# Servicio
# ---------------------------------------------------------------------------


class PartyService:
    """La auditoría usa el usuario final recibido del BFF (X-User-Name), no la cuenta del BFF."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def _load(self, party_id: str) -> Person | None:
        return await self.db.scalar(select(Person).options(*_with_children()).where(Person.pk_party_id == party_id))

    async def get(self, party_id: UUID | str) -> PartyView:
        person = await self._load(str(party_id))
        if person is None:
            raise not_found()
        return to_view(person)

    # ---- alta (US-015) ----

    async def _email_mechanism(self, email: str) -> str | None:
        return await self.db.scalar(
            select(ContactMechanism.pk_contact_mechanism_id).where(
                ContactMechanism.fk_contact_mechanism_type_code == MECH_EMAIL,
                ContactMechanism.anonymized_at.is_(None),
                func.lower(ContactMechanism.contact_value) == email.lower(),
            )
        )

    async def _email_taken(self, mechanism_id: str | None) -> bool:
        if mechanism_id is None:
            return False
        return bool(
            await self.db.scalar(
                select(PartyContactMechanism.pk_party_contact_mechanism_id).where(
                    PartyContactMechanism.fk_contact_mechanism_id == mechanism_id,
                    PartyContactMechanism.fk_contact_purpose_type_code == PURPOSE_WORK_EMAIL,
                    PartyContactMechanism.thru_date.is_(None),
                )
            )
        )

    def _link(self, party_id: str, mechanism_id: str, mech_type: str, purpose: str, actor: str, today: date):
        self.db.add(
            PartyContactMechanism(
                pk_party_contact_mechanism_id=_guid(),
                fk_party_id=party_id,
                fk_contact_mechanism_id=mechanism_id,
                fk_contact_mechanism_type_code=mech_type,
                fk_contact_purpose_type_code=purpose,
                from_date=today,
                created_by=actor,
                created_at=_utcnow(),
            )
        )

    def _new_mechanism(self, mech_type: str, value: str, actor: str) -> str:
        mechanism_id = _guid()
        self.db.add(
            ContactMechanism(
                pk_contact_mechanism_id=mechanism_id,
                fk_contact_mechanism_type_code=mech_type,
                contact_value=value,
                created_by=actor,
                created_at=_utcnow(),
            )
        )
        return mechanism_id

    async def create(self, payload: PartyCreateRequest, actor: str) -> PartyView:
        actor = _audit(actor)
        email = str(payload.email_work)
        id_type = ID_TYPE_TO_DB[payload.identification_type.value]

        email_mechanism = await self._email_mechanism(email)
        if await self._email_taken(email_mechanism):
            logger.warning("duplicate_email_attempt", actor=actor)
            raise _duplicate_email()

        id_taken = await self.db.scalar(
            select(PartyIdentification.pk_party_identification_id).where(
                PartyIdentification.fk_identification_type_code == id_type,
                PartyIdentification.identification_number == payload.identification_number,
                PartyIdentification.issuing_country_code == payload.identification_country,
                PartyIdentification.anonymized_at.is_(None),
            )
        )
        if id_taken:
            raise _duplicate_identification()

        now, today, party_id = _utcnow(), _today(), _guid()
        self.db.add(Party(pk_party_id=party_id, party_kind=PERSON, created_by=actor, created_at=now))
        await self.db.flush()  # tb_party primero: las demás tablas la referencian
        self.db.add(
            Person(
                pk_party_id=party_id,
                party_kind=PERSON,
                employee_code=_guid(),
                given_names=payload.first_names,
                family_names=payload.last_names,
                preferred_name=payload.preferred_name,
                created_by=actor,
                created_at=now,
            )
        )
        self.db.add(
            PartyRole(
                pk_party_role_id=_guid(),
                fk_party_id=party_id,
                party_kind=PERSON,
                fk_party_role_type_code=ROLE_TO_DB[payload.party_type.value],
                from_date=today,
                created_by=actor,
                created_at=now,
            )
        )
        self.db.add(
            PartyIdentification(
                pk_party_identification_id=_guid(),
                fk_party_id=party_id,
                party_kind=PERSON,
                fk_identification_type_code=id_type,
                identification_number=payload.identification_number,
                issuing_country_code=payload.identification_country,
                created_by=actor,
                created_at=now,
            )
        )
        # DM-05: un correo es un único medio; si ya existe sin dueño vigente, se reutiliza
        email_mechanism = email_mechanism or self._new_mechanism(MECH_EMAIL, email, actor)
        await self.db.flush()
        self._link(party_id, email_mechanism, MECH_EMAIL, PURPOSE_WORK_EMAIL, actor, today)
        if payload.phone_work:
            phone_mechanism = self._new_mechanism(MECH_PHONE, payload.phone_work, actor)
            await self.db.flush()
            self._link(party_id, phone_mechanism, MECH_PHONE, PURPOSE_WORK_PHONE, actor, today)

        await self._commit()
        logger.info("party_created", party_id=party_id, created_by=actor)
        return await self.get(party_id)

    # ---- lista (US-023) ----

    async def list(
        self,
        page: int,
        limit: int,
        sort: str,
        status: str | None,
        role: str | None,
        search: str | None,
    ) -> tuple[list[PartyView], int, dict[str, str]]:
        filters, applied = [], {}
        status_expr = _status_expr(_today())
        if status:
            filters.append(status_expr == status)
            applied["status"] = status
        else:
            filters.append(Person.anonymized_at.is_(None))
        if role:
            filters.append(_role_expr() == ROLE_TO_DB[role])
            applied["role"] = role
        if search:
            term = f"%{search.strip().lower()}%"
            filters.append(
                or_(
                    func.lower(Person.given_names).like(term),
                    func.lower(Person.family_names).like(term),
                    func.lower(Person.preferred_name).like(term),
                    func.lower(_current_contact_expr(PURPOSE_WORK_EMAIL)).like(term),
                    func.lower(Person.employee_code).like(term),
                )
            )
            applied["search"] = search

        field, _, direction = sort.partition(":")
        column = SORTABLE.get(field)
        if column is None or direction not in ("asc", "desc", ""):
            raise ApiError(
                400, "VALIDATION_ERROR", "Orden no soportado.", {"field": "sort", "allowed": sorted(SORTABLE)}
            )
        order = column.asc() if direction == "asc" else column.desc()

        total = await self.db.scalar(select(func.count()).select_from(Person).where(*filters)) or 0
        rows = await self.db.scalars(
            select(Person)
            .options(*_with_children())
            .where(*filters)
            .order_by(order, Person.pk_party_id)
            .offset((page - 1) * limit)
            .limit(limit)
        )
        return [to_view(p) for p in rows.all()], total, applied

    # ---- actualización (US-016) ----

    async def update(self, party_id: UUID, payload: PartyUpdateRequest, actor: str) -> PartyView:
        actor = _audit(actor)
        person = await self._load(str(party_id))
        if person is None:
            raise not_found()
        changes = payload.model_dump(exclude_unset=True)
        now, today = _utcnow(), _today()

        if "preferred_name" in changes:
            person.preferred_name = changes["preferred_name"]
        if "phone_work" in changes:
            new_phone = changes["phone_work"]
            if new_phone != _current_contact(person, PURPOSE_WORK_PHONE):
                # BR-PTY-09: el medio anterior se cierra con vigencia; no se sobrescribe
                for link in person.contact_links:
                    if link.fk_contact_purpose_type_code == PURPOSE_WORK_PHONE and link.thru_date is None:
                        await self.db.execute(
                            PartyContactMechanism.__table__.update()
                            .where(
                                PartyContactMechanism.pk_party_contact_mechanism_id
                                == link.pk_party_contact_mechanism_id
                            )
                            .values(thru_date=today)
                        )
                if new_phone:
                    mechanism_id = self._new_mechanism(MECH_PHONE, new_phone, actor)
                    await self.db.flush()
                    self._link(person.pk_party_id, mechanism_id, MECH_PHONE, PURPOSE_WORK_PHONE, actor, today)

        person.updated_by = actor
        person.updated_at = now
        await self._commit()
        logger.info("party_updated", party_id=person.pk_party_id, updated_by=actor, fields=sorted(changes))
        self.db.expunge_all()  # releer con los vínculos nuevos
        return await self.get(person.pk_party_id)

    async def _commit(self) -> None:
        try:
            await self.db.commit()
        except IntegrityError as exc:
            # Carrera entre dos altas: los índices únicos parciales de PDM-001 tienen la última palabra
            await self.db.rollback()
            message = str(exc.orig).lower()
            if "email" in message:
                raise _duplicate_email() from exc
            if "identification" in message:
                raise _duplicate_identification() from exc
            raise


def _duplicate_email() -> ApiError:
    return ApiError(409, "EMAIL_DUPLICATE", "El correo laboral ya está registrado.", {"field": "email_work"})


def _duplicate_identification() -> ApiError:
    return ApiError(
        409, "IDENTIFICATION_DUPLICATE", "La identificación ya está registrada.", {"field": "identification"}
    )


def total_pages(total: int, limit: int) -> int:
    return max(1, ceil(total / limit)) if total else 0
