-- =====================================================================
-- PDM-001 · DDL del modelo de partes para PostgreSQL 12+ (anexo PDM-001-anexo-postgresql)
-- Derivado de party-portable.sql. Diferencias:
--   * Tiempos TIMESTAMP(6) (sin zona) con valores en UTC (SPEC-001 §6.2).
--   * DEFAULT (now() AT TIME ZONE 'UTC') en created_at de auditoría.
--   * Unicidades condicionales con índices únicos PARCIALES, sin columnas
--     generadas (employee_code_key, email_key, current_work_email_key,
--     current_role_id no existen en este motor).
--   * Índice de correo por LOWER(contact_value) (PostgreSQL distingue mayúsculas).
-- Estado: draft. Generado por data-model-designer/1.0. Ejecución: ver TST-001.
-- =====================================================================
SET TIME ZONE 'UTC';

-- ---------------------------------------------------------------------
-- Catálogos de tipos ampliables (SPEC-001 §6.1 "tablas ampliables")
-- ---------------------------------------------------------------------
CREATE TABLE party_role_type (
  code             VARCHAR(40)  NOT NULL,
  name             VARCHAR(100) NOT NULL,
  applies_to_kind  VARCHAR(12)  NOT NULL,
  CONSTRAINT pk_party_role_type PRIMARY KEY (code),
  CONSTRAINT uq_party_role_type_kind UNIQUE (code, applies_to_kind),
  CONSTRAINT ck_party_role_type_kind CHECK (applies_to_kind IN ('PERSON', 'ORGANIZATION'))
);

CREATE TABLE party_relationship_type (
  code  VARCHAR(40)  NOT NULL,
  name  VARCHAR(100) NOT NULL,
  CONSTRAINT pk_party_relationship_type PRIMARY KEY (code)
);

CREATE TABLE identification_type (
  code             VARCHAR(40)  NOT NULL,
  name             VARCHAR(100) NOT NULL,
  applies_to_kind  VARCHAR(12)  NOT NULL,
  CONSTRAINT pk_identification_type PRIMARY KEY (code),
  CONSTRAINT uq_identification_type_kind UNIQUE (code, applies_to_kind),
  CONSTRAINT ck_identification_type_kind CHECK (applies_to_kind IN ('PERSON', 'ORGANIZATION'))
);

CREATE TABLE contact_mechanism_type (
  code  VARCHAR(40)  NOT NULL,
  name  VARCHAR(100) NOT NULL,
  CONSTRAINT pk_contact_mechanism_type PRIMARY KEY (code)
);

CREATE TABLE contact_purpose_type (
  code                 VARCHAR(40)  NOT NULL,
  name                 VARCHAR(100) NOT NULL,
  mechanism_type_code  VARCHAR(40)  NOT NULL,
  CONSTRAINT pk_contact_purpose_type PRIMARY KEY (code),
  CONSTRAINT uq_contact_purpose_type_mech UNIQUE (code, mechanism_type_code),
  CONSTRAINT fk_contact_purpose_type_mech FOREIGN KEY (mechanism_type_code)
    REFERENCES contact_mechanism_type (code)
);

CREATE TABLE profile_platform (
  code  VARCHAR(40)  NOT NULL,
  name  VARCHAR(100) NOT NULL,
  CONSTRAINT pk_profile_platform PRIMARY KEY (code)
);

-- ---------------------------------------------------------------------
-- PARTY y subtipos (BR-PTY-02)
-- ---------------------------------------------------------------------
CREATE TABLE party (
  party_id    CHAR(36)     NOT NULL,
  party_kind  VARCHAR(12)  NOT NULL,
  created_at  TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by  VARCHAR(36)  NOT NULL,
  updated_at  TIMESTAMP(6) NULL,
  updated_by  VARCHAR(36)  NULL,
  CONSTRAINT pk_party PRIMARY KEY (party_id),
  CONSTRAINT uq_party_kind UNIQUE (party_id, party_kind),
  CONSTRAINT ck_party_kind CHECK (party_kind IN ('PERSON', 'ORGANIZATION'))
);

CREATE TABLE person (
  party_id           CHAR(36)     NOT NULL,
  party_kind         VARCHAR(12)  NOT NULL DEFAULT 'PERSON',
  employee_code      VARCHAR(20)  NOT NULL,            -- BR-PTY-06, D9, D16 (no se anonimiza)
  given_names        VARCHAR(100) NULL,                -- PII: NULL tras anonimizar
  family_names       VARCHAR(100) NULL,                -- PII
  preferred_name     VARCHAR(100) NULL,                -- PII, opcional
  anonymized_at      TIMESTAMP(6) NULL,                -- D14
  anonymized_by      VARCHAR(36)  NULL,                -- D14, D16 (referencia de auditoría)
  created_at         TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by         VARCHAR(36)  NOT NULL,
  updated_at         TIMESTAMP(6) NULL,
  updated_by         VARCHAR(36)  NULL,
  CONSTRAINT pk_person PRIMARY KEY (party_id),
  CONSTRAINT fk_person_party FOREIGN KEY (party_id, party_kind) REFERENCES party (party_id, party_kind),
  CONSTRAINT ck_person_kind CHECK (party_kind = 'PERSON'),
  CONSTRAINT ck_person_anon_by CHECK ((anonymized_at IS NULL AND anonymized_by IS NULL)
                                   OR (anonymized_at IS NOT NULL AND anonymized_by IS NOT NULL)),
  CONSTRAINT ck_person_pii CHECK (
       (anonymized_at IS NULL AND given_names IS NOT NULL AND family_names IS NOT NULL)
    OR (anonymized_at IS NOT NULL AND given_names IS NULL AND family_names IS NULL AND preferred_name IS NULL))
);

CREATE TABLE organization (
  party_id           CHAR(36)     NOT NULL,
  party_kind         VARCHAR(12)  NOT NULL DEFAULT 'ORGANIZATION',
  organization_name  VARCHAR(200) NOT NULL,
  created_at         TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by         VARCHAR(36)  NOT NULL,
  updated_at         TIMESTAMP(6) NULL,
  updated_by         VARCHAR(36)  NULL,
  CONSTRAINT pk_organization PRIMARY KEY (party_id),
  CONSTRAINT fk_organization_party FOREIGN KEY (party_id, party_kind) REFERENCES party (party_id, party_kind),
  CONSTRAINT ck_organization_kind CHECK (party_kind = 'ORGANIZATION')
);

-- ---------------------------------------------------------------------
-- Roles y relaciones con vigencia (BR-PTY-02..04, BR-PTY-12, BR-PTY-13)
-- ---------------------------------------------------------------------
CREATE TABLE party_role (
  party_role_id     CHAR(36)     NOT NULL,
  party_id          CHAR(36)     NOT NULL,
  party_kind        VARCHAR(12)  NOT NULL,
  role_type_code    VARCHAR(40)  NOT NULL,
  from_date         DATE         NOT NULL,
  thru_date         DATE         NULL,
  thru_recorded_at  TIMESTAMP(6) NULL,                 -- D17: instante en que se registra la baja/cierre
  thru_recorded_by  VARCHAR(36)  NULL,
  created_at        TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by        VARCHAR(36)  NOT NULL,
  CONSTRAINT pk_party_role PRIMARY KEY (party_role_id),
  CONSTRAINT fk_party_role_party FOREIGN KEY (party_id, party_kind) REFERENCES party (party_id, party_kind),
  CONSTRAINT fk_party_role_type FOREIGN KEY (role_type_code, party_kind)
    REFERENCES party_role_type (code, applies_to_kind),
  CONSTRAINT ck_party_role_dates CHECK (thru_date IS NULL OR thru_date >= from_date),
  CONSTRAINT ck_party_role_thru_rec CHECK (
       (thru_date IS NULL AND thru_recorded_at IS NULL AND thru_recorded_by IS NULL)
    OR (thru_date IS NOT NULL AND thru_recorded_at IS NOT NULL AND thru_recorded_by IS NOT NULL))
);
CREATE INDEX ix_party_role_party ON party_role (party_id, role_type_code);

CREATE TABLE party_relationship (
  party_relationship_id   CHAR(36)     NOT NULL,
  relationship_type_code  VARCHAR(40)  NOT NULL,
  from_party_role_id      CHAR(36)     NOT NULL,
  to_party_role_id        CHAR(36)     NOT NULL,
  from_date               DATE         NOT NULL,
  thru_date               DATE         NULL,
  created_at              TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by              VARCHAR(36)  NOT NULL,
  updated_at              TIMESTAMP(6) NULL,
  updated_by              VARCHAR(36)  NULL,
  CONSTRAINT pk_party_relationship PRIMARY KEY (party_relationship_id),
  CONSTRAINT fk_party_rel_type FOREIGN KEY (relationship_type_code) REFERENCES party_relationship_type (code),
  CONSTRAINT fk_party_rel_from FOREIGN KEY (from_party_role_id) REFERENCES party_role (party_role_id),
  CONSTRAINT fk_party_rel_to   FOREIGN KEY (to_party_role_id)   REFERENCES party_role (party_role_id),
  CONSTRAINT ck_party_rel_distinct CHECK (from_party_role_id <> to_party_role_id),
  CONSTRAINT ck_party_rel_dates CHECK (thru_date IS NULL OR thru_date >= from_date)
);
CREATE INDEX ix_party_rel_from ON party_relationship (from_party_role_id);
CREATE INDEX ix_party_rel_to   ON party_relationship (to_party_role_id);

-- ---------------------------------------------------------------------
-- Identificación (BR-PTY-07, BR-PTY-14)
-- ---------------------------------------------------------------------
CREATE TABLE party_identification (
  party_identification_id    CHAR(36)     NOT NULL,
  party_id                   CHAR(36)     NOT NULL,
  party_kind                 VARCHAR(12)  NOT NULL,
  identification_type_code   VARCHAR(40)  NOT NULL,
  identification_number      VARCHAR(20)  NULL,        -- PII: NULL tras anonimizar
  issuing_country_code       CHAR(2)      NOT NULL,    -- ISO 3166-1 alfa-2 (supuesto A-04)
  anonymized_at              TIMESTAMP(6) NULL,
  created_at                 TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by                 VARCHAR(36)  NOT NULL,
  updated_at                 TIMESTAMP(6) NULL,
  updated_by                 VARCHAR(36)  NULL,
  CONSTRAINT pk_party_identification PRIMARY KEY (party_identification_id),
  CONSTRAINT fk_party_ident_party FOREIGN KEY (party_id, party_kind) REFERENCES party (party_id, party_kind),
  CONSTRAINT fk_party_ident_type FOREIGN KEY (identification_type_code, party_kind)
    REFERENCES identification_type (code, applies_to_kind),
  CONSTRAINT ck_party_ident_pii CHECK (
       (anonymized_at IS NULL AND identification_number IS NOT NULL)
    OR (anonymized_at IS NOT NULL AND identification_number IS NULL))
);
CREATE INDEX ix_party_ident_party ON party_identification (party_id);

-- ---------------------------------------------------------------------
-- Medios de contacto (BR-PTY-08, BR-PTY-09, D8, D13)
-- ---------------------------------------------------------------------
CREATE TABLE contact_mechanism (
  contact_mechanism_id  CHAR(36)     NOT NULL,
  mechanism_type_code   VARCHAR(40)  NOT NULL,
  contact_value         VARCHAR(500) NULL,             -- PII: NULL tras anonimizar
  anonymized_at         TIMESTAMP(6) NULL,
  created_at            TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by            VARCHAR(36)  NOT NULL,
  updated_at            TIMESTAMP(6) NULL,
  updated_by            VARCHAR(36)  NULL,
  CONSTRAINT pk_contact_mechanism PRIMARY KEY (contact_mechanism_id),
  CONSTRAINT uq_contact_mechanism_type UNIQUE (contact_mechanism_id, mechanism_type_code),
  CONSTRAINT fk_contact_mechanism_type FOREIGN KEY (mechanism_type_code) REFERENCES contact_mechanism_type (code),
  CONSTRAINT ck_contact_mechanism_pii CHECK (
       (anonymized_at IS NULL AND contact_value IS NOT NULL)
    OR (anonymized_at IS NOT NULL AND contact_value IS NULL))
);

CREATE TABLE party_contact_mechanism (
  party_contact_mechanism_id  CHAR(36)     NOT NULL,
  party_id                    CHAR(36)     NOT NULL,
  contact_mechanism_id        CHAR(36)     NOT NULL,
  mechanism_type_code         VARCHAR(40)  NOT NULL,
  purpose_type_code           VARCHAR(40)  NOT NULL,
  profile_platform_code       VARCHAR(40)  NULL,
  from_date                   DATE         NOT NULL,
  thru_date                   DATE         NULL,
  created_at                  TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by                  VARCHAR(36)  NOT NULL,
  CONSTRAINT pk_party_contact_mechanism PRIMARY KEY (party_contact_mechanism_id),
  CONSTRAINT fk_pcm_party FOREIGN KEY (party_id) REFERENCES party (party_id),
  CONSTRAINT fk_pcm_mechanism FOREIGN KEY (contact_mechanism_id, mechanism_type_code)
    REFERENCES contact_mechanism (contact_mechanism_id, mechanism_type_code),
  CONSTRAINT fk_pcm_purpose FOREIGN KEY (purpose_type_code, mechanism_type_code)
    REFERENCES contact_purpose_type (code, mechanism_type_code),
  CONSTRAINT fk_pcm_platform FOREIGN KEY (profile_platform_code) REFERENCES profile_platform (code),
  CONSTRAINT ck_pcm_platform CHECK (
       (purpose_type_code = 'PROFESSIONAL_PROFILE' AND profile_platform_code IS NOT NULL)
    OR (purpose_type_code <> 'PROFESSIONAL_PROFILE' AND profile_platform_code IS NULL)),
  CONSTRAINT ck_pcm_dates CHECK (thru_date IS NULL OR thru_date >= from_date)
);
CREATE INDEX ix_pcm_party ON party_contact_mechanism (party_id);
CREATE INDEX ix_pcm_mechanism ON party_contact_mechanism (contact_mechanism_id);

-- ---------------------------------------------------------------------
-- Asignación de Rol-Nivel (BR-PTY-11, D5, D6)
-- catalog_role_id / catalog_role_level_id pertenecen al catálogo (otro
-- microservicio, ADR-001): referencia lógica sin FK física (DM-07).
-- ---------------------------------------------------------------------
CREATE TABLE role_level_assignment (
  role_level_assignment_id  CHAR(36)     NOT NULL,
  person_party_id           CHAR(36)     NOT NULL,
  catalog_role_id           CHAR(36)     NOT NULL,
  catalog_role_level_id     CHAR(36)     NOT NULL,
  from_date                 DATE         NOT NULL,
  thru_date                 DATE         NULL,
  created_at                TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by                VARCHAR(36)  NOT NULL,
  updated_at                TIMESTAMP(6) NULL,
  updated_by                VARCHAR(36)  NULL,
  CONSTRAINT pk_role_level_assignment PRIMARY KEY (role_level_assignment_id),
  CONSTRAINT fk_rla_person FOREIGN KEY (person_party_id) REFERENCES person (party_id),
  CONSTRAINT ck_rla_dates CHECK (thru_date IS NULL OR thru_date >= from_date)
);

-- ---------------------------------------------------------------------
-- Identidad de acceso (BR-PTY-16, D4)
-- ---------------------------------------------------------------------
CREATE TABLE access_identity (
  person_party_id   CHAR(36)     NOT NULL,
  keycloak_user_id  VARCHAR(255) NULL,                 -- PII: NULL tras anonimizar
  anonymized_at     TIMESTAMP(6) NULL,
  created_at        TIMESTAMP(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
  created_by        VARCHAR(36)  NOT NULL,
  updated_at        TIMESTAMP(6) NULL,
  updated_by        VARCHAR(36)  NULL,
  CONSTRAINT pk_access_identity PRIMARY KEY (person_party_id),
  CONSTRAINT fk_access_identity_person FOREIGN KEY (person_party_id) REFERENCES person (party_id),
  CONSTRAINT ck_access_identity_pii CHECK (
       (anonymized_at IS NULL AND keycloak_user_id IS NOT NULL)
    OR (anonymized_at IS NOT NULL AND keycloak_user_id IS NULL)),
  CONSTRAINT uq_access_identity_keycloak UNIQUE (keycloak_user_id)
);

-- ---------------------------------------------------------------------
-- Anonimización: parámetro y avisos (BR-PTY-14, BR-PTY-15, D15, D17, D18, D23)
-- ---------------------------------------------------------------------
CREATE TABLE anonymization_setting (
  setting_key        CHAR(1)      NOT NULL DEFAULT 'X', -- fila única (supuesto A-08)
  notice_after_days  INT          NOT NULL,
  updated_at         TIMESTAMP(6) NOT NULL,
  updated_by         VARCHAR(36)  NOT NULL,
  CONSTRAINT pk_anonymization_setting PRIMARY KEY (setting_key),
  CONSTRAINT ck_anon_setting_singleton CHECK (setting_key = 'X'),
  CONSTRAINT ck_anon_setting_days CHECK (notice_after_days > 0)
);

CREATE TABLE anonymization_notice (
  anonymization_notice_id    CHAR(36)     NOT NULL,
  person_party_id            CHAR(36)     NOT NULL,
  termination_party_role_id  CHAR(36)     NOT NULL,     -- rol Empleado/Contratista cuya baja inicia el plazo
  termination_recorded_at    TIMESTAMP(6) NOT NULL,     -- D17
  due_at                     TIMESTAMP(6) NOT NULL,
  generated_at               TIMESTAMP(6) NOT NULL,
  notice_status              VARCHAR(12)  NOT NULL,
  send_status                VARCHAR(12)  NOT NULL,
  send_attempts              INT          NOT NULL DEFAULT 0,
  last_attempt_at            TIMESTAMP(6) NULL,
  attended_at                TIMESTAMP(6) NULL,
  attended_by                VARCHAR(36)  NULL,
  CONSTRAINT pk_anonymization_notice PRIMARY KEY (anonymization_notice_id),
  CONSTRAINT fk_anon_notice_person FOREIGN KEY (person_party_id) REFERENCES person (party_id),
  CONSTRAINT fk_anon_notice_role FOREIGN KEY (termination_party_role_id) REFERENCES party_role (party_role_id),
  CONSTRAINT uq_anon_notice_termination UNIQUE (termination_party_role_id),
  CONSTRAINT ck_anon_notice_status CHECK (notice_status IN ('PENDING', 'ATTENDED')),
  CONSTRAINT ck_anon_notice_send CHECK (send_status IN ('PENDING', 'SENT', 'FAILED', 'RETRYING', 'NOT_SENT')),
  CONSTRAINT ck_anon_notice_attempts CHECK (send_attempts >= 0),
  CONSTRAINT ck_anon_notice_due CHECK (due_at >= termination_recorded_at),
  CONSTRAINT ck_anon_notice_attended CHECK (
       (notice_status = 'PENDING'  AND attended_at IS NULL AND attended_by IS NULL)
    OR (notice_status = 'ATTENDED' AND attended_at IS NOT NULL AND attended_by IS NOT NULL))
);

CREATE TABLE anonymization_notice_recipient (
  anonymization_notice_id  CHAR(36) NOT NULL,
  recipient_party_id       CHAR(36) NOT NULL,          -- persona con rol vigente de Jefe de Ingeniería (D18, D20)
  contact_mechanism_id     CHAR(36) NOT NULL,          -- su correo vigente
  CONSTRAINT pk_anon_notice_recipient PRIMARY KEY (anonymization_notice_id, recipient_party_id, contact_mechanism_id),
  CONSTRAINT fk_anon_rcpt_notice FOREIGN KEY (anonymization_notice_id) REFERENCES anonymization_notice (anonymization_notice_id),
  CONSTRAINT fk_anon_rcpt_person FOREIGN KEY (recipient_party_id) REFERENCES person (party_id),
  CONSTRAINT fk_anon_rcpt_mech FOREIGN KEY (contact_mechanism_id) REFERENCES contact_mechanism (contact_mechanism_id)
);

-- ---------------------------------------------------------------------
-- Datos semilla de los tipos (SPEC-001 §3, §4; BR-PTY-03, 04, 07, 09)
-- ---------------------------------------------------------------------
INSERT INTO party_role_type (code, name, applies_to_kind) VALUES
  ('EMPLOYEE',              'Empleado',               'PERSON'),
  ('CONTRACTOR',            'Contratista',            'PERSON'),
  ('EVALUATOR',             'Evaluador',              'PERSON'),
  ('ENGINEERING_HEAD',      'Jefe de Ingeniería',     'PERSON'),
  ('INTERNAL_ORGANIZATION', 'Organización interna',   'ORGANIZATION'),
  ('ORGANIZATIONAL_UNIT',   'Unidad organizacional',  'ORGANIZATION'),
  ('SUPPLIER',              'Proveedor',              'ORGANIZATION');

INSERT INTO party_relationship_type (code, name) VALUES
  ('EMPLOYMENT',    'Empleo (empleado - organización interna)'),
  ('CONTRACTING',   'Contratación (contratista - proveedor)'),
  ('MEMBERSHIP',    'Pertenencia (persona - unidad)'),
  ('ORG_STRUCTURE', 'Estructura (unidad - unidad padre)'),
  ('REPORTING',     'Reporte (persona - jefe directo)');

INSERT INTO identification_type (code, name, applies_to_kind) VALUES
  ('DNI',      'Documento Nacional de Identidad', 'PERSON'),
  ('CE',       'Carné de extranjería',            'PERSON'),
  ('PASSPORT', 'Pasaporte',                       'PERSON'),
  ('RUC',      'Registro Único de Contribuyentes','ORGANIZATION');

INSERT INTO contact_mechanism_type (code, name) VALUES
  ('EMAIL', 'Correo electrónico'),
  ('PHONE', 'Teléfono'),
  ('URL',   'URL');

INSERT INTO contact_purpose_type (code, name, mechanism_type_code) VALUES
  ('WORK_EMAIL',           'Correo laboral',                 'EMAIL'),
  ('WORK_PHONE',           'Teléfono laboral',               'PHONE'),
  ('PROFESSIONAL_PROFILE', 'Perfil profesional en línea',    'URL');

INSERT INTO profile_platform (code, name) VALUES
  ('LINKEDIN', 'LinkedIn'),
  ('GITHUB',   'GitHub'),
  ('OTHER',    'Otro');

-- ---------------------------------------------------------------------
-- Unicidades condicionales con índices parciales (equivalen a las
-- columnas generadas + UNIQUE del DDL portable)
-- ---------------------------------------------------------------------
-- BR-PTY-06 + BR-PTY-14: código único entre personas no anonimizadas
CREATE UNIQUE INDEX ux_person_employee_code_active
  ON person (employee_code) WHERE anonymized_at IS NULL;
-- BR-PTY-07 + BR-PTY-14: identificación única por tipo, número y país, sin anonimizadas
CREATE UNIQUE INDEX ux_party_ident_active
  ON party_identification (identification_type_code, identification_number, issuing_country_code)
  WHERE anonymized_at IS NULL;
-- DM-05: una dirección de correo es un único medio (sin distinguir mayúsculas)
CREATE UNIQUE INDEX ux_contact_mechanism_email_active
  ON contact_mechanism (LOWER(contact_value))
  WHERE mechanism_type_code = 'EMAIL' AND anonymized_at IS NULL;
-- BR-PTY-08: un correo laboral vigente pertenece a una sola parte
CREATE UNIQUE INDEX ux_pcm_current_work_email
  ON party_contact_mechanism (contact_mechanism_id)
  WHERE purpose_type_code = 'WORK_EMAIL' AND thru_date IS NULL;
-- BR-PTY-11: un solo nivel vigente por rol y persona
CREATE UNIQUE INDEX ux_rla_current_role
  ON role_level_assignment (person_party_id, catalog_role_id)
  WHERE thru_date IS NULL;
-- Índices de apoyo a FK (PostgreSQL no los crea solo)
CREATE INDEX ix_rla_person ON role_level_assignment (person_party_id);
CREATE INDEX ix_anon_notice_person ON anonymization_notice (person_party_id);
