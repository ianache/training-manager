---
artifact: development-scope-pack
okf: google-okf-v0.2
id: DSP-002
title: Certificación manual de niveles y perfil de competencias
generated: '2026-10-03'
verified: false
status: REQUIRES_REVIEW
sources:
- https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
- https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md
- https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-004-consultar-mi-perfil-de-competencias.md
provenance:
  created_by: development-scope-pack-builder
  method: derived-from-rcp-and-user-stories
  confidence: medium
human-reviewed: false
scope_state: DRAFT
sprint:
  id: null
  name: null
---

# Certificación manual de niveles y perfil de competencias

## Scope and Identity

- Scope ID: `DSP-002`
- Product: `Plataforma de Gestión de Formación`
- Scope state: `DRAFT`
- Sprint: Not assigned; candidate scope for Scrum planning.

## Objective

Que un evaluador humano certifique el nivel L1–L4 de un colaborador en una competencia con evidencias, y que el colaborador consulte su perfil; y que el catálogo y la asignación de Rol-Nivel (US-019 AC-3 y AC-5) puedan consultar el nivel certificado de una persona.

## Source RCPs

- `RCP-001` — RCP-001 — H1 El idioma común

## Included User Stories

- `US-003` — US-003 — Certificar manualmente un nivel
  - Source: [https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md](https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md)
- `US-004` — US-004 — Consultar mi perfil de competencias
  - Source: [https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-004-consultar-mi-perfil-de-competencias.md](https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-004-consultar-mi-perfil-de-competencias.md)

## Excluded Work

- Propuestas de la IA (US-011, H3) y certificados de curso (US-010, H2); la propuesta de certificación a partir de un curso (H2, BR-ACR-14).
- La vista del perfil de otra persona (US-004 §Excluye; P-08 ya respondida: el resumen de niveles certificados es público, BR-TRA-03).
- La brecha frente a un Rol-Nivel (US-005) y la búsqueda de candidatos (US-006): consumen estas certificaciones, pero son otras historias.
- Certificar competencias de un Evaluador o del Jefe de Ingeniería: son gestores del programa y quedan fuera de la evaluación (BR-PRG-01, BR-PRG-02).
- La decisión de subir de nivel de rol: la regla vive en US-019 (BR-PRF-03); esta historia solo aporta los datos que ella consulta.
- El retorno a niveles previos de rol cuando una competencia se revoca (pendiente a futuro, DSP2-Q7).

## Dependencies and Constraints

**De qué depende:**
- **Catálogo (US-001, catalog-service):** competencias, sus versiones, rúbricas y requisitos de evidencia «requeridos» y «deseados» (BR-ACR-07, 09, 12, 13). *Inferencia a confirmar:* una certificación se refiere a la versión de la competencia vigente al certificar (IMD-001 R-46).
- **Personas (US-015) y anonimización (US-024):** el colaborador certificado debe ser vigente (EVD-2026-0217); si se anonimiza, sus certificaciones solo las ve ADMIN (EVD-2026-0218). El servicio necesita saber ambas cosas de party: consulta directa o composición en el BFF (abierto).
- **Evaluadores (US-020):** el rol `evaluador` existe en Keycloak (descrito como «Evaluador de competencias») y cualquier usuario con él puede certificar (EVD-2026-0199); los designa el Jefe de Ingeniería o ADMIN asignando ese rol (EVD-2026-0189).
- **Evidencias de formación:** en H1 se registran a mano; la conexión con cursos es H2.
- **Servicio:** ACP-002 prevé un «Certification Service» propio (PostgreSQL, puerto 3003). No existe: no tiene ADR, modelo de datos ni API, y DCP-002 lo deja fuera.

**Quién depende de este alcance:**
- **US-019 AC-3 y AC-5 (EVD-2026-0177):** subir de nivel se bloquea con `CERTIFICATION_UNAVAILABLE` hasta que exista una **consulta del nivel certificado vigente por persona y competencia**, con fecha y evaluador (el dato «Nivel certificado», derivado, de IMD-001). Esa consulta es lo que US-004 muestra al colaborador; **no es la pantalla de perfil lo que necesita US-019**, sino el dato. Ningún criterio de aceptación de US-003 ni de US-004 cubre hoy una consulta para otro servicio: hay que añadirlo.
- US-005 (brecha), US-006 (búsqueda) y US-011 (H3, reutiliza el flujo).

**Restricciones de negocio:**
- Solo un evaluador humano certifica; no hay certificación automática ni a partir de una propuesta de la IA (BR-ACR-02, BR-ACR-04); en H1 es manual (BR-ACR-05).
- Cada certificación registra quién, cuándo y con qué evidencia (BR-ACR-03); exige al menos una evidencia (BR-ACR-01) y todas las requeridas de ese nivel; las deseadas son opcionales (BR-ACR-09, 12).
- No se certifica un nivel sin requisitos de evidencia definidos y con al menos uno requerido (BR-ACR-13, EVD-2026-0149).
- Se evalúa contra la rúbrica del nivel (BR-CAT-15).
- Visibilidad: cualquier colaborador ve las certificaciones y su auditoría (BR-TRA-06) y el resumen de niveles (BR-TRA-03); qué se muestra de las calificaciones y del sustento sigue abierto (P-54).

**Orden de entrega sugerido (inferencia):** US-003 antes que US-004; ambas antes de habilitar US-019 AC-3 y AC-5.

**Posible circularidad por aclarar:** US-019 §11 y DSP-001 dicen que US-019 es prerrequisito de US-004, pero los criterios de US-004 no usan Rol-Nivel. Lo que realmente necesita US-019 es el dato de US-003, no la pantalla de US-004.

## QA and Acceptance Evidence

- **US-003:** AC-1 a AC-7 (certificar con evidencias, auditoría, manual en H1, requisitos requeridos y deseados, rúbrica) y sus negativos: sin evidencia no se certifica, nadie que no sea evaluador humano, falta una requerida, evidencia distinta de la definida, nivel sin requisitos definidos.
- **US-004:** AC-1 a AC-3 (nivel certificado con fecha, evaluador y evidencias; historial; estado vacío).
- **Falta y hay que añadir:** un criterio para la consulta del nivel certificado vigente que usa US-019, con su caso «persona sin certificación» y el significado de «vigente» cuando hay varias (P-14). Este pack no introduce reglas de negocio nuevas.
- Evidencia requerida: resultados de pruebas por criterio, contra PostgreSQL real, con pruebas de permiso (solo `evaluador`), de auditoría y de contrato con el consumidor US-019.

## Provider Handoff

The delivery team or supplier must implement only the included scope, provide test evidence, document deviations and raise any out-of-scope change for review.

## Open Questions and Blockers

**Bloquean el diseño del modelo y de la consulta que necesita US-019:**

| ID | Pregunta | Fuente | Por qué bloquea |
|---|---|---|---|
| ~~P-14~~ | ~~¿Una certificación vence, se revoca o se recertifica?~~ **Respondida (ianache, 2026-10-04):** se revoca o se recertifica (EVD-2026-0185); no menciona vencimiento (se asume que no vence). | US-003, BRC-001 | Define qué es «nivel certificado vigente» cuando hay varias |
| ~~DSP2-Q1~~ | ~~Si una competencia ya tiene un nivel certificado, ¿el vigente es la última certificación o la más alta? ¿Se puede certificar un nivel inferior? (US-003 lo deja «sin regla»)~~ **Respondida (ianache, 2026-10-04):** el vigente es el más alto de los vigentes y no se certifica un nivel inferior (EVD-2026-0186, 0187). | US-003 §Límite | Cálculo del nivel que consulta AC-5 |
| ~~DSP2-Q2~~ | ~~¿El Certification Service es un microservicio propio, como prevé ACP-002? Hace falta un ADR, como ADR-011~~ **Respondida (ianache, 2026-10-04):** microservicio nuevo y propio (EVD-2026-0188); ver ADR-013. | ACP-002, DCP-002 | Arquitectura |
| ~~RCP-Q1~~ | ~~¿Quién designa a los evaluadores? ¿Instructor y evaluador son el mismo rol?~~ **Respondida (ianache, 2026-10-04):** los designan el Jefe de Ingeniería o ADMIN (EVD-2026-0189); sigue abierto si instructor y evaluador son el mismo rol. | RCP-001 | Quién puede certificar |

**Nuevas preguntas derivadas de esas respuestas (abiertas):**

| ID | Pregunta |
|---|---|
| ~~DSP2-Q3~~ | ~~¿Una certificación vence? La respuesta habla de revocar y recertificar~~ **Respondida (ianache, 2026-10-04):** no vence (EVD-2026-0190). |
| ~~DSP2-Q4~~ | ~~¿Quién revoca una certificación, con qué motivo y auditoría?~~ **Respondida (ianache, 2026-10-04):** el Jefe de Ingeniería o ADMIN (EVD-2026-0191); el motivo tipificado, la descripción y la auditoría están en EVD-2026-0194. |
| ~~DSP2-Q5~~ | ~~¿Recertificar crea una certificación nueva del mismo nivel o reemplaza la anterior?~~ **Respondida (ianache, 2026-10-04):** crea una certificación nueva del mismo nivel que reemplaza la anterior (EVD-2026-0192). |
| ~~DSP2-Q6~~ | ~~Si se revoca la certificación que sostuvo una subida de nivel, ¿la persona conserva el Rol-Nivel asignado (US-019)?~~ **Respondida (ianache, 2026-10-04):** sí, la persona conserva el Rol-Nivel (EVD-2026-0193). |
| DSP2-Q7 (a futuro) | ¿Cómo tratar el retorno a niveles previos cuando una competencia se revoca? Pendiente de revisar más adelante (EVD-2026-0193); hoy la persona conserva el Rol-Nivel |
| ~~DSP2-Q8~~ | ~~¿La revocación exige un motivo, y cómo se audita?~~ **Respondida (ianache, 2026-10-04):** sí; motivo tipificado más una descripción de quien revoca que sustente la decisión, con registro de auditoría (EVD-2026-0194) |
| ~~DSP2-Q9~~ | ~~¿Cuáles son los motivos tipificados de revocación? Hace falta la lista (tipo de dato que se puede ampliar)~~ **Respondida (ianache, 2026-10-04):** `ERROR_DE_REGISTRO`, `EVIDENCIA_INVALIDA`, `REQUISITOS_NO_CUMPLIDOS` y `OTRO` (se retiró `CONFLICTO_DE_INTERES`, EVD-2026-0200), lista ampliable, descripción de hasta 1000 caracteres (EVD-2026-0195 a 0197). |
| ~~DSP2-Q10~~ | ~~¿Largo mínimo de la descripción de la revocación? Se entendió «1000 caracteres» como el máximo; el mínimo no se definió~~ **Respondida (ianache, 2026-10-04):** mínimo 10 caracteres; entre 10 y 1000 (EVD-2026-0201). |
| ~~DSP2-Q13~~ | ~~¿La certificación guarda una calificación o un sustento propios (aparte de la descripción de la revocación)? Hoy no figuran en ninguna historia; se supone que no~~ **Respondida (ianache, 2026-10-04):** una calificación simple CUMPLE / NO CUMPLE por evidencia (EVD-2026-0210, confirmada en EVD-2026-0214). |
| ~~DSP2-Q14~~ | ~~Un requisito puede exigir varias piezas (EVD-2026-0203): ¿dónde se declara la cantidad? El catálogo (LDM-002, `tb_evidence_requirement`) no tiene un campo de cantidad: ¿se añade una «cantidad mínima» o se declara un requisito por pieza?~~ **Respondida (ianache, 2026-10-04):** no hay cantidad por definir; un requisito obligatorio se cumple con al menos una pieza (EVD-2026-0208). El catálogo no necesita un campo de cantidad. |
| ~~DSP2-Q15~~ | ~~«Quienes tienen el rol evaluador» que ven la descripción de una revocación (EVD-2026-0206): ¿todos los evaluadores o solo quien certificó?~~ **Respondida (ianache, 2026-10-04):** cualquier evaluador (EVD-2026-0209). |

**No bloquean pero hay que decidir antes de construir:**

| ID | Pregunta | Responsable |
|---|---|---|
| ~~P-09~~ | ~~¿Un evaluador puede certificar a su propio equipo? ¿Qué hace Gestión de formación / RR. HH.?~~ **Respondida en parte (ianache, 2026-10-04):** un evaluador no puede certificar a su propio equipo (EVD-2026-0198); queda abierto qué hace Gestión de formación / RR. HH. **Segunda mitad diferida (2026-10-04):** no es relevante por ahora (EVD-2026-0212). | Responsable de producto |
| ~~DSP2-Q11~~ | ~~**Bloquea la regla de BR-ACR-17:** ¿qué es el «equipo» de un evaluador? ¿Sus reportes directos (relación de reporte, solo empleados, BR-PTY-19), su unidad organizacional o sus proyectos?~~ **Respondida (ianache, 2026-10-04):** ya no aplica: el rol reemplaza la regla del equipo (EVD-2026-0200). | Jefe de Ingeniería |
| ~~DSP2-Q12~~ | ~~**Respuesta del 2026-10-04 (EVD-2026-0199):** se habilita un rol de evaluador y cualquier usuario con él puede evaluar; se usa el rol `evaluador` existente. **Esto no define el «equipo»** de DSP2-Q11, que BR-ACR-17 sigue necesitando para saber a quién no puede certificar un evaluador. ¿Se mantiene BR-ACR-17 y se define el equipo, o la regla se reemplaza por el rol?~~ **Respondida (ianache, 2026-10-04):** el rol `evaluador` reemplaza la regla; se retira BR-ACR-17 y el motivo `CONFLICTO_DE_INTERES` (EVD-2026-0200). | Jefe de Ingeniería |
| ~~P-23~~ | ~~Equivalencias de evidencia (parcialmente respondida)~~ **Respondida (ianache, 2026-10-04):** sin equivalencias; un requisito puede exigir varias piezas (EVD-2026-0202, 0203). | Jefe de Ingeniería |
| ~~P-41~~ | ~~Cómo «refuerza» una evidencia deseada la certificación~~ **Respondida (ianache, 2026-10-04):** solo queda registrada y visible en H1; la marca «reforzada» queda abierta (EVD-2026-0205). | Jefe de Ingeniería |
| ~~P-54~~ | ~~Visibilidad de las calificaciones y del sustento del evaluador~~ **Respondida (ianache, 2026-10-04):** descripción de la revocación restringida; GitLab según BR-TRA-05 (EVD-2026-0206, 0207). Calificaciones y sustento de BR-CER-07: de cursos (H2). | Jefe de Ingeniería |
| ~~RCP-Q2~~ | ~~¿En H1 un evaluador registra a mano evidencia de GitLab?~~ **Respondida (ianache, 2026-10-04):** las evidencias las registra el colaborador y un evaluador no las registra a mano en H1 (EVD-2026-0215, 0221). | Jefe de Ingeniería |

**Camino para desbloquear US-019 (siguiente en la cadena, igual que con el catálogo):**
1. ~~Responder P-14 y DSP2-Q1~~ Hecho (EVD-2026-0185 a 0189); responder DSP2-Q3 a Q6.
2. ~~Actualizar el modelo conceptual (IMD-001)~~ Hecho el 2026-10-04: la evidencia es una entidad propia y R-20 y R-07 pasan a N : M (EVD-2026-0213).
3. ~~Modelo de datos~~ Hecho el 2026-10-04: [LDM-003](../../architecture/data-model/LDM-003-modelo-de-datos-de-certificaciones.md) y su DDL, probados en PostgreSQL; el ADR del Certification Service ya está aceptado (ADR-013).
4. API-SPEC con la consulta del nivel certificado y el alta de certificación.
5. UXR-003 y UXR-004 ya existen: faltan FLW, SCR y GEN.
6. DCP de este alcance.

## Definition of Ready

- Included stories have stable IDs, source URLs and validated acceptance criteria.
- Scope boundaries, dependencies and blockers are reviewed.
- Dev and QA responsibilities are understood.

## Definition of Done

- Included stories meet their acceptance criteria.
- Required tests and evidence are available.
- Traceability from RCP to story to delivery evidence is preserved.
