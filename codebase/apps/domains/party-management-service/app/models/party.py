from sqlalchemy import Column, String, DateTime, UUID, Index
from uuid import uuid4
from datetime import datetime
from app.models.base import Base
from typing import Optional


class Party(Base):
    __tablename__ = "tb_party"

    pk_party_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    code = Column(String(20), unique=True, nullable=False, index=True)
    first_names = Column(String(100), nullable=False)
    last_names = Column(String(100), nullable=False)
    preferred_name = Column(String(100), nullable=True)

    identification_type = Column(String(20), nullable=True)
    identification_number = Column(String(30), nullable=True)
    identification_country = Column(String(2), nullable=True)

    email_work = Column(String(255), unique=True, nullable=False, index=True)
    phone_work = Column(String(20), nullable=True)

    party_type = Column(String(20), nullable=False)
    status = Column(String(20), default="active", index=True)

    created_by = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_by = Column(String(255), nullable=True)
    updated_at = Column(DateTime, onupdate=datetime.utcnow, nullable=True)

    anonymized_at = Column(DateTime, nullable=True)
    anonymized_by = Column(String(255), nullable=True)

    __table_args__ = (
        Index("idx_tb_party_email_active", "email_work"),
        Index("idx_tb_party_status", "status"),
        Index("idx_tb_party_created_at_desc", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Party {self.code} ({self.first_names} {self.last_names})>"
