"""Consulta de organizaciones (unidades y proveedores) — API-SPEC-002."""
from datetime import date
from uuid import UUID, uuid4

from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.core.errors import ApiError, not_found
from app.models.party import (
    ID_RUC,
    MECH_EMAIL,
    MECH_PHONE,
    ORGANIZATION,
    ORG_ROLES,
    PURPOSE_ORG_EMAIL,
    PURPOSE_ORG_PHONE,
    REL_ORG_STRUCTURE,
    ROLE_SUPPLIER,
    ROLE_UNIT,
    ContactMechanism,
    Organization,
    Party,
    PartyContactMechanism,
    PartyIdentification,
    PartyRelationship,
    PartyRole,
)
from app.schemas.organization import OrganizationContact, OrganizationOut, OrganizationStatus, OrganizationType
from app.services.party_service import total_pages  # noqa: F401  (se reexporta para el router)

SORTS = {"name": Organization.organization_name, "created_at": Organization.created_at}
ROLE_OF = {OrganizationType.internal_unit: ROLE_UNIT, OrganizationType.external_provider: ROLE_SUPPLIER}
TYPE_OF = {v: k for k, v in ROLE_OF.items()}


def _like(term: str) -> str:
    """Patrón LIKE con %, _ y \\ literales (escape="\\")."""
    return "%" + term.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"


def _active(today: date):
    return or_(PartyRole.thru_date.is_(None), PartyRole.thru_date >= today)


class OrganizationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _base(self):
        return (
            select(Organization, PartyRole)
            .join(PartyRole, PartyRole.fk_party_id == Organization.pk_party_id)
            .where(PartyRole.fk_party_role_type_code.in_(ORG_ROLES))
        )

    async def _build(self, rows) -> list[OrganizationOut]:
        today = date.today()
        role_ids = [r.pk_party_role_id for _, r in rows]
        party_ids = [o.pk_party_id for o, _ in rows]
        to_role = aliased(PartyRole)
        parents: dict[str, str] = {}
        rucs: dict[str, str] = {}
        contacts: dict[str, OrganizationContact] = {}
        if role_ids:
            parents = dict(
                (
                    await self.db.execute(
                        select(PartyRelationship.fk_party_role_from_id, to_role.fk_party_id)
                        .join(to_role, to_role.pk_party_role_id == PartyRelationship.fk_party_role_to_id)
                        .where(
                            PartyRelationship.fk_party_relationship_type_code == REL_ORG_STRUCTURE,
                            PartyRelationship.thru_date.is_(None),
                            PartyRelationship.fk_party_role_from_id.in_(role_ids),
                        )
                    )
                ).all()
            )
            rucs = dict(
                (
                    await self.db.execute(
                        select(PartyIdentification.fk_party_id, PartyIdentification.identification_number).where(
                            PartyIdentification.fk_identification_type_code == ID_RUC,
                            PartyIdentification.anonymized_at.is_(None),
                            PartyIdentification.fk_party_id.in_(party_ids),
                        )
                    )
                ).all()
            )
            links = (
                await self.db.execute(
                    select(
                        PartyContactMechanism.fk_party_id,
                        PartyContactMechanism.fk_contact_purpose_type_code,
                        ContactMechanism.contact_value,
                    )
                    .join(
                        ContactMechanism,
                        ContactMechanism.pk_contact_mechanism_id == PartyContactMechanism.fk_contact_mechanism_id,
                    )
                    .where(
                        PartyContactMechanism.fk_party_id.in_(party_ids),
                        PartyContactMechanism.fk_contact_purpose_type_code.in_((PURPOSE_ORG_EMAIL, PURPOSE_ORG_PHONE)),
                        PartyContactMechanism.thru_date.is_(None),
                        ContactMechanism.anonymized_at.is_(None),
                    )
                    .order_by(PartyContactMechanism.created_at)
                )
            ).all()
            for party_id, purpose, value in links:
                c = contacts.setdefault(party_id, OrganizationContact())
                (c.emails if purpose == PURPOSE_ORG_EMAIL else c.phones).append(value)
        out = []
        for org, role in rows:
            kind = TYPE_OF[role.fk_party_role_type_code]
            unit = kind == OrganizationType.internal_unit
            is_active = role.thru_date is None or role.thru_date >= today
            out.append(
                OrganizationOut(
                    id=org.pk_party_id,
                    name=org.organization_name,
                    type=kind,
                    parent_id=parents.get(role.pk_party_role_id),
                    status=OrganizationStatus.active if is_active else OrganizationStatus.inactive,
                    code=org.code if unit else None,
                    location=org.location if unit else None,
                    ruc=None if unit else rucs.get(org.pk_party_id),
                    contact=contacts.get(org.pk_party_id, OrganizationContact()),
                )
            )
        return out

    async def list(self, page, limit, sort, type_, status, search, parent_id):
        field, _, direction = sort.partition(":")
        if field not in SORTS or direction not in ("", "asc", "desc"):
            raise ApiError(400, "VALIDATION_ERROR", "El criterio de orden no es válido.", {"field": "sort"})
        today = date.today()
        q = self._base()
        applied = {"status": status.value}
        q = q.where(_active(today) if status == OrganizationStatus.active else ~_active(today))
        if type_:
            q = q.where(PartyRole.fk_party_role_type_code == ROLE_OF[type_])
            applied["type"] = type_.value
        if search:
            ruc_match = select(PartyIdentification.fk_party_id).where(
                PartyIdentification.fk_identification_type_code == ID_RUC,
                PartyIdentification.identification_number == search,
            )
            q = q.where(
                or_(
                    Organization.organization_name.ilike(_like(search), escape="\\"),
                    Organization.pk_party_id.in_(ruc_match),
                )
            )
            applied["search"] = search
        if parent_id:
            to_role = aliased(PartyRole)
            child_roles = (
                select(PartyRelationship.fk_party_role_from_id)
                .join(to_role, to_role.pk_party_role_id == PartyRelationship.fk_party_role_to_id)
                .where(
                    PartyRelationship.fk_party_relationship_type_code == REL_ORG_STRUCTURE,
                    PartyRelationship.thru_date.is_(None),
                    to_role.fk_party_id == str(parent_id),
                )
            )
            q = q.where(PartyRole.pk_party_role_id.in_(child_roles))
            applied["parent_id"] = str(parent_id)
        total = (await self.db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
        col = SORTS[field]
        q = q.order_by(col.desc() if direction == "desc" else col.asc(), Organization.pk_party_id)
        rows = (await self.db.execute(q.offset((page - 1) * limit).limit(limit))).all()
        return await self._build(rows), total, applied

    async def _same_name_under(self, name: str, type_: OrganizationType, parent_id: str | None) -> bool:
        rows = (
            await self.db.execute(
                self._base().where(
                    PartyRole.fk_party_role_type_code == ROLE_OF[type_],
                    _active(date.today()),
                    func.lower(Organization.organization_name) == name.lower(),
                )
            )
        ).all()
        return any(o.parent_id == parent_id for o in await self._build(rows))

    async def _email_row(self, email: str) -> str | None:
        """Fila de correo ya existente (una por valor: ux_contact_mechanism_email_active)."""
        return await self.db.scalar(
            select(ContactMechanism.pk_contact_mechanism_id).where(
                ContactMechanism.fk_contact_mechanism_type_code == MECH_EMAIL,
                ContactMechanism.anonymized_at.is_(None),
                func.lower(ContactMechanism.contact_value) == email.lower(),
            )
        )

    def _contact(self, party_id: str, mechanism_id: str, mech_type: str, purpose: str, actor: str, today: date) -> None:
        self.db.add(
            PartyContactMechanism(
                pk_party_contact_mechanism_id=str(uuid4()),
                fk_party_id=party_id,
                fk_contact_mechanism_id=mechanism_id,
                fk_contact_mechanism_type_code=mech_type,
                fk_contact_purpose_type_code=purpose,
                from_date=today,
                created_by=actor,
            )
        )

    async def _ruc_taken(self, ruc: str) -> bool:
        row = (
            await self.db.execute(
                select(PartyIdentification.pk_party_identification_id).where(
                    PartyIdentification.fk_identification_type_code == ID_RUC,
                    PartyIdentification.identification_number == ruc,
                    PartyIdentification.anonymized_at.is_(None),
                )
            )
        ).first()
        return row is not None

    async def create(self, payload, actor: str) -> OrganizationOut:
        parent_id = str(payload.parent_id) if payload.parent_id else None
        parent_role = None
        if parent_id:
            row = (
                await self.db.execute(
                    self._base().where(
                        Organization.pk_party_id == parent_id,
                        PartyRole.fk_party_role_type_code == ROLE_UNIT,
                        _active(date.today()),
                    )
                )
            ).first()
            if row is None:
                raise not_found("La unidad padre no existe o no está vigente.")
            parent_role = row[1].pk_party_role_id
        if await self._same_name_under(payload.name, payload.type, parent_id):
            raise _duplicate("name")
        if payload.ruc and await self._ruc_taken(payload.ruc):
            raise _duplicate("ruc")
        email = str(payload.contact.email_work)
        # toda consulta va antes de añadir filas: una consulta con filas pendientes las vuelca (autoflush)
        # y un conflicto de unicidad saltaría fuera del manejo de _commit
        email_row = await self._email_row(email)
        pid, rid, today = str(uuid4()), str(uuid4()), date.today()
        # el modelo no declara relationship() entre tablas: el orden de INSERT lo fijamos nosotros (FK reales en PostgreSQL)
        self.db.add(Party(pk_party_id=pid, party_kind=ORGANIZATION, created_by=actor))
        await self._flush()
        self.db.add(
            Organization(
                pk_party_id=pid, organization_name=payload.name, code=payload.code, location=payload.location, created_by=actor
            )
        )
        self.db.add(
            PartyRole(
                pk_party_role_id=rid,
                fk_party_id=pid,
                party_kind=ORGANIZATION,
                fk_party_role_type_code=ROLE_OF[payload.type],
                from_date=today,
                created_by=actor,
            )
        )
        if payload.ruc:
            self.db.add(
                PartyIdentification(
                    pk_party_identification_id=str(uuid4()),
                    fk_party_id=pid,
                    party_kind=ORGANIZATION,
                    fk_identification_type_code=ID_RUC,
                    identification_number=payload.ruc,
                    issuing_country_code="PE",
                    created_by=actor,
                )
            )
        await self._flush()
        if parent_role:
            self.db.add(
                PartyRelationship(
                    pk_party_relationship_id=str(uuid4()),
                    fk_party_relationship_type_code=REL_ORG_STRUCTURE,
                    fk_party_role_from_id=rid,
                    fk_party_role_to_id=parent_role,
                    from_date=today,
                    created_by=actor,
                )
            )
        if email_row is None:
            email_row = str(uuid4())
            self.db.add(
                ContactMechanism(
                    pk_contact_mechanism_id=email_row, fk_contact_mechanism_type_code=MECH_EMAIL, contact_value=email, created_by=actor
                )
            )
        await self._flush()
        self._contact(pid, email_row, MECH_EMAIL, PURPOSE_ORG_EMAIL, actor, today)
        if payload.contact.phone_work:
            phone_row = str(uuid4())
            self.db.add(
                ContactMechanism(
                    pk_contact_mechanism_id=phone_row,
                    fk_contact_mechanism_type_code=MECH_PHONE,
                    contact_value=payload.contact.phone_work,
                    created_by=actor,
                )
            )
            await self._flush()
            self._contact(pid, phone_row, MECH_PHONE, PURPOSE_ORG_PHONE, actor, today)
        await self._commit()
        self.db.expunge_all()
        return await self.get(pid)

    async def _flush(self) -> None:
        await self._guard(self.db.flush)

    async def _commit(self) -> None:
        await self._guard(self.db.commit)

    async def _guard(self, action) -> None:
        try:
            await action()
        except IntegrityError as exc:
            # carrera entre dos altas: el índice único parcial del RUC (PDM-001) tiene la última palabra
            await self.db.rollback()
            message = str(exc.orig).lower()
            if "identification" in message:
                raise _duplicate("ruc") from exc
            if "email" in message:
                # otra alta creó la fila de ese correo entre la consulta y el commit: se reintenta
                raise _duplicate("email") from exc
            raise

    async def get(self, org_id: UUID | str) -> OrganizationOut:
        rows = (await self.db.execute(self._base().where(Organization.pk_party_id == str(org_id)))).all()
        if not rows:
            raise not_found("La organización no existe.")
        return (await self._build(rows[:1]))[0]


def _duplicate(field: str) -> ApiError:
    return ApiError(409, "ORGANIZATION_DUPLICATE", "La organización ya está registrada.", {"field": field})
