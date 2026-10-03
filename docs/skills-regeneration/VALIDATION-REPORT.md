# VALIDATION-REPORT

Checklist de §28 del prompt maestro. ✓ = verificado con evidencia ejecutada; ◐ = verificado parcialmente (se explica); ✗ = no verificado.

| Control | Estado | Evidencia / alcance |
|---|---|---|
| Todos los Skill Packages tienen estructura válida | ✓ | `SKILL.md` + templates + examples en los 8; `manifest.yaml` en los 7 modificados; `test_manifest_and_template_versions_agree` |
| Frontmatter válido | ✓ | `test_frontmatter_is_valid` ×8 (name == directorio, description 30–1024) |
| No existen IDs duplicados | ◐ | Validado en el ejemplo E2E y por prueba (`DUPLICATE_ID`). En la KB real hay IDs repetidos fuera del alcance de diseño (`ACP-001` ×2; `GEN-002` ×2 archivos), no corregidos (decisión humana; ver riesgos) |
| No existen referencias huérfanas | ✓ en el ejemplo | `DANGLING_REFERENCE`/`ORPHAN_*` sin hallazgos en E2E; la KB real aún no usa el modelo |
| FLW → SCR preservado | ✓ | FLW `screens` ↔ SCR `flow` (S4, `MISSING_FLOW_REFERENCE`) |
| SCR → Stitch preservado | ✓ | DTM `exploration_design` (S5) |
| Stitch Project único garantizado | ✓ | `resolve_stitch_project` + `MULTIPLE_ACTIVE_STITCH_PROJECTS` (S1, S2). Garantía a nivel de validador y de reglas del Skill; no hay control técnico sobre la herramienta Stitch en sí |
| Lineage Stitch → Figma preservado | ✓ | `register_governed` conserva `exploration_design` (superseded) (S6) |
| Figma `governed_design` identificable | ✓ | DTM `governed_design.status: approved`; `MISSING_GOVERNED_DESIGN` en caso contrario |
| CMP/TKN relacionados | ✓ | `components`/`tokens` resueltos por el gate; en la KB real no existen `TKN-*` (ver migración) |
| UX Development Handoff consumible por Desarrollo | ✓ | `dev-context` + HOF A–N; E2E |
| DESIGN_READY_FOR_DEV funciona | ✓ | 18 negativas + S8–S10 + E2E |
| Superpowers recibe `governed_design` | ◐ | Probado vía `dev-context` (función y CLI); no con una sesión Superpowers real |
| Escenarios negativos fallan correctamente | ✓ | TEST-REPORT |
| No se inventaron referencias externas | ✓ | todo `PLACEHOLDER:`; prueba `test_example_invents_no_external_identifiers`. El único ID real citado es `projects/7424057371727816981`, que ya figuraba en `GEN-001/002` y solo aparece en documentos de `docs/skills-regeneration/`, nunca en los Skills ni en el ejemplo |
| Los Markdown gobernados cumplen OKF v0.2 | ◐ | Se validan los conceptos nuevos contra la convención observada (campos, `-05:00`, `verified`). No existe un documento de especificación OKF v0.2 en el repositorio; las plantillas con `YYYY-…` no se validan como conceptos |
| Tests pasan | ✓ | 86/86 |
| Validadores pasan | ✓ | gate E2E `PASSED` (example) / `BLOCKED` (production); CLI exit codes probados |
| Documentación y ejemplos coinciden con la implementación | ◐ | Ejemplo E2E y CLI probados; las descripciones de los `SKILL.md` y referencias se revisaron a mano, sin prueba automática de coherencia texto↔código más allá de los marcadores de contrato |

## Hallazgos que NO se corrigieron (fuera de alcance o decisión humana)
1. `knowledge-base/architecture/adrs/ADR-005-…md`: frontmatter YAML inválido (preexistente, ajeno a UX). El validador lo ignora fuera de `design/`.
2. IDs repetidos en la KB real: `ACP-001` (2 archivos), `GEN-002` (2 archivos + carpeta).
3. `AC-015`/`CMP-015` son documentos únicos con varios elementos; el modelo exige IDs resolubles (ver migración).

## Estado
Controles críticos: sin fallos. Con reservas ◐ documentadas arriba, principalmente: sin prueba de comportamiento con agentes reales, sin verificación en vivo contra Stitch/Figma, y migración del contenido real pendiente de decisión humana.
