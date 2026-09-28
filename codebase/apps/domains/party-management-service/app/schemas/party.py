from pydantic import BaseModel, EmailStr, Field
from enum import Enum
from uuid import UUID
from datetime import datetime
from typing import Optional


class PartyType(str, Enum):
    EMPLOYEE = "Employee"
    CONTRACTOR = "Contractor"


class IdentificationType(str, Enum):
    DNI = "DNI"
    CE = "CE"
    PASSPORT = "Passport"


class PartyCreateRequest(BaseModel):
    first_names: str = Field(..., min_length=1, max_length=100)
    last_names: str = Field(..., min_length=1, max_length=100)
    preferred_name: Optional[str] = Field(None, max_length=100)

    identification_type: IdentificationType
    identification_number: str = Field(..., min_length=5, max_length=30)
    identification_country: str = Field(..., min_length=2, max_length=2)

    email_work: EmailStr
    phone_work: Optional[str] = Field(None, max_length=20)

    party_type: PartyType


class PartyResponseFull(BaseModel):
    id: UUID
    code: str
    first_names: str
    last_names: str
    preferred_name: Optional[str]

    identification_type: Optional[str]
    identification_number: Optional[str]
    identification_country: Optional[str]

    email_work: str
    phone_work: Optional[str]

    party_type: str
    status: str

    created_by: str
    created_at: datetime
    updated_by: Optional[str]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class PartyResponseLimited(BaseModel):
    id: UUID
    code: str
    first_names: str
    last_names: str
    preferred_name: Optional[str]

    email_work: str
    party_type: str
    status: str

    class Config:
        from_attributes = True


class PartyUpdateRequest(BaseModel):
    preferred_name: Optional[str] = None
    phone_work: Optional[str] = None
