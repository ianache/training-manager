# TEST-REPORT

Entorno: Windows 11, Python 3.11.9, pytest 7.4.3, PyYAML 6.0.2. Suite: `.claude/skills/ux-development-handoff/tests/` (`python -m pytest tests -q`).

## Metodología (TDD)
1. **RED (antes de tocar los Skills ni escribir el código):**
   - `test_skill_contracts.py` contra los `SKILL.md` 1.0: **29 fallidas, 2 aprobadas** (31). Lista: `evidence/baseline-red-contracts.txt`. Los fallos muestran el comportamiento incorrecto de 1.0: sin frontmatter en 7/8, sin manifest, sin reglas de proyecto único / SCR obligatorio / gate, `SKILL.md` de Stitch de ~150 líneas.
   - `test_scenarios.py`: no se pudo ni importar (`ModuleNotFoundError: validators`): el comportamiento no existía. `evidence/baseline-red-summary.txt`.
2. **GREEN:** se implementaron `validators/` y se reescribieron los Skills. Resultado: **86 aprobadas, 0 fallidas** (`evidence/green-pytest-verbose.txt`).
3. **Contra el repositorio real:** `preflight` sobre la `knowledge-base/` actual devuelve `BLOCKED` (`MISSING_STITCH_PROJECT`, y `SCR-015-01` no existe como entrada de pantalla), que es el comportamiento esperado antes de migrar.

## Resultados por archivo
| Archivo | Pruebas | Resultado |
|---|---|---|
| test_scenarios.py | 48 | 48 ✓ |
| test_skill_contracts.py | 31 | 31 ✓ |
| test_e2e.py | 7 | 7 ✓ |

## Escenarios obligatorios
| Escenario | Prueba(s) | Resultado esperado | Estado |
|---|---|---|---|
| S1 SCR-021/022/023 en un mismo proyecto | `test_s1_all_screens_of_flow_use_the_same_stitch_project` | mismo STP, `REUSE` | ✓ |
| S2 segundo proyecto para SCR-022 | `test_s2_never_creates_second_project_when_active_exists`, `…two_active_projects_block`, `…create_requires_human_authorization…` | reutiliza o bloquea; nunca crea; creación solo con `human:` y sin STP activo | ✓ |
| S3 sin SCR | `test_s3_no_screen_blocks`, `…unknown_screen_blocks` | BLOCKED | ✓ |
| S4 SCR sin FLW | `test_s4_screen_without_flow_blocks`, `…flow_that_does_not_list_screen_blocks` | BLOCKED | ✓ |
| S5 lineage SCR↔artefacto | `test_s5_*` (4) | registrado; regeneración conserva historial y proyecto; proyecto erróneo/huérfano rechazado | ✓ |
| S6 Figma pasa a gobernado | `test_s6_*` (2) | `governed_design` approved; Stitch `superseded` conservado; aprobación solo humana | ✓ |
| S7 Superpowers pide contexto | `test_s7_*` (4), `test_superpowers_gets_figma_not_stitch_for_every_screen` | recibe Figma; Stitch no autoritativo; BLOCKED sin gobernado/HOF o sin aprobación humana en `production` | ✓ |
| S8 divergencia sin resolver | `test_s8_*` (2) | BLOCKED | ✓ |
| S9 falta estado error | `test_s9_missing_error_state_fails` | FAILED | ✓ |
| S10 lineage completo | `test_s10_complete_lineage_passes_pending_human_review`, E2E | PASSED + `human_review: pending` + cadena completa | ✓ |

## Pruebas negativas por código
18 mutaciones (`test_negative_each_code_is_detected[...]`): cada una dispara **exactamente** su código y la clase esperada (verificado con una sonda que imprime los códigos). Códigos del prompt cubiertos: los 16. Extras cubiertos: `DANGLING_REFERENCE`, `DUPLICATE_ID`, `OKF_INVALID`, `MISSING_HANDOFF_SECTION`, `MISSING_HANDOFF`, `MISSING_INITIATIVE`, `MISSING_STITCH_PROJECT`, `PLACEHOLDER_REFERENCE`, `HUMAN_REVIEW_PENDING`.

## Otras propiedades verificadas
- El gate nunca produce `approved`; un `approved` sin reviewer humano se lee como `pending`.
- Un YAML inválido solo cuenta dentro de `design/` (en la KB real, `ADR-005` tiene frontmatter inválido y no debe bloquear diseño).
- Un archivo SCR con varias pantallas en `screens:` se carga.
- El ejemplo E2E no contiene identificadores externos reales (todo es `PLACEHOLDER:`; sin `projects/<dígitos>`).

## Límites (no verificado)
- **Comportamiento en vivo del agente:** no se ejecutaron pruebas de presión con subagentes sobre los `SKILL.md` (no se pidió lanzar agentes). Los contratos se verifican por contenido y los validadores por comportamiento; que un agente real obedezca las reglas queda sin medir.
- **Stitch y Figma en vivo:** no se llamó a las herramientas (Figma MCP requiere autorización; la verificación en vivo de `project_ref` no se hizo). El flujo `get_project` está especificado, no ejercitado.
- **Superpowers real:** `dev-context` se prueba como función/CLI; no se corrió una sesión Superpowers sobre un SCR.
- La suite tarda 30–60 s (escritura de archivos temporales).
