-- LDM-003 / certification-service (ADR-013) — PostgreSQL 16 (ADR-007)
-- Propuesta del agente (data-model-designer): REQUIERE REVISIÓN. Convenciones de PDM-001 y LDM-002:
-- tb_*, pk_*/fk_*, CHAR(36) generado por el servicio, auditoría sin FK, estados en mayúsculas (BR-CAT-27).
-- Los ids de persona, competencia, versión y requisito son referencias lógicas a otros servicios (sin FK, ADR-013).
-- Todo actor de la auditoría (certified_by, revoked_by, graded_by, actor, created_by, updated_by) es el CÓDIGO DE PARTY de la persona
-- (código de colaborador, CHAR(36)), EVD-2026-0222. El catálogo de motivos conserva VARCHAR(100) por su siembra técnica ('system').
-- Las reglas entre servicios y entre filas (CHK-A..CHK-E de LDM-003 §5) las aplica el servicio.

-- Motivos tipificados de revocación (EVD-2026-0195, 0197, 0200): lista ampliable con estado
CREATE TABLE tb_revocation_reason (
    pk_revocation_reason_code VARCHAR(40)  PRIMARY KEY,
    name                      VARCHAR(120) NOT NULL,
    status                    VARCHAR(8)   NOT NULL DEFAULT 'ACTIVE',
    created_at                TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_by                VARCHAR(100) NOT NULL,
    updated_at                TIMESTAMPTZ,
    updated_by                VARCHAR(100),
    CONSTRAINT ck_revocation_reason_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT ck_revocation_reason_code CHECK (pk_revocation_reason_code ~ '^[A-Z][A-Z0-9_]*$'),
    CONSTRAINT ck_revocation_reason_name CHECK (btrim(name) <> '')
);
INSERT INTO tb_revocation_reason (pk_revocation_reason_code, name, created_by) VALUES
    ('ERROR_DE_REGISTRO', 'Error de registro', 'system'),
    ('EVIDENCIA_INVALIDA', 'Evidencia inválida', 'system'),
    ('REQUISITOS_NO_CUMPLIDOS', 'Requisitos no cumplidos', 'system'),
    ('OTRO', 'Otro', 'system');

-- Evidencia: entidad propia y reutilizable (EVD-2026-0204, 0213). La presenta el colaborador.
CREATE TABLE tb_evidence (
    pk_evidence_id  CHAR(36)      PRIMARY KEY,
    person_party_id CHAR(36)      NOT NULL,     -- quien presenta la evidencia (ref. lógica a party)
    category        VARCHAR(20)   NOT NULL,
    description     VARCHAR(300)  NOT NULL,
    reference_url   VARCHAR(2000),              -- GitLab y otros: solo URL (EVD-2026-0211)
    course_ref      CHAR(36),                   -- ref. lógica a un curso; solo con FORMACION
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    created_by      CHAR(36)      NOT NULL,
    CONSTRAINT ck_evidence_category CHECK (category IN ('FORMACION', 'PRACTICA_EVALUADA', 'DESEMPENO_PROYECTO')),
    CONSTRAINT ck_evidence_text CHECK (btrim(description) <> ''),
    CONSTRAINT ck_evidence_url CHECK (reference_url IS NULL OR reference_url ~ '^https?://[^[:space:]]+$'),
    CONSTRAINT ck_evidence_course CHECK (course_ref IS NULL OR category = 'FORMACION')
);
CREATE INDEX ix_evidence_by_person ON tb_evidence (person_party_id);

-- Certificación de un nivel L1–L4 de una competencia (US-003). Vigente = ACTIVE; no se borra (BR-ACR-15).
CREATE TABLE tb_certification (
    pk_certification_id        CHAR(36)     PRIMARY KEY,
    person_party_id            CHAR(36)     NOT NULL,   -- ref. lógica a party
    competency_id              CHAR(36)     NOT NULL,   -- ref. lógica al catálogo
    competency_version_id      CHAR(36)     NOT NULL,   -- versión vigente al certificar (IMD-001 R-46)
    level_code                 VARCHAR(2)   NOT NULL,
    status                     VARCHAR(8)   NOT NULL DEFAULT 'ACTIVE',
    certified_by               CHAR(36)     NOT NULL,   -- evaluador (BR-ACR-02, 03)
    certified_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
    replaced_by_certification_id CHAR(36),
    replaced_at                TIMESTAMPTZ,
    revoked_by                 CHAR(36),
    revoked_at                 TIMESTAMPTZ,
    revoke_reason_code         VARCHAR(40),
    revoke_description         VARCHAR(1000),
    row_version                INTEGER      NOT NULL DEFAULT 1,
    created_at                 TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_by                 CHAR(36)     NOT NULL,
    updated_at                 TIMESTAMPTZ,
    updated_by                 CHAR(36),
    CONSTRAINT ck_cert_level CHECK (level_code IN ('L1', 'L2', 'L3', 'L4')),
    CONSTRAINT ck_cert_status CHECK (status IN ('ACTIVE', 'REPLACED', 'REVOKED')),
    -- recertificar reemplaza la anterior (EVD-2026-0192); la FK se verifica al confirmar la transacción
    CONSTRAINT fk_cert_replaced_by FOREIGN KEY (replaced_by_certification_id)
        REFERENCES tb_certification (pk_certification_id) DEFERRABLE INITIALLY DEFERRED,
    CONSTRAINT fk_cert_revoke_reason FOREIGN KEY (revoke_reason_code)
        REFERENCES tb_revocation_reason (pk_revocation_reason_code),
    CONSTRAINT ck_cert_not_self_replaced CHECK (replaced_by_certification_id IS NULL OR replaced_by_certification_id <> pk_certification_id),
    -- coherencia de estados: cada estado exige sus datos y excluye los de los otros
    CONSTRAINT ck_cert_state_data CHECK (
        (status = 'ACTIVE'
            AND replaced_by_certification_id IS NULL AND replaced_at IS NULL
            AND revoked_by IS NULL AND revoked_at IS NULL AND revoke_reason_code IS NULL AND revoke_description IS NULL)
        OR (status = 'REPLACED'
            AND replaced_by_certification_id IS NOT NULL AND replaced_at IS NOT NULL
            AND revoked_by IS NULL AND revoked_at IS NULL AND revoke_reason_code IS NULL AND revoke_description IS NULL)
        OR (status = 'REVOKED'
            AND replaced_by_certification_id IS NULL AND replaced_at IS NULL
            AND revoked_by IS NOT NULL AND revoked_at IS NOT NULL AND revoke_reason_code IS NOT NULL AND revoke_description IS NOT NULL)
    ),
    -- descripción que sustenta la revocación: de 10 a 1000 caracteres (EVD-2026-0196, 0201)
    CONSTRAINT ck_cert_revoke_description CHECK (revoke_description IS NULL OR char_length(btrim(revoke_description)) BETWEEN 10 AND 1000)
);
-- a lo sumo una certificación vigente por persona, competencia y nivel: recertificar la reemplaza
CREATE UNIQUE INDEX ux_cert_active_level ON tb_certification (person_party_id, competency_id, level_code) WHERE status = 'ACTIVE';
CREATE INDEX ix_cert_by_person_competency ON tb_certification (person_party_id, competency_id);
CREATE INDEX ix_cert_by_competency_version ON tb_certification (competency_version_id);

-- Vínculo evidencia–certificación–requisito con la calificación del evaluador (EVD-2026-0204, 0205, 0208, 0210, 0214)
CREATE TABLE tb_certification_evidence (
    fk_certification_id       CHAR(36)     NOT NULL REFERENCES tb_certification (pk_certification_id),
    fk_evidence_id            CHAR(36)     NOT NULL REFERENCES tb_evidence (pk_evidence_id),
    evidence_requirement_id   CHAR(36)     NOT NULL,   -- ref. lógica al catálogo: el requisito que la pieza intenta cumplir
    requirement_is_required   BOOLEAN      NOT NULL,   -- instantánea: requerido o deseado al certificar (P-41)
    grade                     VARCHAR(10)  NOT NULL,
    graded_by                 CHAR(36)     NOT NULL,
    graded_at                 TIMESTAMPTZ  NOT NULL DEFAULT now(),
    PRIMARY KEY (fk_certification_id, fk_evidence_id, evidence_requirement_id),
    CONSTRAINT ck_cert_evidence_grade CHECK (grade IN ('CUMPLE', 'NO_CUMPLE'))
);
CREATE INDEX ix_cert_evidence_by_evidence ON tb_certification_evidence (fk_evidence_id);

-- Registro de auditoría de solo inserción (EVD-2026-0194): lo escribe un disparador, no el servicio
CREATE TABLE tb_certification_event (
    pk_certification_event_id BIGSERIAL    PRIMARY KEY,
    fk_certification_id       CHAR(36)     NOT NULL REFERENCES tb_certification (pk_certification_id),
    event_type                VARCHAR(10)  NOT NULL,
    actor                     CHAR(36)     NOT NULL,
    occurred_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
    reason_code               VARCHAR(40),
    description               VARCHAR(1000),
    CONSTRAINT ck_cert_event_type CHECK (event_type IN ('CERTIFIED', 'REPLACED', 'REVOKED'))
);
CREATE INDEX ix_cert_event_by_cert ON tb_certification_event (fk_certification_id);

-- Disparadores ----------------------------------------------------------------------------------------------
-- 1) No se certifica un nivel inferior al vigente más alto (EVD-2026-0187)
CREATE FUNCTION fn_cert_no_lower_level() RETURNS trigger AS $$
BEGIN
    IF NEW.status = 'ACTIVE' AND EXISTS (
        SELECT 1 FROM tb_certification c
        WHERE c.person_party_id = NEW.person_party_id AND c.competency_id = NEW.competency_id
          AND c.status = 'ACTIVE' AND c.level_code > NEW.level_code) THEN
        RAISE EXCEPTION 'no se certifica un nivel inferior (%) al ya certificado', NEW.level_code USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_cert_no_lower_level BEFORE INSERT ON tb_certification FOR EACH ROW EXECUTE FUNCTION fn_cert_no_lower_level();

-- 2) REVOKED y REPLACED son estados finales; ACTIVE solo avanza
CREATE FUNCTION fn_cert_final_states() RETURNS trigger AS $$
BEGIN
    IF OLD.status <> 'ACTIVE' AND (NEW.status <> OLD.status OR NEW IS DISTINCT FROM OLD) THEN
        RAISE EXCEPTION 'una certificación % no se modifica', OLD.status USING ERRCODE = 'check_violation';
    END IF;
    IF NEW.person_party_id <> OLD.person_party_id OR NEW.competency_id <> OLD.competency_id
       OR NEW.competency_version_id <> OLD.competency_version_id OR NEW.level_code <> OLD.level_code
       OR NEW.certified_by <> OLD.certified_by OR NEW.certified_at <> OLD.certified_at THEN
        RAISE EXCEPTION 'persona, competencia, versión, nivel y certificador no se modifican' USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_cert_final_states BEFORE UPDATE ON tb_certification FOR EACH ROW EXECUTE FUNCTION fn_cert_final_states();

-- 3) Auditoría automática de cada transición
CREATE FUNCTION fn_cert_audit() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO tb_certification_event (fk_certification_id, event_type, actor, occurred_at)
        VALUES (NEW.pk_certification_id, 'CERTIFIED', NEW.certified_by, NEW.certified_at);
    ELSIF NEW.status = 'REVOKED' AND OLD.status = 'ACTIVE' THEN
        INSERT INTO tb_certification_event (fk_certification_id, event_type, actor, occurred_at, reason_code, description)
        VALUES (NEW.pk_certification_id, 'REVOKED', NEW.revoked_by, NEW.revoked_at, NEW.revoke_reason_code, NEW.revoke_description);
    ELSIF NEW.status = 'REPLACED' AND OLD.status = 'ACTIVE' THEN
        INSERT INTO tb_certification_event (fk_certification_id, event_type, actor, occurred_at)
        VALUES (NEW.pk_certification_id, 'REPLACED', COALESCE(NEW.updated_by, NEW.certified_by), NEW.replaced_at);
    END IF;
    RETURN NULL;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_cert_audit AFTER INSERT OR UPDATE ON tb_certification FOR EACH ROW EXECUTE FUNCTION fn_cert_audit();

-- 4) El registro de auditoría no se modifica ni se borra
CREATE FUNCTION fn_cert_event_immutable() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'el registro de auditoría de certificaciones no se modifica ni se borra' USING ERRCODE = 'check_violation';
END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_cert_event_immutable BEFORE UPDATE OR DELETE ON tb_certification_event FOR EACH ROW EXECUTE FUNCTION fn_cert_event_immutable();

-- Nivel certificado vigente por persona y competencia: el más alto de las certificaciones vigentes (EVD-2026-0186)
CREATE VIEW vw_current_certified_level AS
SELECT DISTINCT ON (person_party_id, competency_id)
       person_party_id, competency_id, level_code, pk_certification_id, competency_version_id, certified_by, certified_at
FROM tb_certification
WHERE status = 'ACTIVE'
ORDER BY person_party_id, competency_id, level_code DESC, certified_at DESC;
