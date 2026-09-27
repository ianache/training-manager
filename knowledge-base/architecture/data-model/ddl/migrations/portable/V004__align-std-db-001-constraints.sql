-- =====================================================================
-- V004 · Alineación de DDL a STD-DB-001 (constraints FK, UNIQUE, CHECK)
-- Motores: MySQL 8.0.16+ y PostgreSQL 12+
-- Fuente: STD-DB-001 (naming conventions para constraints)
-- Estado: draft
-- =====================================================================

-- NOTA: Esta migración se ejecuta después de V003 (renombrado de tablas/columnas).
-- Actualiza nombres de FOREIGN KEY (patrón: fk_<tabla>_<columnas>)
-- y UNIQUE constraints (patrón: uq_<tabla>_<columnas>).

-- =====================================================================
-- Helpers: Verificación de motor (opcional, para logs informativos)
-- =====================================================================

-- MySQL: SELECT VERSION();
-- PostgreSQL: SELECT version();

-- =====================================================================
-- FASE 6: Renombrar FOREIGN KEY constraints
-- =====================================================================

-- tb_person: fk_person_party → fk_tb_person_tb_party
ALTER TABLE tb_person DROP CONSTRAINT fk_person_party;
ALTER TABLE tb_person ADD CONSTRAINT fk_tb_person_tb_party
  FOREIGN KEY (pk_party_id, party_kind) REFERENCES tb_party (pk_party_id, party_kind);

-- tb_organization: fk_organization_party → fk_tb_organization_tb_party
ALTER TABLE tb_organization DROP CONSTRAINT fk_organization_party;
ALTER TABLE tb_organization ADD CONSTRAINT fk_tb_organization_tb_party
  FOREIGN KEY (pk_party_id, party_kind) REFERENCES tb_party (pk_party_id, party_kind);

-- tb_party_role: fk_party_role_party → fk_tb_party_role_tb_party
ALTER TABLE tb_party_role DROP CONSTRAINT fk_party_role_party;
ALTER TABLE tb_party_role ADD CONSTRAINT fk_tb_party_role_tb_party
  FOREIGN KEY (fk_party_id, party_kind) REFERENCES tb_party (pk_party_id, party_kind);

-- tb_party_role: fk_party_role_type → fk_tb_party_role_tb_party_role_type
ALTER TABLE tb_party_role DROP CONSTRAINT fk_party_role_type;
ALTER TABLE tb_party_role ADD CONSTRAINT fk_tb_party_role_tb_party_role_type
  FOREIGN KEY (fk_party_role_type_code, party_kind)
  REFERENCES tb_party_role_type (pk_code, applies_to_kind);

-- tb_party_relationship: fk_party_rel_type → fk_tb_party_relationship_tb_party_relationship_type
ALTER TABLE tb_party_relationship DROP CONSTRAINT fk_party_rel_type;
ALTER TABLE tb_party_relationship ADD CONSTRAINT fk_tb_party_relationship_tb_party_relationship_type
  FOREIGN KEY (fk_party_relationship_type_code)
  REFERENCES tb_party_relationship_type (pk_code);

-- tb_party_relationship: fk_party_rel_from → fk_tb_party_relationship_from_tb_party_role
ALTER TABLE tb_party_relationship DROP CONSTRAINT fk_party_rel_from;
ALTER TABLE tb_party_relationship ADD CONSTRAINT fk_tb_party_relationship_from_tb_party_role
  FOREIGN KEY (fk_party_role_from_id)
  REFERENCES tb_party_role (pk_party_role_id);

-- tb_party_relationship: fk_party_rel_to → fk_tb_party_relationship_to_tb_party_role
ALTER TABLE tb_party_relationship DROP CONSTRAINT fk_party_rel_to;
ALTER TABLE tb_party_relationship ADD CONSTRAINT fk_tb_party_relationship_to_tb_party_role
  FOREIGN KEY (fk_party_role_to_id)
  REFERENCES tb_party_role (pk_party_role_id);

-- tb_party_identification: fk_party_ident_party → fk_tb_party_identification_tb_party
ALTER TABLE tb_party_identification DROP CONSTRAINT fk_party_ident_party;
ALTER TABLE tb_party_identification ADD CONSTRAINT fk_tb_party_identification_tb_party
  FOREIGN KEY (fk_party_id, party_kind) REFERENCES tb_party (pk_party_id, party_kind);

-- tb_party_identification: fk_party_ident_type → fk_tb_party_identification_tb_identification_type
ALTER TABLE tb_party_identification DROP CONSTRAINT fk_party_ident_type;
ALTER TABLE tb_party_identification ADD CONSTRAINT fk_tb_party_identification_tb_identification_type
  FOREIGN KEY (fk_identification_type_code, party_kind)
  REFERENCES tb_identification_type (pk_code, applies_to_kind);

-- tb_contact_purpose_type: fk_contact_purpose_type_mech → fk_tb_contact_purpose_type_tb_contact_mechanism_type
ALTER TABLE tb_contact_purpose_type DROP CONSTRAINT fk_contact_purpose_type_mech;
ALTER TABLE tb_contact_purpose_type ADD CONSTRAINT fk_tb_contact_purpose_type_tb_contact_mechanism_type
  FOREIGN KEY (fk_contact_mechanism_type_code)
  REFERENCES tb_contact_mechanism_type (pk_code);
-- NOTA: Renombrar columna mechanism_type_code → fk_contact_mechanism_type_code en V003 si no se hizo

-- tb_contact_mechanism: fk_contact_mechanism_type → fk_tb_contact_mechanism_tb_contact_mechanism_type
ALTER TABLE tb_contact_mechanism DROP CONSTRAINT fk_contact_mechanism_type;
ALTER TABLE tb_contact_mechanism ADD CONSTRAINT fk_tb_contact_mechanism_tb_contact_mechanism_type
  FOREIGN KEY (fk_contact_mechanism_type_code)
  REFERENCES tb_contact_mechanism_type (pk_code);

-- tb_party_contact_mechanism: fk_pcm_party → fk_tb_party_contact_mechanism_tb_party
ALTER TABLE tb_party_contact_mechanism DROP CONSTRAINT fk_pcm_party;
ALTER TABLE tb_party_contact_mechanism ADD CONSTRAINT fk_tb_party_contact_mechanism_tb_party
  FOREIGN KEY (fk_party_id) REFERENCES tb_party (pk_party_id);

-- tb_party_contact_mechanism: fk_pcm_mechanism → fk_tb_party_contact_mechanism_tb_contact_mechanism
ALTER TABLE tb_party_contact_mechanism DROP CONSTRAINT fk_pcm_mechanism;
ALTER TABLE tb_party_contact_mechanism ADD CONSTRAINT fk_tb_party_contact_mechanism_tb_contact_mechanism
  FOREIGN KEY (fk_contact_mechanism_id, fk_contact_mechanism_type_code)
  REFERENCES tb_contact_mechanism (pk_contact_mechanism_id, fk_contact_mechanism_type_code);

-- tb_party_contact_mechanism: fk_pcm_purpose → fk_tb_party_contact_mechanism_tb_contact_purpose_type
ALTER TABLE tb_party_contact_mechanism DROP CONSTRAINT fk_pcm_purpose;
ALTER TABLE tb_party_contact_mechanism ADD CONSTRAINT fk_tb_party_contact_mechanism_tb_contact_purpose_type
  FOREIGN KEY (fk_contact_purpose_type_code, fk_contact_mechanism_type_code)
  REFERENCES tb_contact_purpose_type (pk_code, fk_contact_mechanism_type_code);

-- tb_party_contact_mechanism: fk_pcm_platform → fk_tb_party_contact_mechanism_tb_profile_platform
ALTER TABLE tb_party_contact_mechanism DROP CONSTRAINT fk_pcm_platform;
ALTER TABLE tb_party_contact_mechanism ADD CONSTRAINT fk_tb_party_contact_mechanism_tb_profile_platform
  FOREIGN KEY (fk_profile_platform_code) REFERENCES tb_profile_platform (pk_code);

-- tb_role_level_assignment: fk_rla_person → fk_tb_role_level_assignment_tb_person
ALTER TABLE tb_role_level_assignment DROP CONSTRAINT fk_rla_person;
ALTER TABLE tb_role_level_assignment ADD CONSTRAINT fk_tb_role_level_assignment_tb_person
  FOREIGN KEY (fk_person_party_id) REFERENCES tb_person (pk_party_id);

-- tb_access_identity: fk_access_identity_person → fk_tb_access_identity_tb_person
ALTER TABLE tb_access_identity DROP CONSTRAINT fk_access_identity_person;
ALTER TABLE tb_access_identity ADD CONSTRAINT fk_tb_access_identity_tb_person
  FOREIGN KEY (pk_person_party_id) REFERENCES tb_person (pk_party_id);

-- tb_anonymization_notice: fk_anon_notice_person → fk_tb_anonymization_notice_tb_person
ALTER TABLE tb_anonymization_notice DROP CONSTRAINT fk_anon_notice_person;
ALTER TABLE tb_anonymization_notice ADD CONSTRAINT fk_tb_anonymization_notice_tb_person
  FOREIGN KEY (fk_person_party_id) REFERENCES tb_person (pk_party_id);

-- tb_anonymization_notice: fk_anon_notice_role → fk_tb_anonymization_notice_tb_party_role
ALTER TABLE tb_anonymization_notice DROP CONSTRAINT fk_anon_notice_role;
ALTER TABLE tb_anonymization_notice ADD CONSTRAINT fk_tb_anonymization_notice_tb_party_role
  FOREIGN KEY (fk_party_role_id) REFERENCES tb_party_role (pk_party_role_id);

-- tb_anonymization_notice_recipient: fk_anon_rcpt_notice → fk_tb_anonymization_notice_recipient_tb_anonymization_notice
ALTER TABLE tb_anonymization_notice_recipient DROP CONSTRAINT fk_anon_rcpt_notice;
ALTER TABLE tb_anonymization_notice_recipient ADD CONSTRAINT fk_tb_anonymization_notice_recipient_tb_anonymization_notice
  FOREIGN KEY (fk_anonymization_notice_id) REFERENCES tb_anonymization_notice (pk_anonymization_notice_id);

-- tb_anonymization_notice_recipient: fk_anon_rcpt_person → fk_tb_anonymization_notice_recipient_tb_person
ALTER TABLE tb_anonymization_notice_recipient DROP CONSTRAINT fk_anon_rcpt_person;
ALTER TABLE tb_anonymization_notice_recipient ADD CONSTRAINT fk_tb_anonymization_notice_recipient_tb_person
  FOREIGN KEY (fk_person_party_id) REFERENCES tb_person (pk_party_id);

-- tb_anonymization_notice_recipient: fk_anon_rcpt_mech → fk_tb_anonymization_notice_recipient_tb_contact_mechanism
ALTER TABLE tb_anonymization_notice_recipient DROP CONSTRAINT fk_anon_rcpt_mech;
ALTER TABLE tb_anonymization_notice_recipient ADD CONSTRAINT fk_tb_anonymization_notice_recipient_tb_contact_mechanism
  FOREIGN KEY (fk_contact_mechanism_id) REFERENCES tb_contact_mechanism (pk_contact_mechanism_id);

-- =====================================================================
-- FASE 7: Renombrar UNIQUE constraints
-- =====================================================================

-- tb_party_role_type: uq_party_role_type_kind → uq_tb_party_role_type_pk_code_applies_to_kind
ALTER TABLE tb_party_role_type DROP CONSTRAINT uq_party_role_type_kind;
ALTER TABLE tb_party_role_type ADD CONSTRAINT uq_tb_party_role_type_pk_code_applies_to_kind
  UNIQUE (pk_code, applies_to_kind);

-- tb_identification_type: uq_identification_type_kind → uq_tb_identification_type_pk_code_applies_to_kind
ALTER TABLE tb_identification_type DROP CONSTRAINT uq_identification_type_kind;
ALTER TABLE tb_identification_type ADD CONSTRAINT uq_tb_identification_type_pk_code_applies_to_kind
  UNIQUE (pk_code, applies_to_kind);

-- tb_contact_purpose_type: uq_contact_purpose_type_mech → uq_tb_contact_purpose_type_pk_code_fk_contact_mechanism_type_code
ALTER TABLE tb_contact_purpose_type DROP CONSTRAINT uq_contact_purpose_type_mech;
ALTER TABLE tb_contact_purpose_type ADD CONSTRAINT uq_tb_contact_purpose_type_pk_code_fk_contact_mechanism_type_code
  UNIQUE (pk_code, fk_contact_mechanism_type_code);

-- tb_party: uq_party_kind → uq_tb_party_pk_party_id_party_kind
ALTER TABLE tb_party DROP CONSTRAINT uq_party_kind;
ALTER TABLE tb_party ADD CONSTRAINT uq_tb_party_pk_party_id_party_kind
  UNIQUE (pk_party_id, party_kind);

-- tb_person: uq_person_employee_code → uq_tb_person_employee_code
ALTER TABLE tb_person DROP CONSTRAINT uq_person_employee_code;
ALTER TABLE tb_person ADD CONSTRAINT uq_tb_person_employee_code
  UNIQUE (employee_code);

-- tb_contact_mechanism: uq_contact_mechanism_type → uq_tb_contact_mechanism_pk_contact_mechanism_id_fk_contact_mechanism_type_code
ALTER TABLE tb_contact_mechanism DROP CONSTRAINT uq_contact_mechanism_type;
ALTER TABLE tb_contact_mechanism ADD CONSTRAINT uq_tb_contact_mechanism_pk_contact_mechanism_id_fk_contact_mechanism_type_code
  UNIQUE (pk_contact_mechanism_id, fk_contact_mechanism_type_code);

-- tb_contact_mechanism: uq_contact_mechanism_email → uq_tb_contact_mechanism_email_key
ALTER TABLE tb_contact_mechanism DROP CONSTRAINT uq_contact_mechanism_email;
ALTER TABLE tb_contact_mechanism ADD CONSTRAINT uq_tb_contact_mechanism_email_key
  UNIQUE (email_key);

-- tb_party_identification: uq_party_ident → uq_tb_party_identification_fk_identification_type_code_identification_number_issuing_country_code
ALTER TABLE tb_party_identification DROP CONSTRAINT uq_party_ident;
ALTER TABLE tb_party_identification ADD CONSTRAINT uq_tb_party_identification_fk_identification_type_code_identification_number_issuing_country_code
  UNIQUE (fk_identification_type_code, identification_number, issuing_country_code);

-- tb_party_contact_mechanism: uq_pcm_current_work_email → uq_tb_party_contact_mechanism_current_work_email_key
ALTER TABLE tb_party_contact_mechanism DROP CONSTRAINT uq_pcm_current_work_email;
ALTER TABLE tb_party_contact_mechanism ADD CONSTRAINT uq_tb_party_contact_mechanism_current_work_email_key
  UNIQUE (current_work_email_key);

-- tb_role_level_assignment: uq_rla_current_role → uq_tb_role_level_assignment_fk_person_party_id_current_role_id
ALTER TABLE tb_role_level_assignment DROP CONSTRAINT uq_rla_current_role;
ALTER TABLE tb_role_level_assignment ADD CONSTRAINT uq_tb_role_level_assignment_fk_person_party_id_current_role_id
  UNIQUE (fk_person_party_id, current_role_id);

-- tb_contact_mechanism: uq_access_identity_keycloak → uq_tb_access_identity_keycloak_user_id
ALTER TABLE tb_access_identity DROP CONSTRAINT uq_access_identity_keycloak;
ALTER TABLE tb_access_identity ADD CONSTRAINT uq_tb_access_identity_keycloak_user_id
  UNIQUE (keycloak_user_id);

-- tb_anonymization_notice: uq_anon_notice_termination → uq_tb_anonymization_notice_fk_party_role_id
ALTER TABLE tb_anonymization_notice DROP CONSTRAINT uq_anon_notice_termination;
ALTER TABLE tb_anonymization_notice ADD CONSTRAINT uq_tb_anonymization_notice_fk_party_role_id
  UNIQUE (fk_party_role_id);

-- =====================================================================
-- Fin de V004 (Phase 2: constraints FK y UNIQUE)
-- =====================================================================
