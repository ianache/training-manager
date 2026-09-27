-- =====================================================================
-- TST-001 · T06 (MySQL) — Aviso al vencer el plazo (BR-PTY-15, D15, D17, D18, D20)
-- Variante MySQL: la aritmética de fechas no es portable (INTERVAL n DAY).
-- Instante de referencia fijo: 2026-09-27 12:00:00 UTC. Plazo: 90 días (fixtures).
-- La consulta de vencidos y el INSERT...SELECT son la lógica de referencia
-- que ejecutaría el proceso programado del microservicio de partes.
-- =====================================================================

-- T06.1 Vencidos: bajas de Empleado/Contratista con plazo cumplido, sin rol de colaborador
-- vigente, no anonimizadas y sin aviso. Esperado: solo Fabio (p8).
SELECT 'T06.1' AS test,
       CASE WHEN (SELECT COUNT(*) FROM party_role r
                    JOIN person p ON p.party_id = r.party_id
                    CROSS JOIN anonymization_setting s
                   WHERE r.role_type_code IN ('EMPLOYEE', 'CONTRACTOR')
                     AND r.thru_recorded_at IS NOT NULL
                     AND r.thru_recorded_at + INTERVAL s.notice_after_days DAY <= '2026-09-27 12:00:00'
                     AND p.anonymized_at IS NULL
                     AND NOT EXISTS (SELECT 1 FROM party_role v WHERE v.party_id = r.party_id
                                       AND v.role_type_code IN ('EMPLOYEE', 'CONTRACTOR') AND v.thru_date IS NULL)
                     AND NOT EXISTS (SELECT 1 FROM anonymization_notice n WHERE n.termination_party_role_id = r.party_role_id)) = 1
             AND (SELECT r.party_id FROM party_role r
                    CROSS JOIN anonymization_setting s
                   WHERE r.role_type_code IN ('EMPLOYEE', 'CONTRACTOR')
                     AND r.thru_recorded_at + INTERVAL s.notice_after_days DAY <= '2026-09-27 12:00:00'
                     AND r.party_id NOT IN (SELECT party_id FROM person WHERE anonymized_at IS NOT NULL))
                 = '00000000-0000-0000-0000-000000000008'
            THEN 'PASS' ELSE 'FAIL' END AS result;

-- T06.2 ESPERA OK: segundo Jefe de Ingeniería vigente (Bruno) — se permite (BR-PTY-18, D21: solo aviso en la aplicación)
INSERT INTO party_role (party_role_id, party_id, party_kind, role_type_code, from_date, created_at, created_by)
VALUES ('00000000-0000-0000-0000-0000000r0022', '00000000-0000-0000-0000-000000000002', 'PERSON', 'ENGINEERING_HEAD', '2026-09-01', '2026-09-01 10:00:00', '00000000-0000-0000-0000-000000000001');

-- T06.3 ESPERA OK: se genera el aviso de Fabio con destinatarios = correos vigentes de los Jefes de Ingeniería vigentes
INSERT INTO anonymization_notice (anonymization_notice_id, person_party_id, termination_party_role_id, termination_recorded_at, due_at, generated_at, notice_status, send_status)
SELECT '00000000-0000-0000-0000-0000000n0008', r.party_id, r.party_role_id, r.thru_recorded_at,
       r.thru_recorded_at + INTERVAL s.notice_after_days DAY, '2026-09-27 12:00:00', 'PENDING', 'PENDING'
  FROM party_role r CROSS JOIN anonymization_setting s
 WHERE r.party_role_id = '00000000-0000-0000-0000-0000000r0081';
INSERT INTO anonymization_notice_recipient (anonymization_notice_id, recipient_party_id, contact_mechanism_id)
SELECT '00000000-0000-0000-0000-0000000n0008', jr.party_id, pcm.contact_mechanism_id
  FROM party_role jr
  JOIN party_contact_mechanism pcm ON pcm.party_id = jr.party_id
                                  AND pcm.mechanism_type_code = 'EMAIL' AND pcm.thru_date IS NULL
 WHERE jr.role_type_code = 'ENGINEERING_HEAD' AND jr.thru_date IS NULL;

-- Ana tiene correo vigente; Bruno cerró el suyo en T04 => 1 destinatario
SELECT 'T06.3' AS test,
       CASE WHEN (SELECT COUNT(*) FROM party_role WHERE role_type_code = 'ENGINEERING_HEAD' AND thru_date IS NULL) = 2
             AND (SELECT COUNT(*) FROM anonymization_notice_recipient WHERE anonymization_notice_id = '00000000-0000-0000-0000-0000000n0008') = 1
             AND (SELECT due_at FROM anonymization_notice WHERE anonymization_notice_id = '00000000-0000-0000-0000-0000000n0008') = '2026-08-30 09:00:00'
            THEN 'PASS' ELSE 'FAIL' END AS result;

-- T06.4 ESPERA ERROR (unicidad): segundo aviso para la misma baja
INSERT INTO anonymization_notice (anonymization_notice_id, person_party_id, termination_party_role_id, termination_recorded_at, due_at, generated_at, notice_status, send_status)
VALUES ('00000000-0000-0000-0000-0000000n0009', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-0000000r0081', '2026-06-01 09:00:00', '2026-08-30 09:00:00', '2026-09-27 12:05:00', 'PENDING', 'PENDING');

-- T06.5 ESPERA ERROR (CHECK): estado de envío fuera de la lista
UPDATE anonymization_notice SET send_status = 'LOST' WHERE anonymization_notice_id = '00000000-0000-0000-0000-0000000n0008';

-- T06.6 ESPERA OK: envío fallido con reintento, luego enviado
UPDATE anonymization_notice SET send_status = 'RETRYING', send_attempts = 1, last_attempt_at = '2026-09-27 12:01:00'
 WHERE anonymization_notice_id = '00000000-0000-0000-0000-0000000n0008';
UPDATE anonymization_notice SET send_status = 'SENT', send_attempts = 2, last_attempt_at = '2026-09-27 12:11:00'
 WHERE anonymization_notice_id = '00000000-0000-0000-0000-0000000n0008';

SELECT 'T06.4-6' AS test,
       CASE WHEN (SELECT COUNT(*) FROM anonymization_notice WHERE termination_party_role_id = '00000000-0000-0000-0000-0000000r0081') = 1
             AND (SELECT send_status FROM anonymization_notice WHERE anonymization_notice_id = '00000000-0000-0000-0000-0000000n0008') = 'SENT'
             AND (SELECT send_attempts FROM anonymization_notice WHERE anonymization_notice_id = '00000000-0000-0000-0000-0000000n0008') = 2
            THEN 'PASS' ELSE 'FAIL' END AS result;
