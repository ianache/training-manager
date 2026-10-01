-- =====================================================================
-- 0002 · Alineación a STD-DB-001 para PostgreSQL (V003 + V004 corregidos)
--
-- Fuentes:
--   knowledge-base/architecture/data-model/ddl/migrations/portable/V003__align-std-db-001-tablas.sql
--   knowledge-base/architecture/data-model/ddl/migrations/portable/V004__align-std-db-001-constraints.sql
--
-- El esquema final es el mismo que buscan V003 y V004 (tablas tb_, columnas pk_/fk_,
-- índices idx_, constraints fk_tb_/uq_tb_). Los scripts portables NO corren tal cual
-- sobre el DDL de PostgreSQL (party-postgresql.sql). Correcciones:
--
--   C1. V003 tiene una línea suelta sin "--" ("importan bajo nuevos nombres...") que es
--       un error de sintaxis. Aquí no se copia.
--   C2. V003 no renombra tb_contact_purpose_type.mechanism_type_code, pero V004 ya usa
--       fk_contact_mechanism_type_code. Se renombra aquí (fase 3).
--   C3. V004 hace DROP CONSTRAINT + ADD CONSTRAINT. En PostgreSQL varios UNIQUE tienen
--       FK que dependen de ellos (uq_party_kind, uq_party_role_type_kind,
--       uq_identification_type_kind, uq_contact_purpose_type_mech,
--       uq_contact_mechanism_type), así que el DROP falla. Se usa
--       ALTER TABLE ... RENAME CONSTRAINT, que conserva las dependencias.
--   C4. V004 nombra las columnas generadas email_key, current_work_email_key y
--       current_role_id, y el UNIQUE uq_party_ident. No existen en PostgreSQL: el DDL
--       usa índices únicos parciales. Se renombran esos índices con el prefijo idx_
--       (STD-DB-001 §3.4 llama idx_ también a los índices únicos).
--   C5. PostgreSQL corta los identificadores a 63 caracteres. Dos nombres de V004
--       pasan de ese límite y se acortan:
--         uq_tb_contact_purpose_type_pk_code_fk_contact_mechanism_type_code
--           → uq_tb_contact_purpose_type_pk_code_fk_mechanism_type
--         uq_tb_contact_mechanism_pk_contact_mechanism_id_fk_contact_mechanism_type_code
--           → uq_tb_contact_mechanism_pk_id_fk_mechanism_type
--         uq_tb_party_identification_fk_identification_type_code_identification_number_issuing_country_code
--           → (no existe en PostgreSQL; ver C4: idx_party_identification_active_number)
--
-- Las PK y los CHECK conservan sus nombres (pk_party, ck_person_pii, ...): V003/V004
-- no los cambian.
-- =====================================================================

-- ---------------------------------------------------------------------
-- FASE 1 (V003): tablas con prefijo tb_
-- ---------------------------------------------------------------------
ALTER TABLE party_role_type RENAME TO tb_party_role_type;
ALTER TABLE party_relationship_type RENAME TO tb_party_relationship_type;
ALTER TABLE identification_type RENAME TO tb_identification_type;
ALTER TABLE contact_mechanism_type RENAME TO tb_contact_mechanism_type;
ALTER TABLE contact_purpose_type RENAME TO tb_contact_purpose_type;
ALTER TABLE profile_platform RENAME TO tb_profile_platform;
ALTER TABLE party RENAME TO tb_party;
ALTER TABLE person RENAME TO tb_person;
ALTER TABLE organization RENAME TO tb_organization;
ALTER TABLE party_role RENAME TO tb_party_role;
ALTER TABLE party_relationship RENAME TO tb_party_relationship;
ALTER TABLE party_identification RENAME TO tb_party_identification;
ALTER TABLE contact_mechanism RENAME TO tb_contact_mechanism;
ALTER TABLE party_contact_mechanism RENAME TO tb_party_contact_mechanism;
ALTER TABLE role_level_assignment RENAME TO tb_role_level_assignment;
ALTER TABLE access_identity RENAME TO tb_access_identity;
ALTER TABLE anonymization_setting RENAME TO tb_anonymization_setting;
ALTER TABLE anonymization_notice RENAME TO tb_anonymization_notice;
ALTER TABLE anonymization_notice_recipient RENAME TO tb_anonymization_notice_recipient;

-- ---------------------------------------------------------------------
-- FASE 2 (V003): columnas PK con prefijo pk_
-- ---------------------------------------------------------------------
ALTER TABLE tb_party_role_type RENAME COLUMN code TO pk_code;
ALTER TABLE tb_party_relationship_type RENAME COLUMN code TO pk_code;
ALTER TABLE tb_identification_type RENAME COLUMN code TO pk_code;
ALTER TABLE tb_contact_mechanism_type RENAME COLUMN code TO pk_code;
ALTER TABLE tb_contact_purpose_type RENAME COLUMN code TO pk_code;
ALTER TABLE tb_profile_platform RENAME COLUMN code TO pk_code;

ALTER TABLE tb_party RENAME COLUMN party_id TO pk_party_id;
ALTER TABLE tb_person RENAME COLUMN party_id TO pk_party_id;
ALTER TABLE tb_organization RENAME COLUMN party_id TO pk_party_id;
ALTER TABLE tb_party_role RENAME COLUMN party_role_id TO pk_party_role_id;
ALTER TABLE tb_party_relationship RENAME COLUMN party_relationship_id TO pk_party_relationship_id;
ALTER TABLE tb_party_identification RENAME COLUMN party_identification_id TO pk_party_identification_id;
ALTER TABLE tb_contact_mechanism RENAME COLUMN contact_mechanism_id TO pk_contact_mechanism_id;
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN party_contact_mechanism_id TO pk_party_contact_mechanism_id;
ALTER TABLE tb_role_level_assignment RENAME COLUMN role_level_assignment_id TO pk_role_level_assignment_id;
ALTER TABLE tb_access_identity RENAME COLUMN person_party_id TO pk_person_party_id;
ALTER TABLE tb_anonymization_setting RENAME COLUMN setting_key TO pk_setting_key;
ALTER TABLE tb_anonymization_notice RENAME COLUMN anonymization_notice_id TO pk_anonymization_notice_id;

-- ---------------------------------------------------------------------
-- FASE 3 (V003 + C2): columnas FK con prefijo fk_
-- ---------------------------------------------------------------------
ALTER TABLE tb_contact_purpose_type RENAME COLUMN mechanism_type_code TO fk_contact_mechanism_type_code;  -- C2

ALTER TABLE tb_party_role RENAME COLUMN party_id TO fk_party_id;
ALTER TABLE tb_party_role RENAME COLUMN role_type_code TO fk_party_role_type_code;

ALTER TABLE tb_party_relationship RENAME COLUMN relationship_type_code TO fk_party_relationship_type_code;
ALTER TABLE tb_party_relationship RENAME COLUMN from_party_role_id TO fk_party_role_from_id;
ALTER TABLE tb_party_relationship RENAME COLUMN to_party_role_id TO fk_party_role_to_id;

ALTER TABLE tb_party_identification RENAME COLUMN party_id TO fk_party_id;
ALTER TABLE tb_party_identification RENAME COLUMN identification_type_code TO fk_identification_type_code;

ALTER TABLE tb_contact_mechanism RENAME COLUMN mechanism_type_code TO fk_contact_mechanism_type_code;

ALTER TABLE tb_party_contact_mechanism RENAME COLUMN party_id TO fk_party_id;
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN contact_mechanism_id TO fk_contact_mechanism_id;
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN mechanism_type_code TO fk_contact_mechanism_type_code;
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN purpose_type_code TO fk_contact_purpose_type_code;
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN profile_platform_code TO fk_profile_platform_code;

ALTER TABLE tb_role_level_assignment RENAME COLUMN person_party_id TO fk_person_party_id;

ALTER TABLE tb_anonymization_notice RENAME COLUMN person_party_id TO fk_person_party_id;
ALTER TABLE tb_anonymization_notice RENAME COLUMN termination_party_role_id TO fk_party_role_id;

ALTER TABLE tb_anonymization_notice_recipient RENAME COLUMN anonymization_notice_id TO fk_anonymization_notice_id;
ALTER TABLE tb_anonymization_notice_recipient RENAME COLUMN recipient_party_id TO fk_person_party_id;
ALTER TABLE tb_anonymization_notice_recipient RENAME COLUMN contact_mechanism_id TO fk_contact_mechanism_id;

-- ---------------------------------------------------------------------
-- FASE 4 (V003 + C4): índices con prefijo idx_
-- ---------------------------------------------------------------------
ALTER INDEX ix_party_role_party RENAME TO idx_party_role_fk_party_id_fk_party_role_type_code;
ALTER INDEX ix_party_rel_from RENAME TO idx_party_relationship_fk_party_role_from_id;
ALTER INDEX ix_party_rel_to RENAME TO idx_party_relationship_fk_party_role_to_id;
ALTER INDEX ix_party_ident_party RENAME TO idx_party_identification_fk_party_id;
ALTER INDEX ix_pcm_party RENAME TO idx_party_contact_mechanism_fk_party_id;
ALTER INDEX ix_pcm_mechanism RENAME TO idx_party_contact_mechanism_fk_contact_mechanism_id;
-- Índices propios del DDL de PostgreSQL (C4)
ALTER INDEX ux_party_ident_active RENAME TO idx_party_identification_active_number;
ALTER INDEX ux_contact_mechanism_email_active RENAME TO idx_contact_mechanism_email_active;
ALTER INDEX ux_pcm_current_work_email RENAME TO idx_party_contact_mechanism_current_work_email;
ALTER INDEX ux_rla_current_role RENAME TO idx_role_level_assignment_current_role;
ALTER INDEX ix_rla_person RENAME TO idx_role_level_assignment_fk_person_party_id;
ALTER INDEX ix_anon_notice_person RENAME TO idx_anonymization_notice_fk_person_party_id;

-- ---------------------------------------------------------------------
-- FASE 6 (V004 + C3): FOREIGN KEY
-- ---------------------------------------------------------------------
ALTER TABLE tb_person RENAME CONSTRAINT fk_person_party TO fk_tb_person_tb_party;
ALTER TABLE tb_organization RENAME CONSTRAINT fk_organization_party TO fk_tb_organization_tb_party;
ALTER TABLE tb_party_role RENAME CONSTRAINT fk_party_role_party TO fk_tb_party_role_tb_party;
ALTER TABLE tb_party_role RENAME CONSTRAINT fk_party_role_type TO fk_tb_party_role_tb_party_role_type;
ALTER TABLE tb_party_relationship RENAME CONSTRAINT fk_party_rel_type TO fk_tb_party_relationship_tb_party_relationship_type;
ALTER TABLE tb_party_relationship RENAME CONSTRAINT fk_party_rel_from TO fk_tb_party_relationship_from_tb_party_role;
ALTER TABLE tb_party_relationship RENAME CONSTRAINT fk_party_rel_to TO fk_tb_party_relationship_to_tb_party_role;
ALTER TABLE tb_party_identification RENAME CONSTRAINT fk_party_ident_party TO fk_tb_party_identification_tb_party;
ALTER TABLE tb_party_identification RENAME CONSTRAINT fk_party_ident_type TO fk_tb_party_identification_tb_identification_type;
ALTER TABLE tb_contact_purpose_type RENAME CONSTRAINT fk_contact_purpose_type_mech TO fk_tb_contact_purpose_type_tb_contact_mechanism_type;
ALTER TABLE tb_contact_mechanism RENAME CONSTRAINT fk_contact_mechanism_type TO fk_tb_contact_mechanism_tb_contact_mechanism_type;
ALTER TABLE tb_party_contact_mechanism RENAME CONSTRAINT fk_pcm_party TO fk_tb_party_contact_mechanism_tb_party;
ALTER TABLE tb_party_contact_mechanism RENAME CONSTRAINT fk_pcm_mechanism TO fk_tb_party_contact_mechanism_tb_contact_mechanism;
ALTER TABLE tb_party_contact_mechanism RENAME CONSTRAINT fk_pcm_purpose TO fk_tb_party_contact_mechanism_tb_contact_purpose_type;
ALTER TABLE tb_party_contact_mechanism RENAME CONSTRAINT fk_pcm_platform TO fk_tb_party_contact_mechanism_tb_profile_platform;
ALTER TABLE tb_role_level_assignment RENAME CONSTRAINT fk_rla_person TO fk_tb_role_level_assignment_tb_person;
ALTER TABLE tb_access_identity RENAME CONSTRAINT fk_access_identity_person TO fk_tb_access_identity_tb_person;
ALTER TABLE tb_anonymization_notice RENAME CONSTRAINT fk_anon_notice_person TO fk_tb_anonymization_notice_tb_person;
ALTER TABLE tb_anonymization_notice RENAME CONSTRAINT fk_anon_notice_role TO fk_tb_anonymization_notice_tb_party_role;
ALTER TABLE tb_anonymization_notice_recipient RENAME CONSTRAINT fk_anon_rcpt_notice TO fk_tb_anonymization_notice_recipient_tb_anonymization_notice;
ALTER TABLE tb_anonymization_notice_recipient RENAME CONSTRAINT fk_anon_rcpt_person TO fk_tb_anonymization_notice_recipient_tb_person;
ALTER TABLE tb_anonymization_notice_recipient RENAME CONSTRAINT fk_anon_rcpt_mech TO fk_tb_anonymization_notice_recipient_tb_contact_mechanism;

-- ---------------------------------------------------------------------
-- FASE 7 (V004 + C3, C4, C5): UNIQUE
-- ---------------------------------------------------------------------
ALTER TABLE tb_party_role_type RENAME CONSTRAINT uq_party_role_type_kind TO uq_tb_party_role_type_pk_code_applies_to_kind;
ALTER TABLE tb_identification_type RENAME CONSTRAINT uq_identification_type_kind TO uq_tb_identification_type_pk_code_applies_to_kind;
ALTER TABLE tb_contact_purpose_type RENAME CONSTRAINT uq_contact_purpose_type_mech TO uq_tb_contact_purpose_type_pk_code_fk_mechanism_type;  -- C5
ALTER TABLE tb_party RENAME CONSTRAINT uq_party_kind TO uq_tb_party_pk_party_id_party_kind;
ALTER TABLE tb_person RENAME CONSTRAINT uq_person_employee_code TO uq_tb_person_employee_code;
ALTER TABLE tb_contact_mechanism RENAME CONSTRAINT uq_contact_mechanism_type TO uq_tb_contact_mechanism_pk_id_fk_mechanism_type;  -- C5
ALTER TABLE tb_access_identity RENAME CONSTRAINT uq_access_identity_keycloak TO uq_tb_access_identity_keycloak_user_id;
ALTER TABLE tb_anonymization_notice RENAME CONSTRAINT uq_anon_notice_termination TO uq_tb_anonymization_notice_fk_party_role_id;
-- uq_contact_mechanism_email, uq_party_ident, uq_pcm_current_work_email, uq_rla_current_role:
-- no existen en PostgreSQL; sus equivalentes son los índices parciales de la fase 4 (C4).
