# 01 — INVENTORY

Fecha: 2026-10-01 · Alcance: Skills UX/UI en `.claude/skills/` · Estado: **solo lectura** (nada modificado al escribir este documento).

## 1. Skills UX/UI encontrados

Ningún Skill UX/UI tiene `manifest.yaml`. La versión vigente es la implícita en `generated.by: <skill>/1.0` de sus plantillas.

| Skill | Curso | Versión actual | Frontmatter `SKILL.md` | Archivos | Observaciones |
|---|---|---|---|---|---|
| ux-requirements-analyzer | UX-101 | 1.0 (implícita) | **No** | SKILL.md, templates/concept-template.md, examples/example.md | Contrato genérico |
| user-flow-designer | UX-101 | 1.0 | **No** | ídem | Contrato genérico |
| ui-spec-writer | UX-102 | 1.0 | **No** | ídem | Añade "Implementation Requirements" (Component Inventory, checklist, handoff a Dev; `@gf/ui` v1.1.0, Angular 22) |
| accessibility-reviewer | UX-102..106 | 1.0 | **No** | ídem | Contrato genérico |
| claude-design-orchestrator | UX-103 | 1.0 | **No** | ídem | Contrato genérico |
| stitch-ui-generator | UX-104 | 1.0 | Sí, **pero con cambio sin confirmar** | ídem | Ver §3.1 |
| figma-design-validator | UX-105 | 1.0 | **No** | ídem | Contrato genérico |
| ux-development-handoff | UX-106 | 1.0 | **No** | ídem | Añade "Implementation Requirements" y "Pre-Handoff Quality Gate" que apuntan a `development-handoff-builder` |

Skills vecinos con convención más completa (referencia, no se modifican):

| Skill | Versión | Estructura |
|---|---|---|
| development-scope-pack-builder | manifest | manifest.yaml, README, references/, scripts/, tests/ (pytest) |
| gitlab-work-publisher | 0.1.1 | manifest.yaml, scripts/validators.py, tests/ |
| development-handoff-builder (consumidor downstream) | 0.2.0 | manifest.yaml, README, templates/development-context-pack.md |

Entorno de verificación disponible: Python 3.11.9, pytest 7.4.3, PyYAML 6.0.2.

## 2. Artefactos reales del repositorio (`knowledge-base/design/`)

| Tipo | Existente | Notas |
|---|---|---|
| UXR | UXR-000..006, 015, 016 | |
| FLW | FLW-015, FLW-016 | La relación FLW→SCR existe solo en prosa |
| SCR | SCR-015 (un archivo con SCR-015-01…-NN) | **Granularidad:** una "SCR" agrupa pantallas con ID `SCR-015-NN`. Los IDs de `GEN-001` (SCR-001..003) son *candidatas* de Stitch |
| CMP | CMP-015 (un archivo, 11 componentes) | Sin IDs por componente |
| TKN | **ninguno** | No hay design system corporativo (UXR-Q4) |
| DD | **ninguno** | |
| GEN (Stitch) | GEN-001, GEN-002, GEN-015 | GEN-015 solo tiene prompts, sin IDs de artefactos Stitch |
| HOF | **ninguno** en `knowledge-base/design/` | Existe `ad-handoff/DCP-002-VALIDADO` (arquitectura) con gate `READY_FOR_DEV` (RFD-001) |

## 3. Hallazgos que condicionan el diseño del cambio

### 3.1 `stitch-ui-generator/SKILL.md` está dañado en el working tree
`git diff` muestra un cambio **sin confirmar**: se añadió frontmatter, pero se borró la sección `## Course` (UX-104) y el `## Purpose` quedó **truncado** ("…y registrar "). El `HEAD` tiene el texto correcto: "Generar UI reproducible en Stitch y registrar lineage de variantes." Se reescribe el Skill completo; el truncamiento no se conserva.

### 3.2 Ya existe un proyecto Stitch real, no gobernado
`GEN-001`, `GEN-002` y `components/ui-inventory.md` citan `projects/7424057371727816981` como proyecto existente. No existe un concepto que lo registre como "Stitch Design Project" ni se declara su iniciativa. El Skill actual no impide crear otro. La migración debe registrar **esa** referencia real, no inventar una.

### 3.3 Siete de ocho Skills no tienen frontmatter
Sin `name`/`description`, el índice de Skills muestra el nombre como descripción y no hay criterio de activación. Se añade frontmatter a todo Skill que se modifique.

### 3.4 Taxonomía de errores
No hay taxonomía de códigos de validación UX en el repositorio (búsqueda de `ORPHAN_`, `MISSING_FLOW`, `DESIGN_READY` sin resultados). Se crea una sola, la del prompt maestro. El gate `READY_FOR_DEV` de `RFD-001` es el precedente del nombre y de la decisión humana firmada.

### 3.5 Convenciones OKF vigentes (`AGENTS.md`)
Frontmatter `type/title/description/tags/status/generated{by,at}/sources[{id,resource}]`; `status: draft`; `generated.by = <skill>/<versión>`; `generated.at` ISO-8601 `-05:00`; jamás `verified`; `index.md` y `changelog.md` de `knowledge-base/` se actualizan con cada cambio. No hay un documento de especificación OKF v0.2 en el repositorio: se respeta la convención observada.

### 3.6 Datos que NO existen y que no se inventan
`FLW-008`, `US-027`, `UXR-012`, `SCR-021..023`, `STP-CL2-TENANT-001` y CLocator2 **no existen** en el repositorio (el producto real es la Plataforma de Gestión de Formación). Se usarán solo como caso ilustrativo del E2E, en un árbol aislado con marcas `PLACEHOLDER`.
