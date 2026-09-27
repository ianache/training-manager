-- =====================================================================
-- TST-001 · T01 — Un solo nivel vigente por rol (BR-PTY-11, D6)
-- Portable. Las sentencias marcadas "ESPERA ERROR" deben fallar; el
-- veredicto lo dan los SELECT finales (PASS/FAIL) sobre el estado.
-- =====================================================================

-- T01.1 ESPERA OK: Bruno recibe el rol R1 con nivel L1
INSERT INTO role_level_assignment (role_level_assignment_id, person_party_id, catalog_role_id, catalog_role_level_id, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000a0021', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000c0r1', '00000000-0000-0000-0000-00000000c1l1', '2026-02-01', '2026-02-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T01.2 ESPERA ERROR (unicidad): segundo nivel vigente (L2) del mismo rol R1
INSERT INTO role_level_assignment (role_level_assignment_id, person_party_id, catalog_role_id, catalog_role_level_id, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000a0022', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000c0r1', '00000000-0000-0000-0000-00000000c1l2', '2026-03-01', '2026-03-01 10:00:00', '00000000-0000-0000-0000-000000000001');

SELECT 'T01.2' AS test,
       CASE WHEN (SELECT COUNT(*) FROM role_level_assignment
                  WHERE person_party_id = '00000000-0000-0000-0000-000000000002'
                    AND catalog_role_id = '00000000-0000-0000-0000-00000000c0r1' AND thru_date IS NULL) = 1
            THEN 'PASS' ELSE 'FAIL' END AS result;

-- T01.3 ESPERA OK: otro rol (R2) vigente para la misma persona (varios roles, D6)
INSERT INTO role_level_assignment (role_level_assignment_id, person_party_id, catalog_role_id, catalog_role_level_id, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000a0023', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000c0r2', '00000000-0000-0000-0000-00000000c2l1', '2026-03-01', '2026-03-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T01.4 ESPERA OK: cambio de nivel = cerrar la vigencia anterior y abrir una nueva (BR-PTY-11, BR-PTY-12)
UPDATE role_level_assignment SET thru_date = '2026-04-01', updated_at = '2026-04-01 10:00:00', updated_by = '00000000-0000-0000-0000-000000000001'
WHERE role_level_assignment_id = '00000000-0000-0000-0000-0000000a0021';
INSERT INTO role_level_assignment (role_level_assignment_id, person_party_id, catalog_role_id, catalog_role_level_id, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000a0024', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000c0r1', '00000000-0000-0000-0000-00000000c1l2', '2026-04-01', '2026-04-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T01.5 ESPERA ERROR (CHECK): hasta anterior a desde
INSERT INTO role_level_assignment (role_level_assignment_id, person_party_id, catalog_role_id, catalog_role_level_id, from_date, thru_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000a0025', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000c0r3', '00000000-0000-0000-0000-00000000c3l1', '2026-05-01', '2026-04-01', '2026-05-01 10:00:00', '00000000-0000-0000-0000-000000000001');

SELECT 'T01.3' AS test,
       CASE WHEN (SELECT COUNT(*) FROM role_level_assignment
                  WHERE person_party_id = '00000000-0000-0000-0000-000000000002' AND thru_date IS NULL) = 2
            THEN 'PASS' ELSE 'FAIL' END AS result;
SELECT 'T01.4' AS test,
       CASE WHEN (SELECT COUNT(*) FROM role_level_assignment
                  WHERE person_party_id = '00000000-0000-0000-0000-000000000002'
                    AND catalog_role_id = '00000000-0000-0000-0000-00000000c0r1') = 2
             AND (SELECT catalog_role_level_id FROM role_level_assignment
                  WHERE person_party_id = '00000000-0000-0000-0000-000000000002'
                    AND catalog_role_id = '00000000-0000-0000-0000-00000000c0r1' AND thru_date IS NULL)
                 = '00000000-0000-0000-0000-00000000c1l2'
            THEN 'PASS' ELSE 'FAIL' END AS result;
SELECT 'T01.5' AS test,
       CASE WHEN (SELECT COUNT(*) FROM role_level_assignment
                  WHERE role_level_assignment_id = '00000000-0000-0000-0000-0000000a0025') = 0
            THEN 'PASS' ELSE 'FAIL' END AS result;
