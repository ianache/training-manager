-- =====================================================================
-- TST-001 · T02 — Identificación única por tipo, número y país (BR-PTY-07, D10)
-- Portable. Veredicto por los SELECT PASS/FAIL.
-- =====================================================================

-- T02.1 ESPERA OK: Bruno, DNI 22222222 de PE
INSERT INTO party_identification (party_identification_id, party_id, party_kind, identification_type_code, identification_number, issuing_country_code, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000i0002', '00000000-0000-0000-0000-000000000002', 'PERSON', 'DNI', '22222222', 'PE', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T02.2 ESPERA ERROR (unicidad): Carla con el mismo DNI y país
INSERT INTO party_identification (party_identification_id, party_id, party_kind, identification_type_code, identification_number, issuing_country_code, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000i0003', '00000000-0000-0000-0000-000000000003', 'PERSON', 'DNI', '22222222', 'PE', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T02.3 ESPERA OK: mismo número, otro país emisor
INSERT INTO party_identification (party_identification_id, party_id, party_kind, identification_type_code, identification_number, issuing_country_code, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000i0031', '00000000-0000-0000-0000-000000000003', 'PERSON', 'DNI', '22222222', 'AR', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T02.4 ESPERA OK: mismo número y país, otro tipo (pasaporte)
INSERT INTO party_identification (party_identification_id, party_id, party_kind, identification_type_code, identification_number, issuing_country_code, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000i0032', '00000000-0000-0000-0000-000000000003', 'PERSON', 'PASSPORT', '22222222', 'PE', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T02.5 ESPERA ERROR (FK compuesta tipo-clase de parte): DNI para una organización
INSERT INTO party_identification (party_identification_id, party_id, party_kind, identification_type_code, identification_number, issuing_country_code, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000i0a02', '00000000-0000-0000-0000-00000000a002', 'ORGANIZATION', 'DNI', '55555555', 'PE', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T02.6 ESPERA ERROR (FK compuesta parte-clase): RUC declarado como de persona a una persona
INSERT INTO party_identification (party_identification_id, party_id, party_kind, identification_type_code, identification_number, issuing_country_code, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000i0022', '00000000-0000-0000-0000-000000000002', 'PERSON', 'RUC', '10222222221', 'PE', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T02.7 ESPERA ERROR (CHECK): número vacío sin estar anonimizada
INSERT INTO party_identification (party_identification_id, party_id, party_kind, identification_type_code, identification_number, issuing_country_code, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000i0023', '00000000-0000-0000-0000-000000000002', 'PERSON', 'CE', NULL, 'PE', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

SELECT 'T02.2' AS test,
       CASE WHEN (SELECT COUNT(*) FROM party_identification
                  WHERE identification_type_code = 'DNI' AND identification_number = '22222222' AND issuing_country_code = 'PE') = 1
            THEN 'PASS' ELSE 'FAIL' END AS result;
SELECT 'T02.3-4' AS test,
       CASE WHEN (SELECT COUNT(*) FROM party_identification
                  WHERE party_identification_id IN ('00000000-0000-0000-0000-0000000i0031', '00000000-0000-0000-0000-0000000i0032')) = 2
            THEN 'PASS' ELSE 'FAIL' END AS result;
SELECT 'T02.5-7' AS test,
       CASE WHEN (SELECT COUNT(*) FROM party_identification
                  WHERE party_identification_id IN ('00000000-0000-0000-0000-0000000i0a02', '00000000-0000-0000-0000-0000000i0022',
                                                    '00000000-0000-0000-0000-0000000i0023')) = 0
            THEN 'PASS' ELSE 'FAIL' END AS result;
