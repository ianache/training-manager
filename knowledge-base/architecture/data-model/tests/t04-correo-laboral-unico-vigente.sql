-- =====================================================================
-- TST-001 · T04 — Correo laboral único entre colaboradores vigentes (BR-PTY-08, BR-PTY-09)
-- Portable. Veredicto por los SELECT PASS/FAIL.
-- =====================================================================

-- T04.1 ESPERA OK: correo laboral de Bruno
INSERT INTO contact_mechanism (contact_mechanism_id, mechanism_type_code, contact_value, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000c0002', 'EMAIL', 'bruno@empresa.example', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');
INSERT INTO party_contact_mechanism (party_contact_mechanism_id, party_id, contact_mechanism_id, mechanism_type_code, purpose_type_code, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000m0002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-0000000c0002', 'EMAIL', 'WORK_EMAIL', '2026-02-01', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T04.2 ESPERA ERROR (unicidad, sin distinguir mayúsculas): la misma dirección como otro medio
INSERT INTO contact_mechanism (contact_mechanism_id, mechanism_type_code, contact_value, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000c0022', 'EMAIL', 'BRUNO@empresa.example', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T04.3 ESPERA ERROR (unicidad entre vigentes): Elena con el correo laboral vigente de Bruno
INSERT INTO party_contact_mechanism (party_contact_mechanism_id, party_id, contact_mechanism_id, mechanism_type_code, purpose_type_code, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000m0061', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-0000000c0002', 'EMAIL', 'WORK_EMAIL', '2026-03-01', '2026-03-01 10:00:00', '00000000-0000-0000-0000-000000000001');

SELECT 'T04.2' AS test,
       CASE WHEN (SELECT COUNT(*) FROM contact_mechanism WHERE LOWER(contact_value) = 'bruno@empresa.example') = 1
            THEN 'PASS' ELSE 'FAIL' END AS result;
SELECT 'T04.3' AS test,
       CASE WHEN (SELECT COUNT(*) FROM party_contact_mechanism
                  WHERE contact_mechanism_id = '00000000-0000-0000-0000-0000000c0002' AND thru_date IS NULL) = 1
            THEN 'PASS' ELSE 'FAIL' END AS result;

-- T04.4 ESPERA OK: al cerrar la vigencia de Bruno, el correo puede asignarse a Elena
UPDATE party_contact_mechanism SET thru_date = '2026-03-31'
WHERE party_contact_mechanism_id = '00000000-0000-0000-0000-0000000m0002';
INSERT INTO party_contact_mechanism (party_contact_mechanism_id, party_id, contact_mechanism_id, mechanism_type_code, purpose_type_code, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000m0062', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-0000000c0002', 'EMAIL', 'WORK_EMAIL', '2026-04-01', '2026-04-01 10:00:00', '00000000-0000-0000-0000-000000000001');

SELECT 'T04.4' AS test,
       CASE WHEN (SELECT party_id FROM party_contact_mechanism
                  WHERE contact_mechanism_id = '00000000-0000-0000-0000-0000000c0002' AND thru_date IS NULL)
                 = '00000000-0000-0000-0000-000000000006'
             AND (SELECT COUNT(*) FROM party_contact_mechanism
                  WHERE contact_mechanism_id = '00000000-0000-0000-0000-0000000c0002') = 2
            THEN 'PASS' ELSE 'FAIL' END AS result;

-- T04.5 ESPERA ERROR (FK propósito-tipo de medio): correo laboral sobre un teléfono
INSERT INTO party_contact_mechanism (party_contact_mechanism_id, party_id, contact_mechanism_id, mechanism_type_code, purpose_type_code, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000m0063', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-0000000c0005', 'PHONE', 'WORK_EMAIL', '2026-04-01', '2026-04-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T04.6 ESPERA ERROR (CHECK): perfil profesional sin plataforma
INSERT INTO party_contact_mechanism (party_contact_mechanism_id, party_id, contact_mechanism_id, mechanism_type_code, purpose_type_code, profile_platform_code, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000m0064', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-0000000c0006', 'URL', 'PROFESSIONAL_PROFILE', NULL, '2026-04-01', '2026-04-01 10:00:00', '00000000-0000-0000-0000-000000000001');

SELECT 'T04.5-6' AS test,
       CASE WHEN (SELECT COUNT(*) FROM party_contact_mechanism
                  WHERE party_contact_mechanism_id IN ('00000000-0000-0000-0000-0000000m0063', '00000000-0000-0000-0000-0000000m0064')) = 0
            THEN 'PASS' ELSE 'FAIL' END AS result;
