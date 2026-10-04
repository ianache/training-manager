"""Competencias y versiones: solo lectura en este tramo (API-SPEC-003 §2). La escritura va en un tramo posterior."""
from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.errors import not_found
from app.models.catalog import Competency, CompetencyVersion, EvidenceRequirement
from app.services.role_service import _escape_like


def _version_ref(v: CompetencyVersion) -> dict:
    return {"id": v.id, "version_number": v.version_number, "status": v.status}


def _current(c: Competency) -> CompetencyVersion | None:
    """Versión vigente = la APROBADA de mayor número (LDM-002 CM-03)."""
    approved = [v for v in c.versions if v.status == "APPROVED"]
    return max(approved, key=lambda v: v.version_number) if approved else None


def _summary(c: Competency, levels_with_requirements: int = 0) -> dict:
    cur = _current(c)
    return {
        "id": c.id,
        "name": c.name,
        "description": c.description,
        "status": c.status,
        "current_version": _version_ref(cur) if cur else None,
        "levels_with_requirements": levels_with_requirements,
        "row_version": c.row_version,
    }


async def _levels_with_requirements(db: AsyncSession, competencies: list[Competency]) -> dict[str, int]:
    """Niveles distintos con algún requisito en la versión vigente de cada competencia (0 si no hay versión aprobada)."""
    current = {c.id: v.id for c in competencies if (v := _current(c))}
    if not current:
        return {}
    rows = await db.execute(
        select(EvidenceRequirement.competency_version_id, func.count(func.distinct(EvidenceRequirement.level_code)))
        .where(EvidenceRequirement.competency_version_id.in_(set(current.values())))
        .group_by(EvidenceRequirement.competency_version_id)
    )
    by_version = {vid: n for vid, n in rows.all()}
    return {cid: by_version.get(vid, 0) for cid, vid in current.items()}


class CompetencyService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(self, page: int, limit: int, status: str | None, search: str | None):
        stmt = select(Competency)
        count = select(func.count()).select_from(Competency)
        applied: dict[str, str] = {}
        if status:
            stmt, count = stmt.where(Competency.status == status), count.where(Competency.status == status)
            applied["status"] = status
        if search:
            cond = func.lower(Competency.name).like(f"%{_escape_like(search.strip().lower())}%", escape="\\")
            stmt, count = stmt.where(cond), count.where(cond)
            applied["search"] = search
        total = await self.db.scalar(count)
        stmt = stmt.options(selectinload(Competency.versions)).order_by(func.lower(Competency.name), Competency.id)
        rows = (await self.db.execute(stmt.offset((page - 1) * limit).limit(limit))).scalars().all()
        counts = await _levels_with_requirements(self.db, list(rows))
        return [_summary(c, counts.get(c.id, 0)) for c in rows], total, applied

    async def get(self, competency_id: str) -> dict:
        versions = selectinload(Competency.versions)
        stmt = (
            select(Competency)
            .where(Competency.id == str(competency_id))
            .options(versions.selectinload(CompetencyVersion.rubric), versions.selectinload(CompetencyVersion.requirements))
        )
        c = (await self.db.execute(stmt)).scalar_one_or_none()
        if c is None:
            raise not_found("La competencia no existe.")
        out = _summary(c, (await _levels_with_requirements(self.db, [c])).get(c.id, 0))
        out["versions"] = [
            {
                "id": v.id,
                "version_number": v.version_number,
                "status": v.status,
                "approved_at": v.approved_at,
                "approved_by": v.approved_by,
                "rubric": [{"level": r.level_code, "behavior_description": r.behavior_description} for r in v.rubric],
                "evidence_requirements": [
                    {
                        "id": e.id,
                        "level": e.level_code,
                        "category": e.category,
                        "description": e.description,
                        "is_required": e.is_required,
                        "course_ref": e.course_ref,
                    }
                    for e in sorted(v.requirements, key=lambda e: (e.level_code, e.description))
                ],
            }
            for v in sorted(c.versions, key=lambda v: v.version_number)
        ]
        return out
