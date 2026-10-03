# DESIGN_READY_FOR_DEV — Quality Gate

Implementación: `ux-development-handoff/validators/design_ready_for_dev.py` (CLI: `python validators/cli.py gate --kb <kb> --hof <HOF> [--profile example|production]`; salida JSON; exit 0 PASSED, 1 FAILED, 2 BLOCKED).

## Resultado
| Resultado | Significado |
|---|---|
| `PASSED` | Comprobaciones automáticas superadas. **No** es aprobación: queda `human_review: pending` |
| `FAILED` | Un artefacto está defectuoso (corregir upstream) |
| `BLOCKED` | Falta un dato o decisión que el agente no puede suplir |

`FAILED` prevalece sobre `BLOCKED`. En perfil `production`, además `PLACEHOLDER_REFERENCE` y `HUMAN_REVIEW_PENDING` bloquean.

## Decisión humana
`HOF.gate.human_review = {status: pending|approved|rejected, reviewer: human:<id>, at}`. El validador nunca escribe `approved`; un `approved` sin `reviewer: human:*` se lee como `pending`. Quien consume (`dev-context`) en `production` exige `approved`.

## Códigos (única taxonomía; cada uno tiene una prueba negativa)
| Código | Clase | Condición |
|---|---|---|
| ORPHAN_SCREEN | FAILED | SCR del handoff sin entrada DTM, o handoff sin pantallas |
| ORPHAN_STITCH_ARTIFACT | FAILED (BLOCKED en preflight) | entrada DTM con SCR inexistente; petición de generación sin SCR |
| MISSING_FLOW_REFERENCE | BLOCKED | SCR sin `flow`; FLW que no lista el SCR; flow del DTM ≠ flow del SCR |
| MISSING_REQUIREMENT_LINEAGE | BLOCKED | SCR o entrada DTM sin US/AC/UXR |
| MULTIPLE_ACTIVE_STITCH_PROJECTS | FAILED | >1 STP `active` en la iniciativa |
| WRONG_STITCH_PROJECT | FAILED | `project_ref` no es el STP activo de la iniciativa |
| STALE_STITCH_REFERENCE | FAILED | `status: stale` o `version ≠ latest_known_version` |
| STALE_FIGMA_REFERENCE | FAILED | ídem para Figma |
| STITCH_FIGMA_DIVERGENCE | BLOCKED | `divergence` abierta o sin declarar; `resolved` sin `decision_ref` |
| MISSING_GOVERNED_DESIGN | BLOCKED | sin Figma `approved`, sin file/node/versión o sin aprobador humano |
| MISSING_SCREEN_STATE | FAILED | `required_states` no declarados o no cubiertos en Figma |
| MISSING_RESPONSIVE_RULE | FAILED | `responsive` no declarado o no cubierto |
| MISSING_ACCESSIBILITY_REQUIREMENT | FAILED | sin `a11y_requirements` o sin informe ARP `pass` referenciado por el HOF |
| MISSING_COMPONENT_REFERENCE | FAILED | sin CMP, o no resuelve |
| MISSING_TOKEN_REFERENCE | FAILED | sin TKN, o no resuelve |
| BLOCKING_OPEN_QUESTION | BLOCKED | `blocking: true` y `status: open` |
| MISSING_INITIATIVE | BLOCKED | sin iniciativa |
| MISSING_STITCH_PROJECT | BLOCKED | sin STP activo y sin creación autorizada por humano |
| DANGLING_REFERENCE | FAILED | requisito, flujo, decisión, fuente o DTM que no resuelve |
| DUPLICATE_ID | FAILED | un ID de diseño declarado dos veces |
| OKF_INVALID | FAILED | frontmatter OKF incumplido (campos, `-05:00`, `verified` fabricado, YAML inválido en `design/`) |
| MISSING_HANDOFF / MISSING_HANDOFF_SECTION | BLOCKED / FAILED | SCR sin HOF; falta una sección A–N |
| PLACEHOLDER_REFERENCE | BLOCKED (solo `production`) | ref de Stitch/Figma es `PLACEHOLDER:` |
| HUMAN_REVIEW_PENDING | BLOCKED (solo `production`) | sin aprobación humana registrada |

"Se creó innecesariamente un proyecto Stitch" se detecta como `MULTIPLE_ACTIVE_STITCH_PROJECTS` / `WRONG_STITCH_PROJECT`; además `resolve_stitch_project` impide crearlo (ver `stitch-ui-generator`).

## Límites conocidos
- El validador es offline: la obsolescencia depende de que quien verifica en vivo registre `latest_known_version`. Sin ese dato no puede detectar un cambio posterior en Stitch/Figma.
- Detectar una divergencia visual Stitch↔Figma es juicio de diseño; el validador comprueba que esté **declarada y decidida**, no que sea real.
- "Faltan estados relevantes" se mide contra `required_states` del SCR; si el SCR omite un estado necesario, el gate no lo sabe.
