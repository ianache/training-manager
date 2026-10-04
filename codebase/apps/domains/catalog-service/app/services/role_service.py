"""
Roles y Rol-Nivel (API-SPEC-003 §2, LDM-002). Reglas entre filas que la base no puede aplicar:

- CHK-A: un rol tiene al menos un nivel y cada nivel al menos una competencia (BR-CAT-20).
- CHK-B: el nivel L exigido de cada competencia tiene al menos un requisito de evidencia
  «requerido» en la versión referida (BR-ACR-13, EVD-2026-0149).
- Una competencia una sola vez por nivel (BR-CAT-21), con una versión de esa competencia
  APROBADA (R-46); una competencia INACTIVE solo se conserva donde ya estaba (BR-CAT-28).

Concurrencia: `If-Match` con row_version; el UPDATE condicionado toma el candado de la fila,
así que dos PUT simultáneos no ganan los dos.
"""
from __future__ import annotations

import math
import uuid

from sqlalchemy import delete, func, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.errors import ApiError, not_found
from app.models.catalog import Competency, CompetencyVersion, EvidenceRequirement, Role, RoleLevel, RoleLevelCompetency
from app.schemas.catalog import RoleIn, RoleLevelIn

SORTS = {"name": Role.name, "created_at": Role.created_at}


def total_pages(total: int, limit: int) -> int:
    return max(1, math.ceil(total / limit))


def _validation(message: str) -> ApiError:
    return ApiError(400, "VALIDATION_ERROR", message)


def _escape_like(text: str) -> str:
    return text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


class RoleService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ------------------------------------------------------------------ lectura

    async def list(self, page: int, limit: int, sort: str, status: str | None, search: str | None):
        field, _, direction = sort.partition(":")
        column = SORTS.get(field)
        if column is None or direction not in ("", "asc", "desc"):
            raise _validation("El orden pedido no es válido. Usa name o created_at, con :asc o :desc.")
        order = column.desc() if direction == "desc" else column.asc()

        stmt = select(Role)
        count = select(func.count()).select_from(Role)
        applied: dict[str, str] = {}
        if status:
            stmt, count = stmt.where(Role.status == status), count.where(Role.status == status)
            applied["status"] = status
        if search:
            like = f"%{_escape_like(search.strip().lower())}%"
            cond = func.lower(Role.name).like(like, escape="\\")
            stmt, count = stmt.where(cond), count.where(cond)
            applied["search"] = search
        total = await self.db.scalar(count)
        roles = (
            (await self.db.execute(stmt.options(selectinload(Role.levels)).order_by(order, Role.id).offset((page - 1) * limit).limit(limit)))
            .scalars()
            .all()
        )
        ctx = await self._context(roles)
        return [self._summary(r, ctx) for r in roles], total, applied

    async def get(self, role_id: str) -> dict:
        role = await self._load(role_id)
        ctx = await self._context([role])
        return self._detail(role, ctx)

    # ------------------------------------------------------------------ escritura

    async def create(self, payload: RoleIn, user: str) -> dict:
        await self._check_payload_shape(payload)
        await self._ensure_name_free(payload.name, exclude_id=None)
        try:
            role = Role(id=str(uuid.uuid4()), name=payload.name, description=payload.description, status="ACTIVE", row_version=1, created_by=user)
            self.db.add(role)
            await self.db.flush()
            for level in payload.levels:
                await self._add_level(role.id, level, user)
            await self.db.commit()
        except IntegrityError as exc:
            await self.db.rollback()
            raise self._integrity(exc)
        except ApiError:
            await self.db.rollback()
            raise
        return await self.get(role.id)

    async def update(self, role_id: str, payload: RoleIn, user: str, row_version: int) -> dict:
        try:
            role = await self._load(role_id, lock=True)
            await self._check_payload_shape(payload)
            if role.name.strip().lower() != payload.name.strip().lower():
                await self._ensure_name_free(payload.name, exclude_id=role.id)
            await self._bump_role(role.id, row_version, user, name=payload.name, description=payload.description)

            existing = {lv.id: lv for lv in role.levels}
            for level in payload.levels:
                if level.id is None:
                    await self._add_level(role.id, level, user)
                    continue
                current = existing.get(str(level.id))
                if current is None:
                    raise _validation("El nivel indicado no pertenece a este rol.")
                await self._edit_level(current, level, user)
            await self.db.commit()
        except IntegrityError as exc:
            await self.db.rollback()
            raise self._integrity(exc)
        except ApiError:
            await self.db.rollback()
            raise
        self.db.expire_all()
        return await self.get(role_id)

    async def deactivate(self, role_id: str, user: str, row_version: int | None) -> dict:
        role = await self._load(role_id, lock=True)
        if role.status == "INACTIVE":
            await self.db.rollback()
            raise ApiError(409, "ROLE_ALREADY_INACTIVE", "El rol ya está inactivo.")
        if row_version is not None and row_version != role.row_version:
            await self.db.rollback()
            raise ApiError(412, "PRECONDITION_FAILED", "El rol cambió desde que lo leíste. Vuelve a cargarlo.")
        await self.db.execute(
            update(Role).where(Role.id == role.id).values(status="INACTIVE", row_version=Role.row_version + 1, updated_at=func.now(), updated_by=user)
        )
        await self.db.commit()
        self.db.expire_all()
        return await self.get(role_id)

    async def set_level_status(self, role_id: str, level_id: str, target: str, user: str) -> dict:
        role = await self._load(role_id, lock=True)
        level = next((lv for lv in role.levels if lv.id == level_id), None)
        if level is None:
            await self.db.rollback()
            raise not_found("El nivel no existe en este rol.")
        if level.status == target:
            await self.db.rollback()
            code = "LEVEL_ALREADY_INACTIVE" if target == "INACTIVE" else "LEVEL_ALREADY_ACTIVE"
            raise ApiError(409, code, "El nivel ya está " + ("inactivo." if target == "INACTIVE" else "activo."))
        await self.db.execute(
            update(RoleLevel)
            .where(RoleLevel.id == level.id)
            .values(status=target, row_version=RoleLevel.row_version + 1, updated_at=func.now(), updated_by=user)
        )
        await self.db.commit()
        self.db.expire_all()
        return await self.get(role_id)

    # ------------------------------------------------------------------ validación

    async def _check_payload_shape(self, payload: RoleIn) -> None:
        ordinals = [lv.ordinal for lv in payload.levels]
        if len(set(ordinals)) != len(ordinals):
            raise _validation("Dos niveles no pueden tener el mismo orden.")
        names = [lv.name.strip().lower() for lv in payload.levels]
        if len(set(names)) != len(names):
            raise _validation("Dos niveles no pueden tener el mismo nombre.")
        ids = [str(lv.id) for lv in payload.levels if lv.id is not None]
        if len(set(ids)) != len(ids):
            raise _validation("Un nivel aparece dos veces en la petición.")

    async def _ensure_name_free(self, name: str, exclude_id: str | None) -> None:
        stmt = select(Role.id).where(func.lower(func.trim(Role.name)) == name.strip().lower())
        if exclude_id:
            stmt = stmt.where(Role.id != exclude_id)
        if await self.db.scalar(stmt):
            raise ApiError(409, "ROLE_NAME_DUPLICATE", "Ya existe un rol con ese nombre.")

    async def _validate_competencies(self, level: RoleLevelIn, current: dict[str, str]) -> list[RoleLevelCompetency]:
        """Valida las competencias de un nivel. `current`: competencia → versión ya guardada en ese nivel."""
        seen: set[str] = set()
        for c in level.competencies:
            cid = str(c.competency_id)
            if cid in seen:
                raise ApiError(409, "COMPETENCY_DUPLICATED", "Una competencia no puede repetirse en el mismo nivel.")
            seen.add(cid)

        out: list[RoleLevelCompetency] = []
        for c in level.competencies:
            cid, vid = str(c.competency_id), str(c.version_id)
            competency = await self.db.get(Competency, cid)
            if competency is None:
                raise _validation(f"La competencia {cid} no existe.")
            version = await self.db.get(CompetencyVersion, vid)
            if version is None or version.competency_id != cid:
                raise _validation("La versión indicada no pertenece a la competencia.")
            unchanged = current.get(cid) == vid
            if version.status != "APPROVED" and not (unchanged and version.status == "DEPRECATED"):
                raise _validation("Solo se puede usar una versión APROBADA de la competencia.")
            if competency.status == "INACTIVE" and cid not in current:
                raise ApiError(409, "COMPETENCY_INACTIVE", f"La competencia «{competency.name}» está inactiva.")
            has_required = await self.db.scalar(
                select(func.count())
                .select_from(EvidenceRequirement)
                .where(
                    EvidenceRequirement.competency_version_id == vid,
                    EvidenceRequirement.level_code == c.required_level,
                    EvidenceRequirement.is_required.is_(True),
                )
            )
            if not has_required:
                raise ApiError(
                    422,
                    "EVIDENCE_REQUIREMENTS_MISSING",
                    f"La competencia «{competency.name}» no tiene requisitos de evidencia «requeridos» para {c.required_level}.",
                    {"competency_id": cid, "required_level": c.required_level},
                )
            out.append(RoleLevelCompetency(competency_id=cid, competency_version_id=vid, required_level=c.required_level))
        return out

    # ------------------------------------------------------------------ niveles

    async def _add_level(self, role_id: str, level: RoleLevelIn, user: str) -> None:
        rows = await self._validate_competencies(level, current={})
        lv = RoleLevel(id=str(uuid.uuid4()), role_id=role_id, name=level.name, ordinal=level.ordinal, status="ACTIVE", row_version=1, created_by=user)
        self.db.add(lv)
        await self.db.flush()
        for row in rows:
            row.role_level_id, row.created_by = lv.id, user
            self.db.add(row)
        await self.db.flush()

    async def _edit_level(self, current: RoleLevel, level: RoleLevelIn, user: str) -> None:
        existing = {
            r.competency_id: r.competency_version_id
            for r in (await self.db.execute(select(RoleLevelCompetency).where(RoleLevelCompetency.role_level_id == current.id))).scalars()
        }
        rows = await self._validate_competencies(level, current=existing)
        await self.db.execute(delete(RoleLevelCompetency).where(RoleLevelCompetency.role_level_id == current.id))
        await self.db.execute(
            update(RoleLevel)
            .where(RoleLevel.id == current.id)
            .values(name=level.name, ordinal=level.ordinal, row_version=RoleLevel.row_version + 1, updated_at=func.now(), updated_by=user)
        )
        await self.db.flush()
        for row in rows:
            row.role_level_id, row.created_by = current.id, user
            self.db.add(row)
        await self.db.flush()

    async def _bump_role(self, role_id: str, row_version: int, user: str, **values) -> None:
        result = await self.db.execute(
            update(Role)
            .where(Role.id == role_id, Role.row_version == row_version)
            .values(row_version=Role.row_version + 1, updated_at=func.now(), updated_by=user, **values)
        )
        if result.rowcount != 1:
            raise ApiError(412, "PRECONDITION_FAILED", "El rol cambió desde que lo leíste. Vuelve a cargarlo.")

    def _integrity(self, exc: IntegrityError) -> ApiError:
        text = str(exc.orig).lower()
        if "ux_role_name" in text:
            return ApiError(409, "ROLE_NAME_DUPLICATE", "Ya existe un rol con ese nombre.")
        if "ux_role_level" in text:
            return ApiError(409, "LEVEL_CONFLICT", "Otro nivel del rol ya usa ese nombre u orden.")
        return ApiError(409, "CONFLICT", "La operación choca con datos existentes.")

    # ------------------------------------------------------------------ carga y vista

    async def _load(self, role_id: str, lock: bool = False) -> Role:
        stmt = select(Role).where(Role.id == str(role_id)).options(selectinload(Role.levels))
        if lock:
            stmt = stmt.with_for_update()
        role = (await self.db.execute(stmt)).scalar_one_or_none()
        if role is None:
            raise not_found("El rol no existe.")
        return role

    async def _context(self, roles: list[Role]) -> dict:
        """Datos auxiliares para calcular `usable`, conteos y advertencias de versión."""
        level_ids = [lv.id for r in roles for lv in r.levels]
        rlcs: list[RoleLevelCompetency] = []
        if level_ids:
            rlcs = list((await self.db.execute(select(RoleLevelCompetency).where(RoleLevelCompetency.role_level_id.in_(level_ids)))).scalars())
        version_ids = {r.competency_version_id for r in rlcs}
        competency_ids = {r.competency_id for r in rlcs}
        versions: dict[str, CompetencyVersion] = {}
        required: dict[tuple[str, str], int] = {}
        total_req: dict[tuple[str, str], int] = {}
        names: dict[str, str] = {}
        latest: dict[str, CompetencyVersion] = {}
        if version_ids:
            versions = {v.id: v for v in (await self.db.execute(select(CompetencyVersion).where(CompetencyVersion.id.in_(version_ids)))).scalars()}
            for vid, lc, is_req, n in (
                await self.db.execute(
                    select(
                        EvidenceRequirement.competency_version_id,
                        EvidenceRequirement.level_code,
                        EvidenceRequirement.is_required,
                        func.count(),
                    )
                    .where(EvidenceRequirement.competency_version_id.in_(version_ids))
                    .group_by(EvidenceRequirement.competency_version_id, EvidenceRequirement.level_code, EvidenceRequirement.is_required)
                )
            ).all():
                total_req[(vid, lc)] = total_req.get((vid, lc), 0) + n
                if is_req:
                    required[(vid, lc)] = n
            names = {c.id: c.name for c in (await self.db.execute(select(Competency).where(Competency.id.in_(competency_ids)))).scalars()}
            for v in (
                await self.db.execute(
                    select(CompetencyVersion).where(CompetencyVersion.competency_id.in_(competency_ids), CompetencyVersion.status == "APPROVED")
                )
            ).scalars():
                if v.competency_id not in latest or v.version_number > latest[v.competency_id].version_number:
                    latest[v.competency_id] = v
        by_level: dict[str, list[RoleLevelCompetency]] = {}
        for r in rlcs:
            by_level.setdefault(r.role_level_id, []).append(r)
        return {"by_level": by_level, "versions": versions, "required": required, "total": total_req, "names": names, "latest": latest}

    def _level_metrics(self, level: RoleLevel, ctx: dict) -> tuple[bool, int]:
        rows = ctx["by_level"].get(level.id, [])
        usable = bool(rows)
        count = 0
        for r in rows:
            version = ctx["versions"][r.competency_version_id]
            approved = version.status != "DRAFT"  # aprobada alguna vez: APPROVED o DEPRECATED (EVD-2026-0143)
            key = (r.competency_version_id, r.required_level)
            if approved:
                count += ctx["total"].get(key, 0)
            if not (approved and ctx["required"].get(key, 0) > 0):
                usable = False
        return usable, count

    def _summary(self, role: Role, ctx: dict) -> dict:
        levels, competencies = [], set()
        for lv in role.levels:
            usable, count = self._level_metrics(lv, ctx)
            competencies.update(r.competency_id for r in ctx["by_level"].get(lv.id, []))
            levels.append(
                {"id": lv.id, "name": lv.name, "ordinal": lv.ordinal, "status": lv.status, "usable": usable, "evidence_requirements": count}
            )
        return {
            "id": role.id,
            "name": role.name,
            "description": role.description,
            "status": role.status,
            "competency_count": len(competencies),
            "row_version": role.row_version,
            "levels": levels,
        }

    def _detail(self, role: Role, ctx: dict) -> dict:
        levels = []
        for lv in role.levels:
            usable, count = self._level_metrics(lv, ctx)
            comps = []
            for r in sorted(ctx["by_level"].get(lv.id, []), key=lambda r: ctx["names"][r.competency_id].lower()):
                version = ctx["versions"][r.competency_version_id]
                newest = ctx["latest"].get(r.competency_id)
                is_current = newest is None or newest.version_number <= version.version_number
                comps.append(
                    {
                        "competency_id": r.competency_id,
                        "name": ctx["names"][r.competency_id],
                        "required_level": r.required_level,
                        "version": {"id": version.id, "version_number": version.version_number, "status": version.status},
                        "is_current": is_current,
                        "suggested_version_id": None if is_current else newest.id,
                    }
                )
            levels.append(
                {
                    "id": lv.id,
                    "name": lv.name,
                    "ordinal": lv.ordinal,
                    "status": lv.status,
                    "usable": usable,
                    "evidence_requirements": count,
                    "competencies": comps,
                }
            )
        return {
            "id": role.id,
            "name": role.name,
            "description": role.description,
            "status": role.status,
            "row_version": role.row_version,
            "created_at": role.created_at,
            "created_by": role.created_by,
            "updated_at": role.updated_at,
            "updated_by": role.updated_by,
            "levels": levels,
        }
