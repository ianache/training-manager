-- =====================================================================
-- TST-001 · T05 — Anonimización (BR-PTY-13, BR-PTY-14, D14, D16)
-- Portable. Diego (p4) se da de baja y luego se anonimiza.
-- Comprueba: no queda PII en ninguna tabla ni vigencia; se conservan el
-- código, roles, asignaciones y referencias de auditoría; las unicidades
-- de identificación, código y correo ignoran a la persona anonimizada.
-- =====================================================================

-- T05.1 ESPERA OK: baja = cierre del rol de Empleado con registro de cuándo y quién (BR-PTY-13, D17)
UPDATE party_role
   SET thru_date = '2026-06-30', thru_recorded_at = '2026-06-30 18:00:00', thru_recorded_by = '00000000-0000-0000-0000-000000000001'
 WHERE party_role_id = '00000000-0000-0000-0000-0000000r0041';

-- T05.2 ESPERA ERROR (CHECK): marcar como anonimizada sin quitar la PII
UPDATE person SET anonymized_at = '2026-10-01 09:00:00', anonymized_by = '00000000-0000-0000-0000-000000000001'
 WHERE party_id = '00000000-0000-0000-0000-000000000004';

SELECT 'T05.2' AS test,
       CASE WHEN (SELECT COUNT(*) FROM person WHERE party_id = '00000000-0000-0000-0000-000000000004'
                    AND anonymized_at IS NULL AND given_names = 'Diego') = 1
            THEN 'PASS' ELSE 'FAIL' END AS result;

-- T05.3 ESPERA OK: anonimización en una sola transacción (procedimiento de referencia, PDM-001 §5)
START TRANSACTION;
UPDATE person
   SET given_names = NULL, family_names = NULL, preferred_name = NULL,
       anonymized_at = '2026-10-01 09:00:00', anonymized_by = '00000000-0000-0000-0000-000000000001'
 WHERE party_id = '00000000-0000-0000-0000-000000000004';
UPDATE party_identification
   SET identification_number = NULL, anonymized_at = '2026-10-01 09:00:00'
 WHERE party_id = '00000000-0000-0000-0000-000000000004';
UPDATE contact_mechanism
   SET contact_value = NULL, anonymized_at = '2026-10-01 09:00:00'
 WHERE contact_mechanism_id IN (SELECT contact_mechanism_id FROM party_contact_mechanism
                                WHERE party_id = '00000000-0000-0000-0000-000000000004');
UPDATE access_identity
   SET keycloak_user_id = NULL, anonymized_at = '2026-10-01 09:00:00'
 WHERE person_party_id = '00000000-0000-0000-0000-000000000004';
COMMIT;

-- T05.4 No queda PII de Diego en ninguna tabla ni vigencia
SELECT 'T05.4' AS test,
       CASE WHEN (SELECT COUNT(*) FROM person WHERE party_id = '00000000-0000-0000-0000-000000000004'
                    AND (given_names IS NOT NULL OR family_names IS NOT NULL OR preferred_name IS NOT NULL)) = 0
             AND (SELECT COUNT(*) FROM party_identification WHERE party_id = '00000000-0000-0000-0000-000000000004'
                    AND identification_number IS NOT NULL) = 0
             AND (SELECT COUNT(*) FROM contact_mechanism cm
                    JOIN party_contact_mechanism pcm ON pcm.contact_mechanism_id = cm.contact_mechanism_id
                   WHERE pcm.party_id = '00000000-0000-0000-0000-000000000004' AND cm.contact_value IS NOT NULL) = 0
             AND (SELECT COUNT(*) FROM access_identity WHERE person_party_id = '00000000-0000-0000-0000-000000000004'
                    AND keycloak_user_id IS NOT NULL) = 0
             AND (SELECT COUNT(*) FROM contact_mechanism
                   WHERE contact_value IN ('diego@empresa.example', '+51 999 000 444', 'https://www.linkedin.com/in/diego-x')) = 0
             AND (SELECT COUNT(*) FROM party_identification WHERE identification_number = '44444444') = 0
            THEN 'PASS' ELSE 'FAIL' END AS result;

-- T05.5 Se conservan código, auditoría, roles, vigencias y asignaciones (D16)
SELECT 'T05.5' AS test,
       CASE WHEN (SELECT employee_code FROM person WHERE party_id = '00000000-0000-0000-0000-000000000004') = 'EMP-004'
             AND (SELECT anonymized_by FROM person WHERE party_id = '00000000-0000-0000-0000-000000000004') = '00000000-0000-0000-0000-000000000001'
             AND (SELECT created_by FROM person WHERE party_id = '00000000-0000-0000-0000-000000000004') = '00000000-0000-0000-0000-000000000001'
             AND (SELECT COUNT(*) FROM party_role WHERE party_id = '00000000-0000-0000-0000-000000000004'
                    AND from_date = '2026-01-02' AND thru_date = '2026-06-30') = 1
             AND (SELECT COUNT(*) FROM role_level_assignment WHERE person_party_id = '00000000-0000-0000-0000-000000000004') = 1
             AND (SELECT COUNT(*) FROM party_contact_mechanism WHERE party_id = '00000000-0000-0000-0000-000000000004') = 3
            THEN 'PASS' ELSE 'FAIL' END AS result;

-- T05.6 ESPERA OK: las unicidades ignoran a la persona anonimizada (BR-PTY-14)
INSERT INTO party (party_id, party_kind, created_at, created_by)
VALUES ('00000000-0000-0000-0000-000000000007', 'PERSON', '2026-10-02 10:00:00', '00000000-0000-0000-0000-000000000001');
-- código de la persona anonimizada (ver riesgo DM-Q-02 en LDM-001)
INSERT INTO person (party_id, employee_code, given_names, family_names, created_at, created_by)
VALUES ('00000000-0000-0000-0000-000000000007', 'EMP-004', 'Iván', 'Prueba Siete', '2026-10-02 10:00:00', '00000000-0000-0000-0000-000000000001');
-- misma identificación
INSERT INTO party_identification (party_identification_id, party_id, party_kind, identification_type_code, identification_number, issuing_country_code, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000i0007', '00000000-0000-0000-0000-000000000007', 'PERSON', 'DNI', '44444444', 'PE', '2026-10-02 10:00:00', '00000000-0000-0000-0000-000000000001');
-- misma dirección de correo laboral, vigente
INSERT INTO contact_mechanism (contact_mechanism_id, mechanism_type_code, contact_value, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000c0007', 'EMAIL', 'diego@empresa.example', '2026-10-02 10:00:00', '00000000-0000-0000-0000-000000000001');
INSERT INTO party_contact_mechanism (party_contact_mechanism_id, party_id, contact_mechanism_id, mechanism_type_code, purpose_type_code, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000m0007', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-0000000c0007', 'EMAIL', 'WORK_EMAIL', '2026-10-02', '2026-10-02 10:00:00', '00000000-0000-0000-0000-000000000001');

SELECT 'T05.6' AS test,
       CASE WHEN (SELECT COUNT(*) FROM person WHERE party_id = '00000000-0000-0000-0000-000000000007' AND employee_code = 'EMP-004') = 1
             AND (SELECT COUNT(*) FROM party_identification WHERE party_identification_id = '00000000-0000-0000-0000-0000000i0007') = 1
             AND (SELECT COUNT(*) FROM party_contact_mechanism WHERE party_contact_mechanism_id = '00000000-0000-0000-0000-0000000m0007') = 1
            THEN 'PASS' ELSE 'FAIL' END AS result;

-- T05.7 ESPERA ERROR (unicidad): entre no anonimizadas el código sigue siendo único
INSERT INTO party (party_id, party_kind, created_at, created_by)
VALUES ('00000000-0000-0000-0000-000000000010', 'PERSON', '2026-10-02 10:00:00', '00000000-0000-0000-0000-000000000001');
INSERT INTO person (party_id, employee_code, given_names, family_names, created_at, created_by)
VALUES ('00000000-0000-0000-0000-000000000010', 'EMP-004', 'Juan', 'Prueba Diez', '2026-10-02 10:00:00', '00000000-0000-0000-0000-000000000001');

SELECT 'T05.7' AS test,
       CASE WHEN (SELECT COUNT(*) FROM person WHERE employee_code = 'EMP-004' AND anonymized_at IS NULL) = 1
            THEN 'PASS' ELSE 'FAIL' END AS result;
