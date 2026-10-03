# 02 — IMPACT MATRIX

Base: lectura de los 8 `SKILL.md`, plantillas y ejemplos reales (ver `01-INVENTORY.md`). Las hipótesis del prompt se confirmaron o ajustaron como se indica.

| Skill | Responsabilidad actual | Impacto | Cambio requerido | Cambio de contrato | Artefactos afectados | Pruebas requeridas | Riesgo de compatibilidad |
|---|---|---|---|---|---|---|---|
| ux-requirements-analyzer | UXR + preguntas abiertas desde US/BR | **NO_CHANGE** | Ninguno. Ya exige "preservar lineage US/UXR/FLW/SCR"; la UXR no necesita conocer Stitch/Figma. La consistencia UXR→FLW se verifica en el validador (`MISSING_REQUIREMENT_LINEAGE`), no en este Skill | — | — | Cubierto por S10 (cadena) | Ninguno. Queda en 1.0; solo se le añadió frontmatter (`name`, `description`), que no existía |
| user-flow-designer | FLW con happy path, excepciones, permisos, estados | **MINOR_CHANGE** (1.1.0) | Cada FLW declara `screens: [SCR-…]` (o `screens: []` + pregunta abierta) y `requirements`; no define pantallas visuales | FLW gana campos opcionales `id`, `requirements`, `screens` (aditivo) | FLW-* | S4, validador FLW↔SCR (`MISSING_FLOW_REFERENCE`) | Bajo: FLW-015/016 siguen válidos; falta `screens` solo avisa |
| ui-spec-writer | SCR + CMP + TKN + AC independiente de herramienta | **MINOR_CHANGE** (1.1.0) — *hipótesis "garantizar SCR antes de Stitch" confirmada* | SCR en frontmatter: `id`, `flow`, `requirements`, `required_states`, `responsive`, `a11y_requirements`, `components`, `tokens`, `design_map` (puntero). **No** guarda refs de Stitch/Figma. Estado SCR `ready_for_generation` solo si está completa | Campos aditivos en SCR; "Implementation Requirements" actual se conserva movido a `references/` | SCR-* | S3, S4, S9 | Medio: SCR-015 existente no tiene los campos → migración (`MIGRATION-GUIDE`) |
| accessibility-reviewer | Informe WCAG 2.2 AA, sin autocorregir | **MINOR_CHANGE** (1.1.0) — *hipótesis "precondición del gate" confirmada* | El informe se identifica por SCR y declara `a11y_review: {screen, target, result, requirements_checked}` legible por máquina; no emite `verified`; el gate lo consume | Campo aditivo en Accessibility Report | Accessibility Report | S9 (a11y), S10 | Bajo |
| claude-design-orchestrator | Exploración/crítica en Claude Design, DD | **MINOR_CHANGE** (1.1.0) | Intent Brief y DD cuelgan de `FLW-*`/`SCR-*`; sin SCR/FLW → no explora. No registra proyecto Stitch. Un DD que elige entre Stitch y Figma es la **decisión registrada** que resuelve `STITCH_FIGMA_DIVERGENCE` | DD gana `screens`, `flow`, `decides` | Intent Brief, DD-* | S6, S8 | Bajo |
| stitch-ui-generator | Prompts y variantes en Stitch + spec de componentes | **MAJOR_CHANGE** (2.0.0) | Preflight obligatorio (iniciativa, STP, FLW, SCR, lineage); reutilizar proyecto; crear solo con autorización humana explícita; registrar `SCR↔artifact` en DTM; marcar el diseño como `exploration_design`; nunca crear proyecto por pantalla | Nuevo input obligatorio (SCR `ready_for_generation`, STP). Nuevos outputs: Design Project (STP), entrada DTM. `GEN-*` pasa a ser registro de prompt/variantes y referencia al DTM | STP-*, DTM-*, GEN-* | S1, S2, S3, S4, S5 | **Alto (breaking):** sin SCR/FLW/STP ya no genera. GEN-015 sin artifact IDs permanece válido como histórico |
| figma-design-validator | Variables, componentes, estados, naming vs OKF | **MAJOR_CHANGE** (2.0.0) | Registrar `governed_design` (Figma file/node/versión) por SCR; comparar contra `exploration_design`; declarar divergencia y exigir DD humano; actualizar DTM; sellar referencias obsoletas | Input: DTM + SCR. Output: Design Validation Report + actualización DTM (`governed_design`, `stitch_figma`) | DTM-*, Validation Report | S6, S8 | Medio: antes validaba solo Figma contra OKF |
| ux-development-handoff | Handoff Pack + trazabilidad + ASR candidates | **MAJOR_CHANGE** (2.0.0) | Producir **contrato Design-to-Code** (secciones A–N), exigir `DESIGN_READY_FOR_DEV`, emitir HOF y, si el gate pasa, el insumo del Development Context Pack. Nunca selecciona Stitch si existe Figma gobernado | Output nuevo `UX Development Handoff` (HOF-*) + gate record. "Implementation Requirements" actual (Component Inventory, checklist) se conserva como sección de referencia | HOF-*, DTM-*, DCP (consumidor `development-handoff-builder`) | S7, S8, S9, S10, E2E | **Alto (breaking):** el Handoff Pack previo sin gate ya no es suficiente para Dev |

## Resumen
- NO_CHANGE: 1 (ux-requirements-analyzer).
- MINOR_CHANGE: 4 (user-flow-designer, ui-spec-writer, accessibility-reviewer, claude-design-orchestrator).
- MAJOR_CHANGE: 3 (stitch-ui-generator, figma-design-validator, ux-development-handoff).

## Ajustes a las hipótesis del prompt
1. `ui-spec-writer` se clasifica **MINOR**, no mayor: el cambio es aditivo (campos en SCR). El riesgo está en migrar SCR-015, no en el contrato.
2. `figma-design-validator` se eleva a **MAJOR**: pasa de validar un diseño a ser quien declara cuál es el `governed_design`.
3. `claude-design-orchestrator` solo necesita lineage; lo relevante es su DD como evidencia de la decisión Stitch/Figma.

## Matriz de pruebas por escenario
| Escenario | Skills / validador que lo cubren |
|---|---|
| S1 mismo proyecto para SCR-021..023 | stitch-ui-generator (resolve_stitch_project) |
| S2 intento de crear segundo proyecto | stitch-ui-generator |
| S3 sin SCR → BLOCKED | stitch-ui-generator (preflight) |
| S4 SCR sin FLW → BLOCKED | stitch-ui-generator, user-flow-designer |
| S5 lineage SCR↔artifact | stitch-ui-generator, DTM |
| S6 Figma pasa a governed | figma-design-validator |
| S7 Superpowers recibe Figma | ux-development-handoff (dev_context) |
| S8 divergencia sin resolver | figma-design-validator, gate |
| S9 falta estado error/loading | ui-spec-writer, gate |
| S10 cadena completa | gate + E2E |
