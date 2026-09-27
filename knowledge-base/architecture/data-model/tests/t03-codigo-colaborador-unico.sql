-- =====================================================================
-- TST-001 · T03 — Código de colaborador único y obligatorio (BR-PTY-06, D9)
-- Portable. Veredicto por los SELECT PASS/FAIL.
-- =====================================================================

INSERT INTO party (party_id, party_kind, created_at, created_by)
VALUES ('00000000-0000-0000-0000-000000000005', 'PERSON', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T03.1 ESPERA ERROR (unicidad): código EMP-002 ya usado por Bruno
INSERT INTO person (party_id, employee_code, given_names, family_names, created_at, created_by)
VALUES ('00000000-0000-0000-0000-000000000005', 'EMP-002', 'Hugo', 'Prueba Cinco', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T03.2 ESPERA ERROR (NOT NULL): sin código
INSERT INTO person (party_id, employee_code, given_names, family_names, created_at, created_by)
VALUES ('00000000-0000-0000-0000-000000000005', NULL, 'Hugo', 'Prueba Cinco', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T03.3 ESPERA ERROR (FK compuesta): una parte de clase PERSON no puede ser ORGANIZATION
INSERT INTO organization (party_id, organization_name, created_at, created_by)
VALUES ('00000000-0000-0000-0000-000000000005', 'No debe existir', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T03.4 ESPERA OK: código nuevo
INSERT INTO person (party_id, employee_code, given_names, family_names, created_at, created_by)
VALUES ('00000000-0000-0000-0000-000000000005', 'EMP-005', 'Hugo', 'Prueba Cinco', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

SELECT 'T03.1' AS test,
       CASE WHEN (SELECT COUNT(*) FROM person WHERE employee_code = 'EMP-002') = 1
            THEN 'PASS' ELSE 'FAIL' END AS result;
SELECT 'T03.3' AS test,
       CASE WHEN (SELECT COUNT(*) FROM organization WHERE party_id = '00000000-0000-0000-0000-000000000005') = 0
            THEN 'PASS' ELSE 'FAIL' END AS result;
SELECT 'T03.4' AS test,
       CASE WHEN (SELECT employee_code FROM person WHERE party_id = '00000000-0000-0000-0000-000000000005') = 'EMP-005'
            THEN 'PASS' ELSE 'FAIL' END AS result;
