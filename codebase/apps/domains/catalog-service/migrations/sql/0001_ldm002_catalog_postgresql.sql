-- LDM-002 / catálogo de roles, niveles de rol y competencias — PostgreSQL 16 (ADR-003, ADR-007)
-- Propuesta del agente (data-model-designer): REQUIERE REVISIÓN. Convenciones de PDM-001: tb_*, pk_*/fk_*, CHAR(36), auditoría sin FK.
-- Las reglas entre filas (CHK-A..CHK-D de LDM-002 §5) NO están aquí: las aplica el servicio.

CREATE TABLE tb_competency (
    pk_competency_id CHAR(36)     PRIMARY KEY,
    name             VARCHAR(120) NOT NULL,
    description      VARCHAR(500),
    -- BR-CAT-25 y BR-CAT-27: no se elimina, solo se desactiva; estados en mayúsculas. Estado propio de la competencia, distinto del de sus versiones.
    status           VARCHAR(8)   NOT NULL DEFAULT 'ACTIVE',
    row_version      INTEGER      NOT NULL DEFAULT 1,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_by       VARCHAR(100) NOT NULL,
    updated_at       TIMESTAMPTZ,
    updated_by       VARCHAR(100),
    CONSTRAINT ck_competency_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT ck_competency_name CHECK (btrim(name) <> '')
);
-- BR-CAT-07: cada competencia existe una sola vez (unicidad por nombre, sin distinguir mayúsculas)
CREATE UNIQUE INDEX ux_competency_name ON tb_competency (lower(btrim(name)));

CREATE TABLE tb_competency_version (
    pk_competency_version_id CHAR(36)     PRIMARY KEY,
    fk_competency_id         CHAR(36)     NOT NULL REFERENCES tb_competency (pk_competency_id),
    version_number           INTEGER      NOT NULL,
    status                   VARCHAR(12)  NOT NULL DEFAULT 'DRAFT',
    approved_at              TIMESTAMPTZ,
    approved_by              VARCHAR(100),
    row_version              INTEGER      NOT NULL DEFAULT 1,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_by               VARCHAR(100) NOT NULL,
    updated_at               TIMESTAMPTZ,
    updated_by               VARCHAR(100),
    CONSTRAINT ux_competency_version UNIQUE (fk_competency_id, version_number),
    -- clave candidata para las claves foráneas compuestas (competencia, versión)
    CONSTRAINT ux_competency_version_pair UNIQUE (fk_competency_id, pk_competency_version_id),
    CONSTRAINT ck_competency_version_status CHECK (status IN ('DRAFT', 'APPROVED', 'DEPRECATED')),
    CONSTRAINT ck_competency_version_number CHECK (version_number >= 1),
    CONSTRAINT ck_competency_version_approval CHECK (
        (status = 'DRAFT' AND approved_at IS NULL AND approved_by IS NULL)
        OR (status <> 'DRAFT' AND approved_at IS NOT NULL AND approved_by IS NOT NULL)
    )
);
-- a lo sumo una versión en borrador por competencia (evita ediciones paralelas)
CREATE UNIQUE INDEX ux_competency_one_draft ON tb_competency_version (fk_competency_id) WHERE status = 'DRAFT';

-- Rúbrica (R-45, inferencia): una fila por nivel L1–L4 de una versión; la define y aprueba el Jefe de Ingeniería (BR-CAT-19)
CREATE TABLE tb_competency_rubric_level (
    fk_competency_version_id CHAR(36)     NOT NULL REFERENCES tb_competency_version (pk_competency_version_id),
    level_code               VARCHAR(2)   NOT NULL,
    behavior_description     VARCHAR(1000) NOT NULL,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_by               VARCHAR(100) NOT NULL,
    updated_at               TIMESTAMPTZ,
    updated_by               VARCHAR(100),
    PRIMARY KEY (fk_competency_version_id, level_code),
    CONSTRAINT ck_rubric_level CHECK (level_code IN ('L1', 'L2', 'L3', 'L4')),
    CONSTRAINT ck_rubric_text CHECK (btrim(behavior_description) <> '')
);

-- Requisitos de evidencia por versión y nivel (R-04, BR-ACR-07/08/12/17)
CREATE TABLE tb_evidence_requirement (
    pk_evidence_requirement_id CHAR(36)     PRIMARY KEY,
    fk_competency_version_id   CHAR(36)     NOT NULL REFERENCES tb_competency_version (pk_competency_version_id),
    level_code                 VARCHAR(2)   NOT NULL,
    category                   VARCHAR(20)  NOT NULL,
    description                VARCHAR(300) NOT NULL,
    is_required                BOOLEAN      NOT NULL,
    course_ref                 CHAR(36),      -- R-21: referencia lógica a un curso (otro dominio), sin FK
    created_at                 TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_by                 VARCHAR(100) NOT NULL,
    updated_at                 TIMESTAMPTZ,
    updated_by                 VARCHAR(100),
    CONSTRAINT ck_evidence_level CHECK (level_code IN ('L1', 'L2', 'L3', 'L4')),
    CONSTRAINT ck_evidence_category CHECK (category IN ('FORMACION', 'PRACTICA_EVALUADA', 'DESEMPENO_PROYECTO')),
    CONSTRAINT ck_evidence_course CHECK (course_ref IS NULL OR category = 'FORMACION'),
    CONSTRAINT ck_evidence_text CHECK (btrim(description) <> '')
);
CREATE INDEX ix_evidence_by_version_level ON tb_evidence_requirement (fk_competency_version_id, level_code);

CREATE TABLE tb_role (
    pk_role_id  CHAR(36)     PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    description VARCHAR(500),
    status      VARCHAR(8)   NOT NULL DEFAULT 'ACTIVE',
    row_version INTEGER      NOT NULL DEFAULT 1,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_by  VARCHAR(100) NOT NULL,
    updated_at  TIMESTAMPTZ,
    updated_by  VARCHAR(100),
    CONSTRAINT ck_role_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT ck_role_name CHECK (btrim(name) <> '')
);
CREATE UNIQUE INDEX ux_role_name ON tb_role (lower(btrim(name)));

-- Rol-Nivel (R-23, BR-CAT-09): cantidad y nombres propios de cada rol
CREATE TABLE tb_role_level (
    pk_role_level_id CHAR(36)     PRIMARY KEY,
    fk_role_id       CHAR(36)     NOT NULL REFERENCES tb_role (pk_role_id),
    name             VARCHAR(80)  NOT NULL,
    ordinal          SMALLINT     NOT NULL,
    status           VARCHAR(8)   NOT NULL DEFAULT 'ACTIVE',
    row_version      INTEGER      NOT NULL DEFAULT 1,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_by       VARCHAR(100) NOT NULL,
    updated_at       TIMESTAMPTZ,
    updated_by       VARCHAR(100),
    CONSTRAINT ux_role_level_ordinal UNIQUE (fk_role_id, ordinal),
    CONSTRAINT ux_role_level_name UNIQUE (fk_role_id, name),
    CONSTRAINT ck_role_level_ordinal CHECK (ordinal >= 1),
    CONSTRAINT ck_role_level_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT ck_role_level_name CHECK (btrim(name) <> '')
);

-- Competencias de un Rol-Nivel con su nivel L esperado (R-24, BR-CAT-14/21, R-46):
-- referencia una VERSIÓN; la competencia se repite en la fila para fijar «una vez por Rol-Nivel».
CREATE TABLE tb_role_level_competency (
    fk_role_level_id         CHAR(36)    NOT NULL REFERENCES tb_role_level (pk_role_level_id),
    fk_competency_id         CHAR(36)    NOT NULL,
    fk_competency_version_id CHAR(36)    NOT NULL,
    required_level           VARCHAR(2)  NOT NULL,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by               VARCHAR(100) NOT NULL,
    PRIMARY KEY (fk_role_level_id, fk_competency_id),
    CONSTRAINT fk_rlc_version_pair FOREIGN KEY (fk_competency_id, fk_competency_version_id)
        REFERENCES tb_competency_version (fk_competency_id, pk_competency_version_id),
    CONSTRAINT ck_rlc_level CHECK (required_level IN ('L1', 'L2', 'L3', 'L4'))
);
CREATE INDEX ix_rlc_by_version ON tb_role_level_competency (fk_competency_version_id);
