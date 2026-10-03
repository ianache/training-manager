---
artifact: development-context-pack
okf: google-okf-v0.2
id: DCP-003
title: Development Context Pack — Catálogo de roles y niveles (DSP-001)
generated: 2026-10-04
verified: false
status: REQUIRES_REVIEW
sources:
  - https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/scope-packs/DSP-001-catalogo-de-roles-y-niveles.md
  - https://github.com/ianache/training-manager/blob/main/knowledge-base/architecture/data-model/LDM-002-modelo-de-datos-del-catalogo.md
  - https://github.com/ianache/training-manager/blob/main/knowledge-base/architecture/data-model/ddl/catalog-postgresql.sql
  - https://github.com/ianache/training-manager/blob/main/knowledge-base/architecture/adrs/ADR-011-catalog-service-como-microservicio-propio.md
  - https://github.com/ianache/training-manager/blob/main/knowledge-base/architecture/api/API-SPEC-003-catalogo-de-roles-y-competencias.md
  - https://github.com/ianache/training-manager/blob/main/knowledge-base/design/screens/SCR-001-gestionar-catalogo-de-roles-y-competencias.md
  - https://github.com/ianache/training-manager/blob/main/knowledge-base/design/screens/SCR-019-asignar-rol-nivel.md
  - https://github.com/ianache/training-manager/blob/main/knowledge-base/design/generations/GEN-001-G-stitch-catalogo-de-roles-y-competencias.md
  - https://github.com/ianache/training-manager/blob/main/knowledge-base/design/generations/GEN-019-stitch-asignar-rol-nivel.md
provenance:
  created_by: development-handoff-builder
  method: derived-from-draft-design-and-architecture
  confidence: low
human-reviewed: false
---

# Development Context Pack — Catálogo de roles y niveles

**Estado: `REQUIRES_REVIEW`.** Todos los insumos están en `draft` o `Propuesto`; no hay revisión humana de ninguno. Las URL de `sources` apuntan a `main` del remoto y solo resolverán cuando esos archivos estén subidos (hoy son commits locales).

## Scope and identity

- Artifact ID: `DCP-003`
- Component or capability: catalog-service (nuevo), `GET/POST/PUT /api/v1/catalog/*` del BFF, pantallas de US-001 y US-019, y la asignación de Rol-Nivel en party.
- Context source: DSP-001 (RCP-001, RCP-002, US-001, US-019), con las decisiones EVD-2026-0143 a 0156.
- Owner: [PENDIENTE: responsable de desarrollo]

## Content

### Objective

Que el Jefe de Ingeniería defina roles, Rol-Nivel y competencias versionadas en un catálogo común, y que él o un ADMIN asignen Rol-Nivel a colaboradores vigentes; el catálogo real reemplaza al `catalog-stub` del asistente de alta.

### Included work

| Pieza | Fuente | Estado de la fuente |
|---|---|---|
| Servicio `catalog-service` (FastAPI, esquema propio en el PostgreSQL común, Alembic) | ADR-011 | Propuesto, sin decisor |
| 7 tablas con sus restricciones | LDM-002, `catalog-postgresql.sql` | draft; DDL probado en PostgreSQL |
| API de roles, competencias, versiones, rúbrica y requisitos | API-SPEC-003 | REQUIRES_REVIEW |
| Rutas `/api/v1/catalog/*` del BFF (existentes, hoy 503) y `CATALOG_SERVICE_URL` | `catalog.router.ts` | código existente |
| Rol `product_owner` | `realm-gestion-formacion.json`, `roles.ts` | **ya implementado** (commit `fc228f1`) |
| Pantallas SCR-001-01..04 y SCR-019-01..03 | SCR-001, SCR-019, GEN-001-G, GEN-019 | draft; exploración Stitch |
| Asignación de Rol-Nivel a personas (API y tabla en party) | LDM-001 DM-07, US-019 | **sin API-SPEC** |

### Excluded work

- Implementar el versionado de competencias **solo en comportamiento ya decidido** está incluido; quedan fuera sus extensiones: escala salarial, MOF y criterios de nivel (BR-CAT-18), rutas de formación (H2), flujo de evaluación del paso de nivel, bajar de nivel (EVD-2026-0166) y la certificación.
- Cursos asociados a un requisito de evidencia: solo la referencia lógica `course_ref` (otro dominio).

### Decisions and constraints

- Una versión nueva de competencia no altera las relaciones vigentes y es la vigente para nuevas asignaciones; la aprueba el Jefe de Ingeniería o ADMIN (EVD-2026-0143, 0144).
- Rol-Nivel apunta a una **versión** de competencia (LDM-002 CM-02); una competencia, una vez por Rol-Nivel, con L mayor en niveles superiores (EVD-2026-0148).
- Al menos un requisito de evidencia «requerido» por nivel L exigido (EVD-2026-0149); un rol necesita al menos una competencia (BR-CAT-20).
- Permisos: editan roles Jefe de Ingeniería, `product_owner` y ADMIN; requisitos de evidencia, Jefe y ADMIN; rúbricas, solo Jefe (si ADMIN también, por confirmar); aprobar versiones y desactivar o reactivar competencias, Jefe o ADMIN (EVD-2026-0144, 0159, 0168); asignar y cambiar Rol-Nivel, Jefe o ADMIN (EVD-2026-0163). Lectura abierta (EVD-2026-0118).
- «Cumplida» = competencia certificada en el L que exige el Rol-Nivel inferior (EVD-2026-0164); se exigen también las del nivel destino (EVD-2026-0169, interpretación a confirmar: cómo se evalúan antes de asignar) y ADMIN no puede saltarse el bloqueo (EVD-2026-0170); solo se sube de nivel (0166); solo colaboradores vigentes (0146).
- Pila: Python 3.11+ y FastAPI (ADR-008), PostgreSQL (ADR-007); UI Angular con `@gf/ui`, sin Material (decisión de `human:ianache` para DTC-015); solo escritorio (supuesto).
- Las reglas entre filas CHK-A a CHK-D de LDM-002 §5 las aplica el servicio; la base no puede.

### Assumptions and open questions

Supuestos del agente, marcados en las fuentes y **sin confirmar**:

- ~~Al aprobar una versión la anterior pasa a DEPRECATED; se desactiva en vez de eliminar; la versión incluye rúbrica y requisitos~~ Confirmado (EVD-2026-0152 a 0156, BR-CAT-23 a 26): no es supuesto.
- `levels[].evidence_requirements` = requisitos «requeridos» del nivel (AQ-2 de API-SPEC-003).
- Un nivel con personas asignadas no se puede quitar de un rol (AQ-5).
- Un solo borrador por competencia; nombres de rol y competencia únicos sin distinguir mayúsculas (CM-04, CM-10).

Preguntas abiertas: cómo se evalúan las competencias del nivel destino antes de asignar el nivel (interpretación de EVD-2026-0169), si ADMIN también edita rúbricas, el significado de `levels[].evidence_requirements` (AQ-2), quitar un nivel con personas asignadas (AQ-5), SCR-001-Q1 a Q4 y SCR-019-Q1 a Q3 (textos sin fuente, fecha «desde», responsive).

### Risks and dependencies

- **ADR-011 sin decisor:** construir el servicio sin esa decisión puede rehacerse.
- **Falta la API de asignación de Rol-Nivel** (party): API-SPEC-003 la excluye; hace falta una API-SPEC o ampliar API-SPEC-001 antes de implementar US-019.
- **Verificar contra el comprobador de AC-5:** necesita datos de certificación, que no existen (certificación fuera de alcance); sin ellos no se puede evaluar «competencias pendientes». **Dependencia bloqueante de US-019 AC-5.**
- **Sin servicio de certificación ni curso:** el bloqueo y `course_ref` quedan simulados o desactivados hasta que existan.
- **SQLite no detecta** errores de PostgreSQL (orden de INSERT, longitud de la revisión de Alembic, claves foráneas): las pruebas del servicio deben correr contra PostgreSQL real.
- **Consistencia entre servicios:** ids lógicos sin FK; un rol desactivado no debe invalidar asignaciones.
- **Diseño no gobernado:** solo hay exploración en Stitch; faltan diseño gobernado (Figma), informes de accesibilidad y aprobación humana.

## Verification

- Review: pendiente. Revisión del modelo y la API por `api-contract-reviewer`, `api-security-reviewer` y un humano. https://github.com/ianache/training-manager/blob/main/knowledge-base/architecture/data-model/LDM-002-modelo-de-datos-del-catalogo.md
- Traceability: RCP-001/002 → US-001/US-019 → UXR-001/019 → FLW-001/019 → SCR → GEN, y US → IMD-001 → LDM-002 → API-SPEC-003. https://github.com/ianache/training-manager/blob/main/knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
- Handoff: https://github.com/ianache/training-manager/blob/main/knowledge-base/requirement/scope-packs/DSP-001-catalogo-de-roles-y-niveles.md
- Test/evidence expectations: un caso por fila de errores de API-SPEC-003 §2 (400, 409, 412, 422); CHK-A a CHK-D; concurrencia en `approve` y `PUT`; autorización por rol (lectura abierta, `product_owner` solo roles, `admin` aprueba); advertencia de versión anterior tras aprobar v2; pruebas de contrato BFF y servicio con PostgreSQL real; accesibilidad WCAG 2.2 AA por pantalla.

## Implementation Contract (BINDING for Development)

Este contrato fija lo que debe implementarse; no hay desviaciones sin aprobación escrita de UX. **El contrato es provisional**: nace de diseños en exploración, y los hallazgos de GEN-001-G y GEN-019 siguen abiertos.

### Component Inventory (de SCR-001 y SCR-019; GEN-001-G y GEN-019 no etiquetan componentes)

| Componente | Biblioteca | Tipo | Props / validadores | Estados | A11y | Ref. |
|---|---|---|---|---|---|---|
| Nombre del rol | `@gf/ui` (CMP-015 Text-Input) | text-input | required; único; máx. 120 | normal, error, disabled | aria-required, aria-invalid | SCR-001-02 |
| Nivel esperado | `@gf/ui` (CMP-015 Select-Dropdown) | select | L1–L4, required | normal, error | aria-invalid | SCR-001-02 |
| Competencia | `@gf/ui` (CMP-015 Combobox-Search) | combobox | no repetir por nivel | cerrado, abierto, sin resultados | role combobox, aria-expanded | SCR-001-02 |
| Categoría, descripción, requerido/deseado | `@gf/ui` (CMP-015) | select, text-input, radio | required; descripción ≤300 | normal, error | aria-required | SCR-001-04 |
| Rol, nivel, fecha desde | `@gf/ui` (CMP-015 Select, Date-Input) | select, date | required | normal, error | etiqueta ligada | SCR-019-02 |
| Alertas y bloqueos | `@gf/ui` (CMP-015 Error-Alert) | alert | texto + icono | visible | `role="alert"` | todas |
| Confirmaciones | `@gf/ui` (CMP-015 Confirmation-Dialog) | dialog | — | visible | foco atrapado, Escape | SCR-001-02/04, 019-02 |
| Pestañas, tabla, estado vacío, insignia de estado, lista de asignaciones, editor de niveles | **sin CMP (brecha)** | — | — | — | — | SCR-001, SCR-019 |

**Bloqueo para el contrato:** los componentes en brecha no tienen diseño en `@gf/ui`; antes de implementarlos hay que pasar por `web-atomic-component-designer`.

### Acceptance Criteria for Implementation

- Props exactas de la tabla; validadores síncronos y asíncronos; estados de SCR-001 y SCR-019 con los textos de su especificación (los marcados «propuesto» están por confirmar).
- WCAG 2.2 AA y teclado completo; los hallazgos de accesibilidad de GEN-001-G (sin `aria-` en SCR-001-03) y GEN-019 (sin `role="alert"` en SCR-019-01 y 03) deben corregirse en la implementación.

### No Substitutions Policy

No sustituir `@gf/ui` por Material ni otra biblioteca; no omitir estados ni validadores; no cambiar atributos de accesibilidad ni la estructura sin aprobación de UX.

### Verification Workflow

1. Revisión de código contra este inventario. 2. Prueba visual contra GEN-001-G y GEN-019 (exploración, no gobernado). 3. Prueba de accesibilidad automática y manual WCAG 2.2 AA. 4. Compuerta final: todo en verde antes de integrar.

### Cross-References

- Diseño: GEN-001-G y GEN-019. Flujos: FLW-001 y FLW-019. Criterios: SCR-001 y SCR-019. Plan de implementación: PLAN-XXX (por crear).

## Next action

- Owner: Jefe de Ingeniería (decisor), con arquitectura y UX.
- Action: (1) decidir ADR-011; (2) responder las preguntas abiertas de «Assumptions» (nivel destino, rúbrica de ADMIN, AQ-2, AQ-5); (3) diseñar la API de asignación de Rol-Nivel en party; (4) pasar `web-atomic-component-designer` por las brechas; (5) revisiones de contrato, seguridad y accesibilidad; (6) diseño gobernado y aprobación humana.
- Gate: pasar a `READY_FOR_DEV` exige ADR-011 aceptado, API de asignación diseñada, brechas de componentes resueltas, accesibilidad revisada y aprobación humana. Hoy no se cumple ninguno.
