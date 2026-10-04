---
artifact: development-scope-pack
okf: google-okf-v0.2
id: DSP-001
title: Catálogo de roles y niveles
generated: '2026-10-03'
verified: false
status: REQUIRES_REVIEW
sources:
- https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
- https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
- https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-001-definir-catalogo-de-competencias.md
- https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-019-asignar-rol-nivel.md
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

# Catálogo de roles y niveles

## Scope and Identity

- Scope ID: `DSP-001`
- Product: `Plataforma de Gestión de Formación`
- Scope state: `DRAFT`
- Sprint: Not assigned; candidate scope for Scrum planning.

## Objective

Que el Jefe de Ingeniería defina roles, niveles y competencias en un catálogo común, y que el asistente de alta pueda asignar un Rol-Nivel.

## Source RCPs

- `RCP-001` — RCP-001 — H1 El idioma común
- `RCP-002` — RCP-002 — Gestión de colaboradores

## Included User Stories

- `US-001` — US-001 — Definir el catálogo de roles y competencias
  - Source: [https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-001-definir-catalogo-de-competencias.md](https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-001-definir-catalogo-de-competencias.md)
- `US-019` — US-019 — Asignar un Rol-Nivel a una persona
  - Source: [https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-019-asignar-rol-nivel.md](https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/user-stories/US-019-asignar-rol-nivel.md)

## Excluded Work

- Implementar el versionado de competencias (BR-CAT-22: se versionan las competencias, no los roles). Su comportamiento ya está decidido (P-50.1, P-50.2; ver Open Questions) pero no entra en este alcance.
- Rutas de formación (H2).
- Escala salarial de los niveles, MOF y criterios de nivel como años de experiencia (BR-CAT-18, P-40).
- Roles del programa, Evaluador y Jefe de Ingeniería (US-020): no son Rol-Nivel del catálogo.
- El flujo de evaluación del paso al siguiente nivel (P-42 decide quién: Jefe de Ingeniería o ADMIN); aquí solo se asigna y se cambia el nivel.

## Dependencies and Constraints

- **Dependencia fuera de este alcance (EVD-2026-0177):** US-019 AC-3 y AC-5 dependen de US-003 (certificar un nivel) y US-004 (perfil de competencias), que **no están en DSP-001** y se planifican en [DSP-002](DSP-002-certificacion-y-perfil.md); hasta entonces subir de nivel se bloquea. Las reglas de DSP-001 sobre «prerrequisito de US-004» se refieren al rol y nivel que muestra el perfil, no a este bloqueo: posible circularidad entre US-019 y US-004 por aclarar.
- **Orden de entrega:** US-001 antes que US-019; la asignación consume los Rol-Nivel que define el catálogo (US-019 §11).
- **US-015 (alta de colaborador):** el nivel inicial se asigna al registrar (P-28); el paso «Rol-Nivel inicial» del asistente lee hoy el catálogo simulado `catalog-stub` (solo desarrollo), que este alcance sustituye.
- **Permisos:** el Jefe de Ingeniería modifica el catálogo y asigna Rol-Nivel (BR-CAT-04, BR-CAT-16, BR-CAT-19); por decisión del 2026-10-03 también ADMIN (aprobar versiones, cambiar niveles directamente) y el Responsable de Producto (editar roles, sin límite por producto); todo colaborador lo consulta en lectura (AC-12).
- **Restricciones del catálogo:** un rol tiene al menos una competencia (BR-CAT-20); una competencia no se repite dentro de un rol (BR-CAT-21); no se exige un nivel L sin requisitos de evidencia definidos (BR-ACR-13); los niveles de rol y su cantidad los define cada rol (BR-CAT-09).
- **Restricciones de la asignación:** varios roles por persona, un solo nivel vigente por rol; cambiar de nivel cierra la asignación anterior.
- **Prerrequisito de:** US-002, US-005, US-006 (por US-001) y US-004, US-005 (por US-019).

## QA and Acceptance Evidence

- **US-001:** AC-1 a AC-13 (alta de rol con niveles y competencias, rechazo de competencia sin nivel o fuera de L1–L4, requisitos de evidencia requeridos/deseados, lectura sin edición para no jefes, catálogo inicial con los 7 roles de AC-6).
- **Negativos US-001:** usuario sin permiso no modifica catálogo, evidencias ni rúbricas; rol sin competencias; competencia repetida en un rol; nivel sin evidencias.
- **US-019:** criterios AC de asignar y cambiar Rol-Nivel, con historial; probar el cierre de la asignación anterior.
- Evidencia requerida: resultados de pruebas por criterio, trazables al ID del AC. Este pack no introduce reglas nuevas.

## Provider Handoff

The delivery team or supplier must implement only the included scope, provide test evidence, document deviations and raise any out-of-scope change for review.

## Open Questions and Blockers

### Decisiones registradas (ianache, Jefe de Ingeniería, 2026-10-03)

Ya constan en BRC-001 (EVD-2026-0143 a 0151) y en US-001 y US-019.

| ID | Decisión | Efecto en este alcance |
|---|---|---|
| P-50.1 | Una versión nueva de competencia no altera lo vigente; pasa a ser la vigente para nuevas asignaciones, con advertencia donde se referencie una anterior (EVD-2026-0143) | El versionado sigue fuera del alcance; comportamiento definido |
| P-50.2 | Aprueba el Jefe de Ingeniería o ADMIN (EVD-2026-0144) | Idem |
| P-42 | Decide el paso de nivel el Jefe de Ingeniería o ADMIN, y ADMIN cambia el nivel directamente (EVD-2026-0145, 0151) | US-019 y BR-CAT-04 admiten a ADMIN para cambiar nivel |
| US-019-Q1 | Solo colaboradores vigentes (EVD-2026-0146) | US-019 rechaza personas no vigentes |
| P-06 | El Responsable de producto edita roles; los roles son comunes, sin límite por producto (EVD-2026-0147, 0150) | Permiso de edición del catálogo ampliado |
| AC-13 | Competencia exigible en Rol-Nivel superior con L mayor (EVD-2026-0148) | BR-CAT-21 confirmada |
| BR-ACR-13 | Al menos un requisito «requerido» (EVD-2026-0149) | Criterio de aceptación verificable |

### Pendientes

- **Interpretación a confirmar (EVD-2026-0150):** se entendió que el Responsable de producto edita cualquier rol del catálogo, sin límite por producto; la respuesta no lo dice literalmente.
- **Ámbito de producto:** US-001 es de toda la plataforma y no se ata a un producto.
- No quedan bloqueos duros; el pack puede pasar a revisión humana.

## Definition of Ready

- Included stories have stable IDs, source URLs and validated acceptance criteria.
- Scope boundaries, dependencies and blockers are reviewed.
- Dev and QA responsibilities are understood.

## Definition of Done

- Included stories meet their acceptance criteria.
- Required tests and evidence are available.
- Traceability from RCP to story to delivery evidence is preserved.
