---
artifact: development-context-pack
okf: google-okf-v0.2
id: DCP-004
title: Development Context Pack — Gestión de la estructura organizacional (US-017, US-028, US-029, US-030)
generated: 2026-10-04
verified: false
status: READY_FOR_DEV
sources:
  - /knowledge-base/requirement/user-stories/US-017-gestionar-estructura-organizacional.md
  - /knowledge-base/requirement/user-stories/US-028-listar-y-buscar-unidades-organizacionales.md
  - /knowledge-base/requirement/user-stories/US-029-registrar-y-editar-unidades-organizacionales.md
  - /knowledge-base/requirement/user-stories/US-030-desactivar-y-reactivar-unidades-organizacionales.md
  - /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - /knowledge-base/design/ux-requirements/UXR-017-registrar-la-organizacion-interna.md
  - /knowledge-base/design/specs/UXS-001-gestion-de-unidades-organizacionales.md
  - /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
  - /knowledge-base/design/screens/SCR-028-listar-y-buscar-unidades-organizacionales.md
  - /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
  - /knowledge-base/design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md
  - /knowledge-base/design/generations/GEN-017-stitch-registrar-la-organizacion-interna.md
  - /knowledge-base/design/generations/GEN-028-stitch-listar-y-buscar-unidades-organizacionales.md
  - /knowledge-base/design/generations/GEN-029-stitch-registrar-y-editar-unidades-organizacionales.md
  - /knowledge-base/design/generations/GEN-030-stitch-desactivar-y-reactivar-unidades-organizacionales.md
  - /knowledge-base/design/handoff/HOF-PPM-002-gestion-unidades-organizacionales.md
  - /knowledge-base/design/handoff/ARP-UNIDADES-REGENERACION-v2.md
  - /knowledge-base/architecture/api/API-SPEC-002-organizations.md
  - /knowledge-base/architecture/api/API-SPEC-006-gestion-de-unidades-organizacionales.md
  - /knowledge-base/design/components/CMP-017-componentes-gestion-de-unidades.md
provenance:
  created_by: development-handoff-builder
  method: derived-from-draft-design-and-architecture
  confidence: low
human-reviewed: false
---

# Development Context Pack — Gestión de la estructura organizacional

**Estado: `READY_FOR_DEV`, por decisión de ianache (Jefe de Ingeniería) del 2026-10-04.** El gate `DESIGN_READY_FOR_DEV` de `HOF-PPM-002` está en **`PASSED`** con revisión humana aprobada (ver sus desviaciones aceptadas), y API-SPEC-006 y CMP-017 están aprobados por ianache. El diseño de referencia es solo Stitch (Figma descartado) y sigue siendo exploración aprobada por ianache, no un diseño gobernado en Figma.

**Condiciones abiertas que ianache acepta como no bloqueantes al pasar a `READY_FOR_DEV`** (el agente las declara; el pack no las resuelve):

| Condición | Qué implica para Desarrollo |
|---|---|
| Carga de la organización interna sin decidir (BR-PTY-28, DTC-017) | **No implementar US-017** hasta decidirla; el resto (US-028, 029, 030) puede avanzar |
| 7 brechas de CMP-017 sin diseño atómico | Pasar cada una por `web-atomic-component-designer` **antes** de construirla |
| API-SPEC-006 sin `api-contract-reviewer` ni `api-security-reviewer` | Hacer ambas revisiones antes de exponer las rutas |
| Q-4 a Q-8 de API-SPEC-006 abiertas | Resolverlas al llegar a cada pieza: árbol (Q-4), unidad inactiva (Q-5), unidad superior (Q-6), `code`/`location` (Q-7) y concurrencia (Q-8) |
| Índice de unicidad del nombre por padre sin migración | Escribir la migración (posterior a `0005`) antes del `PATCH` y del cambio de padre |
| Diálogos: foco atrapado, Escape y retorno del foco | Obligación de la implementación (aceptado en el gate) |
| 13 pruebas de integración anteriores fallan en PostgreSQL | Corregirlas o aislarlas antes de apoyarse en esa suite |

## Scope and identity

- Artifact ID: `DCP-004`
- Capacidad: estructura organizacional de COMSATEL (SPEC-001 C3): organización interna, listado y búsqueda de unidades, alta y edición, cambio de unidad padre, desactivar, reactivar e historial.
- Componentes afectados: `party-management-service` (recurso `/organizations`), `bff` (rutas `/api/v1/organizations`), `portal` (`mfe-collaborators`, páginas nuevas) y `@gf/ui` (componentes nuevos).
- Context source: US-017, US-028, US-029, US-030 (todas `READY` y `draft`, con la validación del PO de US-017 heredada), BRC-001 (BR-PTY-02 a 04, 07, 12, 17, 21 a 26) y EVD-2026-0133 a 0142.
- Owner: [PENDIENTE: responsable de desarrollo]

## Content

### Objective

Que el Jefe de Ingeniería registre la organización interna y gestione sus unidades: consultar con búsqueda, filtros y orden, registrar, renombrar, cambiar el padre sin ciclos ni duplicados, desactivar (con bloqueo por dependencias) y reactivar, con vigencias y auditoría, sin borrar nada.

### Included work

| Pieza | Fuente | Estado de la fuente |
|---|---|---|
| Registrar la organización interna (RUC) | US-017 | **fuera de la API gestionada** (BR-PTY-28, EVD-2026-0240): registro único; falta definir cómo se carga (DTC-017) |
| Listado ampliado: `ancestor_id`, orden por padre/estado/vigencia, `from_date`/`thru_date`, conteos, `view=tree` | US-028, API-SPEC-006 §3.1 | propuesto; `GET /organizations` existente cubre solo parte |
| `PATCH` del nombre con auditoría del valor anterior | US-029 AC-2 | propuesto; historial en `tb_organization_name_history` (migración 0005, ya en el código; falta la lógica del servicio) |
| `POST …/parent`: cambio de padre con cierre y apertura de vigencia, ciclo, padre inactivo y nombre repetido | US-029 AC-3 a 6 | propuesto |
| `POST …/deactivate` y `…/reactivate`, con `ORGANIZATION_HAS_DEPENDENCIES` y `PARENT_INACTIVE` | US-030 | propuesto |
| `GET …/relationships` (historial) | SCR-029-04 | propuesto |
| Migración 0005 (historial del nombre) | API-SPEC-006 §5 | **hecha** (commit `8df2d92`, probada en PostgreSQL 15); falta una migración para el índice de unicidad del nombre por padre |
| Rutas del BFF con `requireAnyRole(Role.JefeIngenieria, Role.Admin)`; `LIST_QUERY` ampliado | `organizations.router.ts` | código existente a ampliar |
| Páginas del portal: organización interna, listado (lista y árbol), formularios, diálogos e historial | SCR-017, 028, 029, 030 | diseño exploratorio en Stitch |
| Componentes nuevos de `@gf/ui` (7 brechas) | CMP-017 | **sin diseño atómico** |

### Excluded work

- Pertenencia de una persona a una unidad (US-015 y US-016) y la baja de colaboradores.
- Proveedores (US-018).
- Gestión de contactos de la organización más allá de lo que ya hace `POST` (API-SPEC-002 §8b).
- Vista responsive: solo escritorio (supuesto heredado de SCR-015/016; SCR-017-Q6).
- Cambiar el RUC o la razón social de la organización interna una vez registrada (UXR-017-Q2, sin decidir).

### Decisions and constraints

- **Un solo recurso `/organizations`**, sin `/units` (ID-1 de API-SPEC-002).
- **No se borra:** desactivar cierra vigencias y reactivar abre una nueva (BR-PTY-12, BR-PTY-21, BR-PTY-24).
- **Sin ciclos** (BR-PTY-22), **padre solo Activo** (BR-PTY-25), **nombre único entre unidades con el mismo padre** (BR-PTY-26), **no se desactiva con hijas activas ni personas vigentes** (BR-PTY-23).
- **Estados de la API en minúsculas** (`active`/`inactive`): BR-CAT-27 no se propaga a party (EVD-2026-0162). La interfaz muestra «Activa»/«Inactiva».
- **Permiso:** Jefe de Ingeniería **y ADMIN** (EVD-2026-0142 y EVD-2026-0238); la pantalla de gestión no es de los demás colaboradores.
- **Correo laboral obligatorio** al registrar una unidad (BR-PTY-27, EVD-2026-0239).
- **Solo unidades y proveedores se gestionan** por la API; la organización interna es un registro único (BR-PTY-28).
- Pila: Python 3.11+ y FastAPI (ADR-008), PostgreSQL (ADR-007), Angular con `@gf/ui` **sin Material** (decisión de `human:ianache` para DTC-015), solo escritorio.
- Éxito y vigencia en verde del design system (`success`), siempre con icono y texto (decisión de `human:ianache`, 2026-10-03).
- El diálogo de resumen del cambio de padre muestra solo «{unidad}: de X a Y»; la columna «Hasta» del historial va vacía en la relación vigente (decisiones de `human:ianache`, 2026-10-03).

### Assumptions and open questions

Supuestos del agente, **sin confirmar**:

- `If-Match`/`row_version` para la concurrencia de `PATCH` y cambio de padre.
- Los textos de mensajes de error al guardar, de carga y de sin permisos son de muestra.

Preguntas abiertas que condicionan la implementación:

- **API-SPEC-006 Q-1 (resuelta 2026-10-04):** `contact.email_work` («Correo laboral *») ya está en US-029, SCR-029, UXR-029, FLW-029, CMP-017 y en la hoja v6 de SCR-029-01. Falta propagar la regla a la API (validación y contrato de `POST`).
- Q-2 (resuelta: ADMIN también gestiona), Q-3 (sin objeto: la organización interna queda fuera de la API gestionada, BR-PTY-28), Q-4 (volumen y profundidad del árbol), Q-5 (editar una unidad inactiva), Q-6 (unidad superior), Q-7 (`code` y `location` en pantalla), Q-8 (concurrencia) y Q-9 (resuelta: tabla `tb_organization_name_history`, migración 0005).
- Las **44 preguntas de diseño** fusionadas en UXS-001 (21 de ellas de negocio), de las que ninguna se resolvió salvo las decididas el 2026-10-03.

### Risks and dependencies

- **Gate de diseño sin pasar:** `HOF-PPM-002` `FAILED` (23 hallazgos). Secciones A a N ya redactadas. Falta: aprobación humana del diseño de Stitch por pantalla (`register-governed-stitch`), informes de accesibilidad en `pass` (SCR-017-02 y SCR-029-02 ya lo están; SCR-028-01, 029-01, 029-03 y 029-04 tienen fallos pequeños anotados; faltan SCR-017-01, 017-03 y SCR-030-01 a 04) y la revisión humana del gate.
- **Diseño parcialmente consolidado:** hay hoja consolidada registrada en el DTM para SCR-017-02, 028-01, 029-01 (v6), 029-02, 029-03 y 029-04; el resto de las pantallas conserva sus hojas por estado.
- **Accesibilidad:** ianache aprobó C1 a C9 de CHK-UNIDADES-001 en las seis hojas consolidadas (2026-10-04); faltan las pruebas específicas por pantalla y las pantallas no consolidadas.
- **Componentes sin diseño:** tabla ordenable, árbol y diálogo (con foco atrapado) son de alto riesgo.
- **Historial del nombre:** la tabla existe (migración 0005); falta escribirla desde el servicio para cumplir AC-2 de US-029.
- **Conteos y árbol:** `active_children_count`, `current_people_count` y la consulta recursiva pueden ser costosos; sin volumen esperado no se puede dimensionar (Q-4).
- **Contrato publicado:** `status` en minúsculas convive con `ACTIVE` del catálogo.
- **SQLite no detecta** errores de PostgreSQL: las pruebas de la API deben correr contra PostgreSQL real. En PostgreSQL ya fallan 13 pruebas de integración anteriores a esta capacidad (orden de inserción de claves foráneas en las pruebas): conviene corregirlas antes de apoyarse en esa suite.
- **Dependencias de datos:** el conteo de personas vigentes depende de la pertenencia persona ↔ unidad que registra US-015 (implementación en curso).

## Verification

- Review: pendiente. Revisión de API-SPEC-006 por `api-contract-reviewer` y `api-security-reviewer`; de CMP-017 por `web-atomic-component-designer`; y revisión humana de ambos.
- Traceability: US-017/028/029/030 → UXR → FLW → SCR → GEN (Stitch) → CMP-017, y US → BRC-001 → IMD-002 → API-SPEC-006. Cobertura de criterios en la tabla de abajo.
- Handoff: HOF-PPM-002 (gate `FAILED`).
- Test/evidence expectations: un caso por criterio de aceptación (18 en total) y por fila de error de API-SPEC-006 §3; contra PostgreSQL real; concurrencia de dos cambios de padre; autorización por rol; prueba de accesibilidad manual con CHK-UNIDADES-001 (teclado, foco atrapado, zoom 200 %, lector de pantalla).

### Cobertura de criterios

| Historia | Criterios | Endpoint / pieza | Pantalla | Regla |
|---|---|---|---|---|
| US-017 | AC-1, AC-2 | `POST /organizations` (`internal_organization`) | SCR-017-01 a 03 | BR-PTY-02, 03, 07 |
| US-028 | AC-1 a 6 | `GET /organizations` ampliado, `view=tree` | SCR-028-01 | BR-PTY-04, 21; EVD-2026-0133 |
| US-029 | AC-1 | `POST /organizations` (`internal_unit`) | SCR-029-01 | BR-PTY-03, 04, 21 |
| US-029 | AC-2 | `PATCH /organizations/{id}` + auditoría | SCR-029-02 | BR-PTY-12 |
| US-029 | AC-3 | `POST …/parent` | SCR-029-03 | BR-PTY-12 |
| US-029 | AC-4 a 6 | `POST …/parent` (ciclo, inactivo, nombre repetido) | SCR-029-01, 03 | BR-PTY-22, 25, 26 |
| US-030 | AC-1, AC-2 | `POST …/deactivate` | SCR-030-01, 02 | BR-PTY-12, 21, 23 |
| US-030 | AC-3, AC-4 | `POST …/reactivate` | SCR-030-03, 04 | BR-PTY-24 |
| SCR-029-04 | historial | `GET …/relationships` | SCR-029-04 | BR-PTY-12 |

## Implementation Contract (BINDING for Development)

**El contrato es provisional:** nace de diseños en exploración y de un contrato de API sin revisar. Fija lo que se debe implementar; no hay desviaciones sin aprobación escrita de UX.

### Component Inventory

El inventario completo, con la cobertura de cada componente frente a `@gf/ui`, está en [CMP-017](../../design/components/CMP-017-componentes-gestion-de-unidades.md). Resumen:

| Grupo | Componentes | Cobertura |
|---|---|---|
| Existen en `@gf/ui` | `text-input`, `select`, `date-input`, `button`, `badge`, `alert`, `error-message`, `spinner`, `empty-state`, `view-state`, `form-field`, `autocomplete` | verificar `autocomplete` (filtro por estado y exclusión de descendientes) y el tono `success` del `badge` |
| **Brechas** | lista de descripción, tabla ordenable, árbol, diálogo, grupo de alternancia, chip de filtro, paginación, migas de pan | **sin diseño**: antes, `web-atomic-component-designer` |

### Acceptance Criteria for Implementation

- Props y estados de la tabla de CMP-017, con los textos exactos de los SCR (los marcados «propuesto» o «de muestra» están por confirmar).
- Todos los criterios de aceptación de US-017, 028, 029 y 030 pasan sus pruebas, incluidos los casos negativos (ciclo, padre inactivo, nombre repetido, bloqueo por dependencias, RUC repetido, sin permisos).
- Auditoría de cada cambio con valor anterior; ningún borrado físico (prohibido `DELETE` para la cuenta de la aplicación).
- WCAG 2.2 AA y teclado completo: foco atrapado y retorno en diálogos, `aria-sort`, árbol operable con flechas, errores con `role="alert"`, cargas y éxitos con `role="status"`, iconos `aria-hidden`, foco visible 2 px.

### No Substitutions Policy

No sustituir `@gf/ui` por Material ni otra biblioteca; no omitir estados ni validadores; no cambiar atributos de accesibilidad ni la estructura sin aprobación de UX; no inventar campos (contacto, `code`, `location`) en los formularios mientras Q-1 y Q-7 estén abiertas.

### Verification Workflow

1. Revisión de código contra CMP-017 y API-SPEC-006. 2. Pruebas de la API contra PostgreSQL real. 3. Prueba visual contra las hojas consolidadas de Stitch (exploración, no gobernado). 4. Prueba de accesibilidad automática y manual (CHK-UNIDADES-001). 5. Compuerta final: todo en `pass` antes de integrar.

### Cross-References

- Diseño: GEN-017, GEN-028, GEN-029, GEN-030. Flujos: FLW-017, 028, 029, 030. Criterios: SCR-017, 028, 029, 030. Plan de implementación: PLAN-XXX (por crear).

## Fases propuestas

Orden por dependencia, sin estimaciones (las hace el equipo):

1. **Contrato y datos:** Q-1 a Q-3 y Q-9 respondidas y migración 0005 hecha; falta el índice de unicidad del nombre por padre, revisar API-SPEC-006 y decidir cómo se carga la organización interna.
2. **Servicio:** organización interna, listado ampliado, `PATCH`, cambio de padre, desactivar, reactivar e historial, con pruebas contra PostgreSQL.
3. **BFF:** rutas y consulta permitida.
4. **Componentes:** diseñar y construir las brechas de CMP-017.
5. **Portal:** páginas de SCR-017, 028, 029 y 030, integradas con el BFF.
6. **Calidad:** accesibilidad manual, regresión de US-015 (que usa la lista de unidades) y revisión humana del diseño.

**Despliegue y reversión:** la migración es aditiva; revertir es eliminar la tabla y el índice nuevos, sin dependencias entrantes. Las rutas nuevas del BFF son aditivas y se pueden retirar sin tocar las existentes.

## Next action

- Owner: Jefe de Ingeniería (decisor), con arquitectura y UX.
- Action: (1) registrar la aprobación humana del diseño de Stitch por pantalla (`register-governed-stitch --approved-by human:<id>`) y la revisión humana del gate; (2) completar las pruebas específicas de CHK-UNIDADES-001 y los informes de accesibilidad de SCR-017-01, 017-03 y SCR-030-01 a 04; (3) regenerar las hojas con fallos anotados (SCR-029-01, 029-03, 029-04, 028-01); (4) pasar CMP-017 por `web-atomic-component-designer`; (5) revisar API-SPEC-006 con `api-contract-reviewer` y `api-security-reviewer`; (6) decidir cómo se carga la organización interna (DTC-017); (7) responder Q-4 a Q-8.
- Gate: pasar a `READY_FOR_DEV` exige gate `DESIGN_READY_FOR_DEV` en `PASSED` con aprobación humana, brechas de componentes diseñadas y API-SPEC-006 revisada. Q-1, Q-2 y Q-9 están resueltas y la migración 0005 hecha; el gate de diseño, las brechas de componentes y la revisión del contrato siguen pendientes.
