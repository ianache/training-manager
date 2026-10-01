"""Revisiones de Alembic."""

# Tablas de PDM-001 en orden de borrado (dependientes primero), sin el prefijo tb_.
TABLES = [
    "anonymization_notice_recipient",
    "anonymization_notice",
    "anonymization_setting",
    "access_identity",
    "role_level_assignment",
    "party_contact_mechanism",
    "contact_mechanism",
    "party_identification",
    "party_relationship",
    "party_role",
    "organization",
    "person",
    "party",
    "profile_platform",
    "contact_purpose_type",
    "contact_mechanism_type",
    "identification_type",
    "party_relationship_type",
    "party_role_type",
]
