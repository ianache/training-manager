# CHANGELOG — Skills UX/UI (2026-10-01)

## stitch-ui-generator 2.0.0 (breaking)
- Nuevo: preflight obligatorio; un único Stitch Design Project (STP) por iniciativa; creación solo con autorización `human:`; registro SCR↔artefacto en el DTM; `exploration_design`.
- Nuevo: `references/stitch-project-governance.md`, `templates/design-project-template.md`, `manifest.yaml`.
- Cambiado: `SKILL.md` reescrito y acortado; "Implementation Requirements" movido a `references/implementation-requirements.md` (texto conservado).
- Corregido: `SKILL.md` del working tree estaba truncado (Purpose cortado, Course borrado).

## figma-design-validator 2.0.0 (breaking)
- Nuevo: registra `governed_design` y `stitch_figma` en el DTM; divergencia exige DD humano; `references/governed-design.md`; `manifest.yaml`.

## ux-development-handoff 2.0.0 (breaking)
- Nuevo: HOF con secciones A–N (contrato Design-to-Code), gate `DESIGN_READY_FOR_DEV`, `dev-context` para Superpowers, DTM, `references/` (3), `templates/design-traceability-map-template.md`.
- Nuevo: `validators/` (codes, okf, lineage, design_ready_for_dev, stitch_preflight, registry, dev_context, cli) y `tests/` (86 pruebas).
- Nuevo: ejemplo E2E `examples/e2e-clocator2/`.
- Cambiado: "Implementation Requirements" movido a `references/`.

## ui-spec-writer 1.1.0 · user-flow-designer 1.1.0 · accessibility-reviewer 1.1.0 · claude-design-orchestrator 1.1.0 (no-breaking)
- SCR/FLW/ARP/DD ganan campos aditivos (`flow`, `requirements`, `required_states`, `responsive`, `a11y_requirements`, `components`, `tokens`, `screens`, `a11y_review`, `decides`).
- Frontmatter válido (`name`, `description`) y estructura de `SKILL.md` unificada; `manifest.yaml`.

## ux-requirements-analyzer 1.0 (sin cambio de contrato)
- Solo se añadió frontmatter (`name`, `description`); el cuerpo no cambió.

## Repositorio
- `AGENTS.md`: estructura de Skills y cadena de trazabilidad actualizadas.
- `docs/skills-regeneration/`: 01–03 (previos al cambio), esquema, gate, migración, validación, pruebas.
- No se modificó `knowledge-base/`.
