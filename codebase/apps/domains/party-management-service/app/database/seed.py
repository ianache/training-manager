"""SOLO DESARROLLO (SEED_DEMO_DATA=true): colaboradores de ejemplo si no hay personas."""
from sqlalchemy import func, select

from app.core.logging import logger
from app.database.engine import async_session
from app.models.party import Person
from app.schemas.party import PartyCreateRequest
from app.services.party_service import PartyService

DEMO = [
    ("Ana", "Colaboradora", "Ana C.", "ana.colaboradora@example.com", "Employee", "DNI", "40000001"),
    ("Jefe", "Ingeniería", None, "jefe.ingenieria@example.com", "Employee", "DNI", "40000002"),
    ("María", "García Torres", "María García", "maria.garcia@example.com", "Employee", "DNI", "40000003"),
    ("Juan", "Pérez López", "Juan Pérez", "juan.perez@example.com", "Employee", "DNI", "40000004"),
    ("Lucía", "Ramos Vega", None, "lucia.ramos@proveedor.example.com", "Contractor", "CE", "000123456"),
]


async def seed_demo_data() -> None:
    async with async_session() as db:
        if (await db.scalar(select(func.count()).select_from(Person))) or 0:
            return
        service = PartyService(db)
        for first, last, preferred, email, kind, id_type, id_number in DEMO:
            await service.create(
                PartyCreateRequest(
                    first_names=first,
                    last_names=last,
                    preferred_name=preferred,
                    email_work=email,
                    party_type=kind,
                    identification_type=id_type,
                    identification_number=id_number,
                    identification_country="PE",
                ),
                actor="seed",
            )
        logger.info("demo_data_seeded", count=len(DEMO))
