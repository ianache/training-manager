"""Consulta de organizaciones (unidades y proveedores) — API-SPEC-002."""
from datetime import date, datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import and_, case, exists, func, literal, or_, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.core.errors import ApiError, not_found, precondition_failed
from app.models.party import (
    ID_RUC,
    MECH_EMAIL,
    MECH_PHONE,
    ORGANIZATION,
    ORG_ROLES,
    PURPOSE_ORG_EMAIL,
    PURPOSE_ORG_PHONE,
    REL_MEMBERSHIP,
    REL_ORG_STRUCTURE,
    ROLE_INTERNAL,
    ROLE_SUPPLIER,
    ROLE_UNIT,
    ContactMechanism,
    Organization,
    OrganizationNameHistory,
    Party,
    PartyContactMechanism,
    PartyIdentification,
    PartyRelationship,
    PartyRole,
)
from app.schemas.organization import (
    InternalOrganizationOut,
    OrganizationContact,
    OrganizationOut,
    OrganizationStatus,
    OrganizationStatusFilter,
    OrganizationType,
    OrganizationView,
    ParentRef,
    RelationshipOut,
)
from app.services.party_service import total_pages  # noqa: F401  (se reexporta para el router)

ROOT_SCOPE = "ROOT"  # alcance del nombre de una unidad superior (migración 0007)
HIERARCHY_LOCK_KEY = 7_404_001  # advisory lock de las ediciones de la jerarquía (solo PostgreSQL)
MAX_TREE_DEPTH = 10  # Q-4 sin responder: profundidad máxima de view=tree (supuesto; ver informe)
# criterios de orden del listado; parent_name se resuelve con el padre vigente unido en la consulta
SORT_FIELDS = ("name", "parent_name", "status", "from_date", "created_at")
ROLE_OF = {OrganizationType.internal_unit: ROLE_UNIT, OrganizationType.external_provider: ROLE_SUPPLIER}
TYPE_OF = {v: k for k, v in ROLE_OF.items()}


def _like(term: str) -> str:
    """Patrón LIKE con %, _ y \\ literales (escape="\\")."""
    return "%" + term.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"


def _active(_today: date | None = None):
    """BR-PTY-21: Activa si la vigencia del rol sigue abierta (sin `thru_date`); Inactiva si la cerró."""
    return PartyRole.thru_date.is_(None)


class OrganizationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _base(self):
        """Cada organización con su rol vigente más reciente (reactivar abre un rol nuevo y deja el anterior cerrado)."""
        newer = aliased(PartyRole)
        has_newer = (
            exists()
            .where(
                newer.fk_party_id == PartyRole.fk_party_id,
                newer.fk_party_role_type_code == PartyRole.fk_party_role_type_code,
                or_(
                    newer.created_at > PartyRole.created_at,
                    and_(newer.created_at == PartyRole.created_at, newer.pk_party_role_id > PartyRole.pk_party_role_id),
                ),
            )
            .correlate(PartyRole)
        )
        return (
            select(Organization, PartyRole)
            .join(PartyRole, PartyRole.fk_party_id == Organization.pk_party_id)
            .where(PartyRole.fk_party_role_type_code.in_(ORG_ROLES), ~has_newer)
        )

    def _descendants(self, party_id: str):
        """CTE con la unidad y todos sus descendientes por relaciones de estructura vigentes (UNION corta ciclos)."""
        tree = select(literal(party_id).label("pid")).cte("tree", recursive=True)
        child, parent, rel = aliased(PartyRole), aliased(PartyRole), aliased(PartyRelationship)
        step = (
            select(child.fk_party_id)
            .join(rel, rel.fk_party_role_from_id == child.pk_party_role_id)
            .join(parent, parent.pk_party_role_id == rel.fk_party_role_to_id)
            .join(tree, tree.c.pid == parent.fk_party_id)
            .where(rel.fk_party_relationship_type_code == REL_ORG_STRUCTURE, rel.thru_date.is_(None))
        )
        return tree.union(step)

    async def _unit_counts(self, unit_party_ids: list[str], unit_role_ids: list[str]):
        """Unidades hijas activas por unidad (por id de parte) y personas con pertenencia vigente (por id de rol)."""
        child_role, parent_role = aliased(PartyRole), aliased(PartyRole)
        children_count = dict(
            (
                await self.db.execute(
                    select(parent_role.fk_party_id, func.count(func.distinct(child_role.fk_party_id)))
                    .select_from(PartyRelationship)
                    .join(child_role, child_role.pk_party_role_id == PartyRelationship.fk_party_role_from_id)
                    .join(parent_role, parent_role.pk_party_role_id == PartyRelationship.fk_party_role_to_id)
                    .where(
                        PartyRelationship.fk_party_relationship_type_code == REL_ORG_STRUCTURE,
                        PartyRelationship.thru_date.is_(None),
                        child_role.fk_party_role_type_code == ROLE_UNIT,
                        child_role.thru_date.is_(None),
                        parent_role.fk_party_id.in_(unit_party_ids),
                    )
                    .group_by(parent_role.fk_party_id)
                )
            ).all()
        )
        people_count = dict(
            (
                await self.db.execute(
                    select(
                        PartyRelationship.fk_party_role_to_id,
                        func.count(func.distinct(PartyRelationship.fk_party_role_from_id)),
                    )
                    .where(
                        PartyRelationship.fk_party_relationship_type_code == REL_MEMBERSHIP,
                        PartyRelationship.thru_date.is_(None),
                        PartyRelationship.fk_party_role_to_id.in_(unit_role_ids),
                    )
                    .group_by(PartyRelationship.fk_party_role_to_id)
                )
            ).all()
        )
        return children_count, people_count

    async def _build(self, rows) -> list[OrganizationOut]:
        today = date.today()
        role_ids = [r.pk_party_role_id for _, r in rows]
        party_ids = [o.pk_party_id for o, _ in rows]
        to_role = aliased(PartyRole)
        parents: dict[str, str] = {}
        rucs: dict[str, str] = {}
        contacts: dict[str, OrganizationContact] = {}
        children_count: dict[str, int] = {}
        people_count: dict[str, int] = {}
        if role_ids:
            unit_party_ids = [o.pk_party_id for o, r in rows if r.fk_party_role_type_code == ROLE_UNIT]
            unit_role_ids = [r.pk_party_role_id for _, r in rows if r.fk_party_role_type_code == ROLE_UNIT]
            if unit_party_ids:
                children_count, people_count = await self._unit_counts(unit_party_ids, unit_role_ids)
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
            is_active = role.thru_date is None
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
                    row_version=org.row_version,
                    from_date=role.from_date if unit else None,
                    thru_date=role.thru_date if unit else None,
                    active_children_count=children_count.get(org.pk_party_id, 0) if unit else None,
                    current_people_count=people_count.get(role.pk_party_role_id, 0) if unit else None,
                )
            )
        return out

    async def list(self, page, limit, sort, type_, status, search, parent_id, ancestor_id=None, view=OrganizationView.list):
        field, _, direction = sort.partition(":")
        if field not in SORT_FIELDS or direction not in ("", "asc", "desc"):
            raise ApiError(400, "VALIDATION_ERROR", "El criterio de orden no es válido.", {"field": "sort"})
        # el padre vigente se une para poder ordenar por su nombre
        rel, prole, porg = aliased(PartyRelationship), aliased(PartyRole), aliased(Organization)
        q = (
            self._base()
            .outerjoin(
                rel,
                and_(
                    rel.fk_party_role_from_id == PartyRole.pk_party_role_id,
                    rel.fk_party_relationship_type_code == REL_ORG_STRUCTURE,
                    rel.thru_date.is_(None),
                ),
            )
            .outerjoin(prole, prole.pk_party_role_id == rel.fk_party_role_to_id)
            .outerjoin(porg, porg.pk_party_id == prole.fk_party_id)
        )
        applied = {"status": status.value}
        if status == OrganizationStatusFilter.active:
            q = q.where(_active())
        elif status == OrganizationStatusFilter.inactive:
            q = q.where(~_active())
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
            q = q.where(porg.pk_party_id == str(parent_id))
            applied["parent_id"] = str(parent_id)
        if ancestor_id:
            q = q.where(Organization.pk_party_id.in_(select(self._descendants(str(ancestor_id)).c.pid)))
            applied["ancestor_id"] = str(ancestor_id)
        cols = {
            "name": Organization.organization_name,
            "parent_name": func.coalesce(porg.organization_name, ""),
            "status": case((PartyRole.thru_date.is_(None), 1), else_=0),
            "from_date": PartyRole.from_date,
            "created_at": Organization.created_at,
        }
        col = cols[field]
        q = q.order_by(col.desc() if direction == "desc" else col.asc(), Organization.pk_party_id)
        if view == OrganizationView.tree:
            total, data = await self._tree(q, page, limit)
            return data, total, applied
        total = (await self.db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
        rows = (await self.db.execute(q.offset((page - 1) * limit).limit(limit))).all()
        return await self._build(rows), total, applied

    async def _tree(self, q, page, limit):
        """view=tree: las unidades que cumplen los filtros, anidadas por su padre vigente; la página cuenta raíces."""
        items = await self._build((await self.db.execute(q)).all())
        ids = {o.id for o in items}
        by_parent: dict[str, list[OrganizationOut]] = {}
        roots = []
        for o in items:
            if o.parent_id in ids:
                by_parent.setdefault(o.parent_id, []).append(o)
            else:
                roots.append(o)

        def nest(o: OrganizationOut, depth: int) -> OrganizationOut:
            kids = by_parent.get(o.id, []) if depth < MAX_TREE_DEPTH else []
            return o.model_copy(update={"children": [nest(k, depth + 1) for k in kids]})

        return len(roots), [nest(o, 1) for o in roots[(page - 1) * limit : page * limit]]

    async def _same_name_under(
        self, name: str, type_: OrganizationType, parent_id: str | None, exclude: str | None = None
    ) -> bool:
        """BR-PTY-26: ¿hay ya una unidad activa con ese nombre bajo ese padre (o sin padre)?"""
        if type_ == OrganizationType.internal_unit:
            q = select(Organization.pk_party_id).where(
                Organization.unit_name_scope == (parent_id or ROOT_SCOPE),
                func.lower(Organization.organization_name) == name.lower(),
            )
            if exclude:
                q = q.where(Organization.pk_party_id != exclude)
            return (await self.db.execute(q)).first() is not None
        rows = (
            await self.db.execute(
                self._base().where(
                    PartyRole.fk_party_role_type_code == ROLE_OF[type_],
                    _active(),
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
            # el padre queda con candado compartido hasta el commit: desactivarlo (candado exclusivo) espera a esta alta,
            # y la comprobación va en una consulta aparte para ver lo que ya haya confirmado quien lo desactivó
            await self.db.execute(
                select(Organization.pk_party_id).where(Organization.pk_party_id == parent_id).with_for_update(read=True)
            )
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
                pk_party_id=pid,
                organization_name=payload.name,
                code=payload.code,
                location=payload.location,
                created_by=actor,
                unit_name_scope=(parent_id or ROOT_SCOPE) if payload.type == OrganizationType.internal_unit else None,
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
            if "unit_name_scope" in message:
                raise _duplicate("name") from exc
            if "email" in message:
                # otra alta creó la fila de ese correo entre la consulta y el commit: se reintenta
                raise _duplicate("email") from exc
            raise

    async def _unit_locked(self, org_id: UUID | str, if_match: int | None) -> tuple[Organization, PartyRole]:
        """La unidad vigente con su fila bloqueada (dos cambios simultáneos se serializan) y el control de versión."""
        row = (
            await self.db.execute(
                self._base()
                .where(Organization.pk_party_id == str(org_id), PartyRole.fk_party_role_type_code == ROLE_UNIT)
                .with_for_update(of=Organization)
            )
        ).first()
        if row is None:
            raise not_found("La unidad no existe.")
        org, role = row
        if if_match is not None and if_match != org.row_version:
            await self.db.rollback()
            raise precondition_failed()
        return org, role

    def _touch(self, org: Organization, actor: str) -> None:
        org.row_version += 1
        org.updated_by = actor
        org.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)

    async def rename(self, org_id: UUID, name: str, actor: str, if_match: int | None) -> OrganizationOut:
        """US-029 AC-2: nuevo nombre con el valor anterior en tb_organization_name_history (BR-PTY-12)."""
        org, role = await self._unit_locked(org_id, if_match)
        if role.thru_date is not None:
            await self.db.rollback()
            raise ApiError(409, "ORGANIZATION_INACTIVE", "La unidad está inactiva: reactívala para editarla.")
        if name == org.organization_name:
            await self.db.rollback()
        else:
            parent = None if org.unit_name_scope == ROOT_SCOPE else org.unit_name_scope
            if await self._same_name_under(name, OrganizationType.internal_unit, parent, exclude=org.pk_party_id):
                await self.db.rollback()
                raise _duplicate("name")
            self.db.add(
                OrganizationNameHistory(
                    pk_organization_name_history_id=str(uuid4()),
                    fk_party_id=org.pk_party_id,
                    previous_name=org.organization_name,
                    new_name=name,
                    changed_by=actor,
                )
            )
            org.organization_name = name
            self._touch(org, actor)
            await self._commit()
        self.db.expunge_all()
        return await self.get(org_id)

    async def _hierarchy_lock(self) -> None:
        """Serializa las ediciones de la jerarquía (cambio de padre, reactivación): la prueba de ciclo mira todo el árbol."""
        if self.db.get_bind().dialect.name == "postgresql":
            await self.db.execute(text("SELECT pg_advisory_xact_lock(:k)"), {"k": HIERARCHY_LOCK_KEY})

    def _validation_error(self, field: str, message: str) -> ApiError:
        return ApiError(400, "VALIDATION_ERROR", "Los datos enviados no son válidos.", {"fields": [{"field": field, "message": message}]})

    async def _open_structure(self, role_id: str):
        """Relación de estructura vigente de la unidad: (relación, id de la parte padre, id del rol padre) o None."""
        to_role = aliased(PartyRole)
        return (
            await self.db.execute(
                select(PartyRelationship, to_role.fk_party_id, to_role.pk_party_role_id)
                .join(to_role, to_role.pk_party_role_id == PartyRelationship.fk_party_role_to_id)
                .where(
                    PartyRelationship.fk_party_role_from_id == role_id,
                    PartyRelationship.fk_party_relationship_type_code == REL_ORG_STRUCTURE,
                    PartyRelationship.thru_date.is_(None),
                )
            )
        ).first()

    async def _active_parent(self, parent_id: str) -> tuple[Organization, PartyRole]:
        """La unidad que será padre: debe existir como unidad (404) y estar activa (BR-PTY-25)."""
        row = (
            await self.db.execute(
                self._base().where(Organization.pk_party_id == parent_id, PartyRole.fk_party_role_type_code == ROLE_UNIT)
            )
        ).first()
        if row is None:
            raise not_found("La unidad padre no existe.")
        if row[1].thru_date is not None:
            raise ApiError(
                409,
                "PARENT_INACTIVE",
                "La unidad padre está inactiva: solo una unidad activa puede ser padre.",
                {"parent_id": parent_id, "parent_name": row[0].organization_name},
            )
        return row

    async def change_parent(
        self, org_id: UUID, parent_id: UUID | None, from_date: date, actor: str, if_match: int | None
    ) -> OrganizationOut:
        """US-029 AC-3 a AC-6: cierra la relación de estructura vigente y abre la nueva en una sola transacción."""
        await self._hierarchy_lock()
        org, role = await self._unit_locked(org_id, if_match)
        try:
            if role.thru_date is not None:
                raise ApiError(409, "ORGANIZATION_INACTIVE", "La unidad está inactiva: reactívala para moverla.")
            current = await self._open_structure(role.pk_party_role_id)
            if from_date > date.today():
                raise self._validation_error("from_date", "La fecha desde no puede ser futura.")
            if current and from_date < current[0].from_date:
                raise self._validation_error("from_date", "La fecha desde no puede ser anterior a la relación vigente.")
            new_parent = str(parent_id) if parent_id else None
            if new_parent == (current[1] if current else None):
                await self.db.rollback()
                self.db.expunge_all()
                return await self.get(org_id)
            parent_role = None
            if new_parent:
                subtree = (await self.db.execute(select(self._descendants(org.pk_party_id).c.pid))).scalars().all()
                if new_parent in subtree:  # incluye la propia unidad
                    raise ApiError(409, "ORGANIZATION_CYCLE", "El cambio crearía un ciclo en la jerarquía (BR-PTY-22).")
                _, parent_role_row = await self._active_parent(new_parent)
                parent_role = parent_role_row.pk_party_role_id
            if await self._same_name_under(org.organization_name, OrganizationType.internal_unit, new_parent, exclude=org.pk_party_id):
                raise _duplicate("name")
        except ApiError:
            await self.db.rollback()
            raise
        if current:
            current[0].thru_date = from_date
            current[0].updated_by = actor
            current[0].updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
            await self._flush()  # cerrar antes de abrir: a lo sumo una relación vigente por unidad
        if parent_role:
            self.db.add(
                PartyRelationship(
                    pk_party_relationship_id=str(uuid4()),
                    fk_party_relationship_type_code=REL_ORG_STRUCTURE,
                    fk_party_role_from_id=role.pk_party_role_id,
                    fk_party_role_to_id=parent_role,
                    from_date=from_date,
                    created_by=actor,
                )
            )
        org.unit_name_scope = new_parent or ROOT_SCOPE
        self._touch(org, actor)
        await self._commit()
        self.db.expunge_all()
        return await self.get(org_id)

    async def deactivate(self, org_id: UUID, actor: str, if_match: int | None) -> OrganizationOut:
        """US-030 AC-1/AC-2: eliminación lógica; cierra el rol y la relación de estructura, no borra (BR-PTY-12, 21, 23)."""
        await self._hierarchy_lock()
        org, role = await self._unit_locked(org_id, if_match)
        try:
            if role.thru_date is not None:
                raise ApiError(409, "ORGANIZATION_ALREADY_INACTIVE", "La unidad ya está inactiva.")
            children, people = await self._unit_counts([org.pk_party_id], [role.pk_party_role_id])
            n_children, n_people = children.get(org.pk_party_id, 0), people.get(role.pk_party_role_id, 0)
            if n_children or n_people:
                raise ApiError(
                    409,
                    "ORGANIZATION_HAS_DEPENDENCIES",
                    "La unidad tiene unidades hijas activas o personas con pertenencia vigente.",
                    {"active_children_count": n_children, "current_people_count": n_people},
                )
        except ApiError:
            await self.db.rollback()
            raise
        today, now = date.today(), datetime.now(timezone.utc).replace(tzinfo=None)
        role.thru_date, role.thru_recorded_at, role.thru_recorded_by = today, now, actor
        current = await self._open_structure(role.pk_party_role_id)
        if current:
            current[0].thru_date, current[0].updated_by, current[0].updated_at = today, actor, now
        org.unit_name_scope = None  # una unidad inactiva no ocupa nombre
        self._touch(org, actor)
        await self._commit()
        self.db.expunge_all()
        return await self.get(org_id)

    async def reactivate(
        self, org_id: UUID, from_date: date, parent_id: UUID | None, parent_given: bool, actor: str, if_match: int | None
    ) -> OrganizationOut:
        """US-030 AC-3/AC-4: abre una nueva vigencia del rol y de la relación; el historial anterior se conserva (BR-PTY-24)."""
        await self._hierarchy_lock()
        org, role = await self._unit_locked(org_id, if_match)
        try:
            if role.thru_date is None:
                raise ApiError(409, "ORGANIZATION_ALREADY_ACTIVE", "La unidad ya está activa.")
            if from_date > date.today():
                raise self._validation_error("from_date", "La fecha desde no puede ser futura.")
            if from_date < role.thru_date:
                raise self._validation_error("from_date", "La nueva vigencia no puede empezar antes del cierre de la anterior.")
            if parent_given:
                new_parent = str(parent_id) if parent_id else None
            else:  # sin parent_id: el padre que tenía al desactivarse (la última relación, cerrada con la baja)
                last = (
                    await self.db.execute(
                        select(PartyRelationship, PartyRole.fk_party_id)
                        .join(PartyRole, PartyRole.pk_party_role_id == PartyRelationship.fk_party_role_to_id)
                        .where(
                            PartyRelationship.fk_party_role_from_id == role.pk_party_role_id,
                            PartyRelationship.fk_party_relationship_type_code == REL_ORG_STRUCTURE,
                        )
                        .order_by(PartyRelationship.created_at.desc())
                    )
                ).first()
                new_parent = last[1] if last and last[0].thru_date == role.thru_date else None
            parent_role = None
            if new_parent:
                _, parent_role_row = await self._active_parent(new_parent)
                parent_role = parent_role_row.pk_party_role_id
            if await self._same_name_under(org.organization_name, OrganizationType.internal_unit, new_parent, exclude=org.pk_party_id):
                raise _duplicate("name")
        except ApiError:
            await self.db.rollback()
            raise
        new_role = str(uuid4())
        self.db.add(
            PartyRole(
                pk_party_role_id=new_role,
                fk_party_id=org.pk_party_id,
                party_kind=ORGANIZATION,
                fk_party_role_type_code=ROLE_UNIT,
                from_date=from_date,
                created_by=actor,
            )
        )
        await self._flush()
        if parent_role:
            self.db.add(
                PartyRelationship(
                    pk_party_relationship_id=str(uuid4()),
                    fk_party_relationship_type_code=REL_ORG_STRUCTURE,
                    fk_party_role_from_id=new_role,
                    fk_party_role_to_id=parent_role,
                    from_date=from_date,
                    created_by=actor,
                )
            )
        org.unit_name_scope = new_parent or ROOT_SCOPE
        self._touch(org, actor)
        await self._commit()
        self.db.expunge_all()
        return await self.get(org_id)

    async def relationships(self, org_id: UUID, page: int, limit: int):
        """Historial de relaciones de estructura de la unidad (todas sus vigencias de rol), de la más reciente a la más antigua.

        `previous_parent` es el padre de la relación anterior en el historial. Pasar a unidad superior no abre
        una relación (no hay padre al que apuntar), así que no figura como fila propia.
        """
        if (await self.db.execute(select(Organization.pk_party_id).join(PartyRole, PartyRole.fk_party_id == Organization.pk_party_id).where(
            Organization.pk_party_id == str(org_id), PartyRole.fk_party_role_type_code == ROLE_UNIT))).first() is None:
            raise not_found("La unidad no existe.")
        from_role, to_role, parent = aliased(PartyRole), aliased(PartyRole), aliased(Organization)
        found = (
            await self.db.execute(
                select(PartyRelationship, parent.pk_party_id, parent.organization_name)
                .join(from_role, from_role.pk_party_role_id == PartyRelationship.fk_party_role_from_id)
                .join(to_role, to_role.pk_party_role_id == PartyRelationship.fk_party_role_to_id)
                .join(parent, parent.pk_party_id == to_role.fk_party_id)
                .where(
                    from_role.fk_party_id == str(org_id),
                    PartyRelationship.fk_party_relationship_type_code == REL_ORG_STRUCTURE,
                )
                .order_by(PartyRelationship.from_date.desc(), PartyRelationship.created_at.desc())
            )
        ).all()
        items = [
            RelationshipOut(
                new_parent=ParentRef(id=pid, name=name),
                previous_parent=ParentRef(id=found[i + 1][1], name=found[i + 1][2]) if i + 1 < len(found) else None,
                from_date=rel.from_date,
                thru_date=rel.thru_date,
                changed_by=rel.created_by,
            )
            for i, (rel, pid, name) in enumerate(found)
        ]
        return items[(page - 1) * limit : page * limit], len(items)

    async def get_internal(self) -> InternalOrganizationOut:
        """API-SPEC-007: la organización con el rol INTERNAL_ORGANIZATION vigente (la más reciente si hubiera varias)."""
        row = (
            await self.db.execute(
                select(Organization, PartyRole, PartyIdentification.identification_number, PartyIdentification.issuing_country_code)
                .join(PartyRole, PartyRole.fk_party_id == Organization.pk_party_id)
                .outerjoin(
                    PartyIdentification,
                    and_(
                        PartyIdentification.fk_party_id == Organization.pk_party_id,
                        PartyIdentification.fk_identification_type_code == ID_RUC,
                        PartyIdentification.anonymized_at.is_(None),
                    ),
                )
                .where(PartyRole.fk_party_role_type_code == ROLE_INTERNAL, PartyRole.thru_date.is_(None))
                .order_by(PartyRole.from_date.desc(), PartyRole.created_at.desc())
                .limit(1)
            )
        ).first()
        if row is None:
            raise ApiError(404, "INTERNAL_ORGANIZATION_NOT_FOUND", "No hay una organización interna registrada.")
        org, role, ruc, country = row
        return InternalOrganizationOut(
            id=org.pk_party_id, name=org.organization_name, ruc=ruc, ruc_country=country,
            from_date=role.from_date, thru_date=role.thru_date,
        )

    async def get(self, org_id: UUID | str) -> OrganizationOut:
        rows = (await self.db.execute(self._base().where(Organization.pk_party_id == str(org_id)))).all()
        if not rows:
            raise not_found("La organización no existe.")
        return (await self._build(rows[:1]))[0]


def _duplicate(field: str) -> ApiError:
    return ApiError(409, "ORGANIZATION_DUPLICATE", "La organización ya está registrada.", {"field": field})
