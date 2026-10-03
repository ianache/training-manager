# 03 — CHANGE DESIGN

Principio: **un solo lugar por hecho**. Se agregan tres conceptos nuevos (STP, DTM, HOF), campos aditivos en SCR/FLW, y un validador compartido. Nada más.

## 1. Modelo de conocimiento

```
STP (Design Project)  1 ── n  DTM entry  n ── 1  SCR  n ── 1  FLW
                                  │
                                  ├─ exploration_design  (Stitch: project_ref → STP, artifact_ref, version)
                                  ├─ governed_design     (Figma: file_ref, node_ref, version)
                                  ├─ components [CMP], tokens [TKN]
                                  └─ stitch_figma (divergence + decision DD)
HOF (UX Development Handoff) ── dtm → DTM, screens → SCR, gate record, open questions
```

### 1.1 STP — Stitch Design Project (`knowledge-base/design/projects/STP-*.md`)
```yaml
id: STP-CL2-TENANT-001
type: Design Project
tool: google-stitch
external_ref: projects/<id real de Stitch>   # o PLACEHOLDER:… en ejemplos
name: "…"
initiative: <initiative-id>
product: <product>
project_status: active | archived | superseded
creation: {authorized_by: human:<id>, at: <ISO-8601 -05:00>, reason: "…"}
```
**Desviación del prompt:** `status` está reservado por OKF (`draft`…), por eso el estado del proyecto es `project_status`. Se mantiene el resto de campos del ejemplo.

### 1.2 SCR y FLW (campos aditivos)
```yaml
# SCR (un archivo puede declarar varias pantallas en `screens:`; si no, el archivo es la pantalla)
id: SCR-021
flow: FLW-008
requirements: [US-027, AC-041, AC-042, UXR-012]
required_states: [default, loading, empty, error, disabled]
responsive: [mobile, desktop]
a11y_requirements: [WCAG-2.2-AA, keyboard-nav, focus-visible]
components: [CMP-011, CMP-014]
tokens: [TKN-color-primary]
# La preparación para generar NO se almacena: se deriva (flow + requirements + required_states + responsive + a11y_requirements + components completos)
# FLW
id: FLW-008
requirements: [US-027, UXR-012]
screens: [SCR-021, SCR-022, SCR-023]
```
**Desviación del prompt §7:** el SCR **no** lleva `design.stitch{project_ref,artifact_ref,version}`. Esa información vive solo en el DTM (fuente única); duplicarla en SCR crea dos verdades que divergen. El SCR conserva `flow` y `requirements`. La navegación SCR→diseño se hace por el DTM (`screen:` es clave).

### 1.3 DTM — Design Traceability Map (`knowledge-base/design/traceability/DTM-*.md`)
Frontmatter OKF + bloque `traceability:` (machine-readable); el cuerpo es una tabla renderizada (human-readable) con enlaces. Una entrada por SCR:
```yaml
traceability:
  - screen: SCR-021
    flow: FLW-008
    requirements: {us: [US-027], ac: [AC-041], uxr: [UXR-012]}
    exploration_design:            # Stitch
      tool: google-stitch
      project_ref: STP-CL2-TENANT-001
      artifact_ref: <ref real o PLACEHOLDER:…>
      version: <…>
      status: current | superseded | stale
      latest_known_version: <…>    # la fija quien verifica en vivo; si difiere de version ⇒ obsoleto
    governed_design:               # Figma
      tool: figma
      file_ref: <…>
      node_ref: <…>
      version: <…>
      status: candidate | approved | stale
      approved_by: human:<id>
      decision_ref: DD-…
      states_covered: [default, loading, …]
      responsive_covered: [mobile, desktop]
      latest_known_version: <…>
    stitch_figma: {divergence: none | resolved | open, decision_ref: DD-…}
    components: [CMP-011]
    tokens: [TKN-…]
```
Las referencias son **IDs/refs reales o `PLACEHOLDER:`**; el validador diferencia ambos.

### 1.4 HOF — UX Development Handoff (`knowledge-base/design/handoff/HOF-*.md`)
Frontmatter: `id`, `initiative`, `dtm_ref`, `screens`, `open_questions[{id,text,blocking,status}]`, `assumptions`, `design_decisions[DD-]`, `a11y_reports[…]`, `gate{name, result, evaluated_at, evaluator, findings, human_review{status,reviewer,at}}`.
Cuerpo: secciones **A–N** del prompt (§12). Por pantalla se **referencian** SCR/DTM/CMP/TKN; solo se escriben aquí las reglas de interacción y las decisiones que no existan ya en otro concepto.

## 2. Reglas por Skill (resumen; el detalle va en cada `SKILL.md`)

| Skill | Regla nueva |
|---|---|
| user-flow-designer | FLW lista sus SCR y requisitos |
| ui-spec-writer | SCR completo (flow, requirements, estados, responsive, a11y, CMP, TKN) antes de Stitch; sin refs de herramienta |
| claude-design-orchestrator | No explora sin FLW/SCR; su DD puede ser la decisión Stitch↔Figma |
| accessibility-reviewer | Informe legible por máquina, por SCR; precondición del gate |
| stitch-ui-generator | **Preflight → reutilizar STP → generar → registrar DTM.exploration_design**. Crea STP solo con autorización humana y si no existe uno activo |
| figma-design-validator | Registra `governed_design`; compara con Stitch; divergencia exige DD humano; sella referencias obsoletas |
| ux-development-handoff | Produce HOF (A–N), corre el gate, emite insumo del DCP, y entrega a Dev solo `governed_design` |

## 3. Quality gate `DESIGN_READY_FOR_DEV`

Resultado `PASSED | FAILED | BLOCKED`. `FAILED` = defecto del artefacto; `BLOCKED` = falta una decisión o dato que el agente no puede suplir. `FAILED` prevalece sobre `BLOCKED`.

| Código | Resultado | Cuándo |
|---|---|---|
| ORPHAN_SCREEN | FAILED | SCR del alcance sin entrada DTM |
| ORPHAN_STITCH_ARTIFACT | FAILED / BLOCKED en preflight | Entrada DTM sin SCR conocido; o petición de generación sin SCR |
| MISSING_FLOW_REFERENCE | BLOCKED | SCR sin `flow`, o FLW sin SCR |
| MISSING_REQUIREMENT_LINEAGE | BLOCKED | SCR/FLW/DTM sin US/AC/UXR |
| MULTIPLE_ACTIVE_STITCH_PROJECTS | FAILED | >1 STP `active` para la misma iniciativa |
| WRONG_STITCH_PROJECT | FAILED | `project_ref` no es el STP activo de la iniciativa |
| STALE_STITCH_REFERENCE / STALE_FIGMA_REFERENCE | FAILED | `status: stale`, o `version` ≠ `latest_known_version` (`superseded` es linaje válido, no obsoleto) |
| STITCH_FIGMA_DIVERGENCE | BLOCKED | `divergence: open`, o divergencia sin `decision_ref` |
| MISSING_GOVERNED_DESIGN | BLOCKED | Sin Figma `approved` (no se puede determinar el governed_design) |
| MISSING_SCREEN_STATE | FAILED | `required_states` ⊄ `states_covered` |
| MISSING_RESPONSIVE_RULE | FAILED | SCR sin `responsive`, o ⊄ `responsive_covered` |
| MISSING_ACCESSIBILITY_REQUIREMENT | FAILED | SCR sin `a11y_requirements`, o sin informe a11y aprobado para el SCR |
| MISSING_COMPONENT_REFERENCE / MISSING_TOKEN_REFERENCE | FAILED | SCR sin CMP/TKN, o no resuelven en el KB |
| BLOCKING_OPEN_QUESTION | BLOCKED | pregunta `blocking: true` y `status: open` |

**Códigos adicionales (justificados):** `MISSING_INITIATIVE`, `MISSING_STITCH_PROJECT` (preflight; BLOCKED), `DANGLING_REFERENCE`, `DUPLICATE_ID` (integridad; FAILED), `PLACEHOLDER_REFERENCE` y `HUMAN_REVIEW_PENDING` (perfil `production`; BLOCKED), `OKF_INVALID` (frontmatter OKF incumplido; FAILED), `MISSING_HANDOFF` (BLOCKED: Dev pide un SCR sin HOF), `MISSING_HANDOFF_SECTION` (FAILED: falta una sección A–N).

**Decisión humana:** el validador **nunca** escribe `human_review.status: approved`. `PASSED` significa "pasa las comprobaciones automáticas, pendiente de revisión humana". En perfil `production`, el contexto para Dev se bloquea hasta que un humano registre `approved`.

**Perfiles:** `example` acepta `PLACEHOLDER:`; `production` los rechaza.

## 4. Código (propietario: `ux-development-handoff/validators/`)

| Módulo | Función |
|---|---|
| `okf.py` | Carga frontmatter, indexa conceptos por ID, detecta placeholders |
| `codes.py` | Taxonomía única de códigos y clasificación FAILED/BLOCKED |
| `lineage.py` | Comprobaciones del KB (integridad, FLW↔SCR, DTM, STP, estados, etc.) |
| `design_ready_for_dev.py` | Evalúa el gate para un HOF; CLI |
| `dev_context.py` | Arma el contexto de implementación para un SCR (solo `governed_design`) |
| `stitch_preflight.py` | Preflight y `resolve_stitch_project` (REUSE / CREATE_AUTHORIZED / BLOCKED) |
| `registry.py` | Escribe `exploration_design` y `governed_design` en el DTM (`register_exploration`, `register_governed`) |
| `cli.py` | Línea de comandos: `preflight`, `gate`, `dev-context`, `register-*`; exit 0/1/2 |

`stitch-ui-generator` y `figma-design-validator` los invocan por ruta relativa (`../ux-development-handoff/validators`). Las pruebas viven en una sola suite (`ux-development-handoff/tests/`) porque los 10 escenarios cruzan Skills.

## 5. Compatibilidad
- Cambios en SCR/FLW son **aditivos** (no-breaking); SCR-015/FLW-015 siguen siendo válidos pero no pasan el gate hasta migrarse.
- **Breaking:** stitch-ui-generator 2.0.0 (precondiciones), figma-design-validator 2.0.0 (DTM), ux-development-handoff 2.0.0 (HOF + gate). `GEN-*` históricos se conservan.
- Versiones: `manifest.yaml` nuevo en los Skills modificados; `generated.by` de las plantillas actualizado.

## 6. Decisiones humanas requeridas (no se toman en silencio)
1. **Registro del proyecto Stitch real** `projects/7424057371727816981` como STP-… y su iniciativa. Este trabajo **no** modifica `knowledge-base/`; la `MIGRATION-GUIDE` incluye la plantilla.
2. ¿`SCR-015-NN` (sub-pantalla) es la unidad de mapeo al artefacto Stitch? Se asume que sí.
3. Dónde residen los tokens `TKN-*` mientras no haya design system (UXR-Q4).
4. Quién aprueba el gate (`human_review.reviewer`).

## 7. Cómo se verifica (TDD)
1. Pruebas de contrato de los 8 `SKILL.md` → se ejecutan **antes** de modificarlos (baseline en rojo).
2. Pruebas de los validadores con 10 escenarios + casos negativos → se escriben antes que el código.
3. E2E sobre un árbol KB aislado con placeholders, perfil `example` = PASSED y perfil `production` = BLOCKED.
4. **Límite:** no se ejecutan pruebas de presión con subagentes sobre el comportamiento de los Skills en vivo (no se solicitó lanzar agentes); queda registrado en `TEST-REPORT.md`.
