-- =====================================================================
-- V003 · Alineación de DDL a STD-DB-001 (tablas, índices, constraints)
-- Motores: MySQL 8.0.16+ y PostgreSQL 12+
-- Fuente: STD-DB-001 (naming conventions con prefijos tb_, vw_, sp_, idx_, pk_, fk_)
-- Estado: draft
-- =====================================================================

-- NOTA CRÍTICA DE COMPATIBILIDAD:
-- MySQL: ALTER TABLE ... CHANGE COLUMN (renombra y redefine tipo)
-- PostgreSQL: ALTER TABLE ... RENAME COLUMN ... (separado)
-- Este script usa sintaxis portable (RENAME COLUMN) que funciona en ambos.
-- Si MySQL 8.0.16 es más viejo que 8.0.20, usar el script mysql/V003 específico.

-- =====================================================================
-- FASE 1: Renombrar tablas (prefijo tb_)
-- =====================================================================

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

-- =====================================================================
-- FASE 2: Renombrar columnas PK (prefijo pk_)
-- =====================================================================

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

-- =====================================================================
-- FASE 3: Renombrar columnas FK (prefijo fk_)
-- =====================================================================

-- tb_party: sin FKs, solo PK

-- tb_person: party_id es PK heredada, no es FK aquí (ISA)
-- party_kind se queda como tal (no es FK, es discriminador)

-- tb_organization: idem

-- tb_party_role
ALTER TABLE tb_party_role RENAME COLUMN party_id TO fk_party_id;
ALTER TABLE tb_party_role RENAME COLUMN role_type_code TO fk_party_role_type_code;
-- party_kind se queda

-- tb_party_relationship
ALTER TABLE tb_party_relationship RENAME COLUMN relationship_type_code TO fk_party_relationship_type_code;
ALTER TABLE tb_party_relationship RENAME COLUMN from_party_role_id TO fk_party_role_from_id;
ALTER TABLE tb_party_relationship RENAME COLUMN to_party_role_id TO fk_party_role_to_id;

-- tb_party_identification
ALTER TABLE tb_party_identification RENAME COLUMN party_id TO fk_party_id;
ALTER TABLE tb_party_identification RENAME COLUMN identification_type_code TO fk_identification_type_code;
-- party_kind se queda

-- tb_contact_mechanism
ALTER TABLE tb_contact_mechanism RENAME COLUMN mechanism_type_code TO fk_contact_mechanism_type_code;

-- tb_party_contact_mechanism
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN party_id TO fk_party_id;
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN contact_mechanism_id TO fk_contact_mechanism_id;
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN mechanism_type_code TO fk_contact_mechanism_type_code;
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN purpose_type_code TO fk_contact_purpose_type_code;
ALTER TABLE tb_party_contact_mechanism RENAME COLUMN profile_platform_code TO fk_profile_platform_code;

-- tb_role_level_assignment
ALTER TABLE tb_role_level_assignment RENAME COLUMN person_party_id TO fk_person_party_id;
-- catalog_role_id y catalog_role_level_id no tienen FKs físicas (DM-07), se quedan como están

-- tb_access_identity: no hay más FKs después de renombrar PK

-- tb_anonymization_notice
ALTER TABLE tb_anonymization_notice RENAME COLUMN person_party_id TO fk_person_party_id;
ALTER TABLE tb_anonymization_notice RENAME COLUMN termination_party_role_id TO fk_party_role_id;

-- tb_anonymization_notice_recipient
ALTER TABLE tb_anonymization_notice_recipient RENAME COLUMN anonymization_notice_id TO fk_anonymization_notice_id;
ALTER TABLE tb_anonymization_notice_recipient RENAME COLUMN recipient_party_id TO fk_person_party_id;
ALTER TABLE tb_anonymization_notice_recipient RENAME COLUMN contact_mechanism_id TO fk_contact_mechanism_id;

-- =====================================================================
-- FASE 4: Renombrar índices (prefijo idx_)
-- =====================================================================

ALTER INDEX ix_party_role_party RENAME TO idx_party_role_fk_party_id_fk_party_role_type_code;
ALTER INDEX ix_party_rel_from RENAME TO idx_party_relationship_fk_party_role_from_id;
ALTER INDEX ix_party_rel_to RENAME TO idx_party_relationship_fk_party_role_to_id;
ALTER INDEX ix_party_ident_party RENAME TO idx_party_identification_fk_party_id;
ALTER INDEX ix_pcm_party RENAME TO idx_party_contact_mechanism_fk_party_id;
ALTER INDEX ix_pcm_mechanism RENAME TO idx_party_contact_mechanism_fk_contact_mechanism_id;

-- =====================================================================
-- FASE 5: Actualizar constraints (nombres derivados de nuevas columnas)
-- =====================================================================

-- Constraints PRIMARY KEY: se renombran automáticamente con las columnas
-- Constraints FOREIGN KEY: se reenumerarán en la siguiente fase
-- Constraints UNIQUE, CHECK: se revisan e

 importan bajo nuevos nombres si es necesario

-- NOTA: Esta alineación se completará en la siguiente migración (V004)
-- que actualizará explícitamente los nombres de constraints FK y UNIQUE.

-- =====================================================================
-- Fin de V003 (Phase 1: tablas, columnas, índices)
-- =====================================================================
