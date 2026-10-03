"""Consulta de organizaciones (unidades y proveedores) — API-SPEC-002."""
from datetime import date
from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.core.errors import ApiError, not_found
from app.models.party import (
    ID_RUC,
    ORG_ROLES,
    REL_ORG_STRUCTURE,
    ROLE_SUPPLIER,
    ROLE_UNIT,
    Organization,
    PartyIdentification,
    PartyRelationship,
    PartyRole,
)
from app.schemas.organization import OrganizationOut, OrganizationStatus, OrganizationType
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

    async def get(self, org_id: UUID | str) -> OrganizationOut:
        rows = (await self.db.execute(self._base().where(Organization.pk_party_id == str(org_id)))).all()
        if not rows:
            raise not_found("La organización no existe.")
        return (await self._build(rows[:1]))[0]
