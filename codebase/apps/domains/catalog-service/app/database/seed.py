"""
Datos de ejemplo SOLO DE DESARROLLO (SEED_DEMO_DATA=true y entorno development): competencias con su
versión 1 aprobada, rúbrica y requisitos de evidencia, y cuatro roles con los mismos ids que el antiguo
catalog-stub, para que las asignaciones de Rol-Nivel que party ya guardó sigan resolviendo.
Los textos son inventados para probar; no son contenido del negocio.
"""
import uuid

from sqlalchemy import func, select

from app.core.logging import logger
from app.database.engine import async_session
from app.models.catalog import (
    Competency,
    CompetencyVersion,
    EvidenceRequirement,
    RubricLevel,
    Role,
    RoleLevel,
    RoleLevelCompetency,
)

SEED_USER = "seed.dev"

COMPETENCIES = [
    "Diseño de APIs",
    "Pruebas automatizadas",
    "Control de versiones",
    "Componentes de interfaz",
    "Accesibilidad web",
    "Planificación de pruebas",
    "Analítica de campañas",
    "Comunicación efectiva",
]

# (rol, id del rol, [(id del nivel, nombre, [(competencia, L esperado)])])
ROLES = [
    (
        "Desarrollador Backend",
        "a1000000-0000-4000-8000-000000000001",
        [
            ("a1100000-0000-4000-8000-000000000001", "Junior", [("Control de versiones", "L1"), ("Diseño de APIs", "L1")]),
            ("a1100000-0000-4000-8000-000000000002", "Semi Senior", [("Control de versiones", "L2"), ("Diseño de APIs", "L2"), ("Pruebas automatizadas", "L2")]),
            ("a1100000-0000-4000-8000-000000000003", "Senior", [("Control de versiones", "L3"), ("Diseño de APIs", "L3"), ("Pruebas automatizadas", "L3"), ("Comunicación efectiva", "L3")]),
        ],
    ),
    (
        "Desarrollador Frontend",
        "a1000000-0000-4000-8000-000000000002",
        [
            ("a1200000-0000-4000-8000-000000000001", "Junior", [("Control de versiones", "L1"), ("Componentes de interfaz", "L1")]),
            ("a1200000-0000-4000-8000-000000000002", "Semi Senior", [("Componentes de interfaz", "L2"), ("Accesibilidad web", "L2"), ("Pruebas automatizadas", "L2")]),
            ("a1200000-0000-4000-8000-000000000003", "Senior", [("Componentes de interfaz", "L3"), ("Accesibilidad web", "L3"), ("Pruebas automatizadas", "L3"), ("Comunicación efectiva", "L3")]),
        ],
    ),
    (
        "QA Engineer",
        "a1000000-0000-4000-8000-000000000003",
        [
            ("a1300000-0000-4000-8000-000000000001", "Junior", [("Planificación de pruebas", "L1"), ("Control de versiones", "L1")]),
            ("a1300000-0000-4000-8000-000000000002", "Senior", [("Planificación de pruebas", "L3"), ("Pruebas automatizadas", "L3"), ("Comunicación efectiva", "L2")]),
        ],
    ),
    (
        "Analista de Marketing",
        "a1000000-0000-4000-8000-000000000004",
        [
            ("a1400000-0000-4000-8000-000000000001", "Analista", [("Analítica de campañas", "L1"), ("Comunicación efectiva", "L1")]),
            ("a1400000-0000-4000-8000-000000000002", "Especialista", [("Analítica de campañas", "L3"), ("Comunicación efectiva", "L2")]),
        ],
    ),
]

_REQUIREMENTS = {
    "L1": [("FORMACION", "Completar el curso introductorio", True)],
    "L2": [("FORMACION", "Completar el curso intermedio", True), ("PRACTICA_EVALUADA", "Resolver un ejercicio práctico evaluado", True)],
    "L3": [
        ("FORMACION", "Completar el curso avanzado", True),
        ("PRACTICA_EVALUADA", "Resolver un caso práctico evaluado", True),
        ("DESEMPENO_PROYECTO", "Aplicarlo en un proyecto real", False),
    ],
    "L4": [("PRACTICA_EVALUADA", "Dirigir una evaluación práctica", True), ("DESEMPENO_PROYECTO", "Liderarlo en un proyecto real", True)],
}


async def seed_demo_data() -> None:
    async with async_session() as db:
        if await db.scalar(select(func.count()).select_from(Role)) or await db.scalar(select(func.count()).select_from(Competency)):
            return
        versions: dict[str, tuple[str, str]] = {}
        for name in COMPETENCIES:
            cid, vid = str(uuid.uuid4()), str(uuid.uuid4())
            versions[name] = (cid, vid)
            db.add(Competency(id=cid, name=name, description="Dato de ejemplo (solo desarrollo).", status="ACTIVE", row_version=1, created_by=SEED_USER))
            await db.flush()
            db.add(
                CompetencyVersion(id=vid, competency_id=cid, version_number=1, status="APPROVED", approved_at=func.now(), approved_by=SEED_USER, row_version=1, created_by=SEED_USER)
            )
            await db.flush()
            for level, reqs in _REQUIREMENTS.items():
                db.add(RubricLevel(competency_version_id=vid, level_code=level, behavior_description=f"Comportamiento esperado en {level} (ejemplo).", created_by=SEED_USER))
                for category, description, required in reqs:
                    db.add(
                        EvidenceRequirement(id=str(uuid.uuid4()), competency_version_id=vid, level_code=level, category=category, description=description, is_required=required, created_by=SEED_USER)
                    )
        await db.flush()
        for role_name, role_id, levels in ROLES:
            db.add(Role(id=role_id, name=role_name, status="ACTIVE", row_version=1, created_by=SEED_USER))
            await db.flush()
            for ordinal, (level_id, level_name, comps) in enumerate(levels, start=1):
                db.add(RoleLevel(id=level_id, role_id=role_id, name=level_name, ordinal=ordinal, status="ACTIVE", row_version=1, created_by=SEED_USER))
                await db.flush()
                for comp_name, required_level in comps:
                    cid, vid = versions[comp_name]
                    db.add(
                        RoleLevelCompetency(role_level_id=level_id, competency_id=cid, competency_version_id=vid, required_level=required_level, created_by=SEED_USER)
                    )
        await db.commit()
        logger.info("seed_demo_data", competencies=len(COMPETENCIES), roles=len(ROLES))
