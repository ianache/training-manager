# MIGRATION-GUIDE

## Versiones
| Skill | Antes | Ahora | Tipo |
|---|---|---|---|
| ux-requirements-analyzer | 1.0 | 1.0 (solo se añadió frontmatter) | sin cambio de contrato |
| user-flow-designer | 1.0 | 1.1.0 | no-breaking |
| ui-spec-writer | 1.0 | 1.1.0 | no-breaking |
| accessibility-reviewer | 1.0 | 1.1.0 | no-breaking |
| claude-design-orchestrator | 1.0 | 1.1.0 | no-breaking |
| stitch-ui-generator | 1.0 | **2.0.0** | **breaking** |
| figma-design-validator | 1.0 | **2.0.0** | **breaking** |
| ux-development-handoff | 1.0 | **2.0.0** | **breaking** |

## Qué rompe
- **stitch-ui-generator:** ya no genera sin `SCR` completo, `FLW` que lo liste, lineage y un `STP` activo. El `GEN-*` deja de ser donde vive el vínculo SCR↔Stitch (ahora el DTM).
- **figma-design-validator:** además de validar, registra `governed_design`/`stitch_figma` en el DTM; exige decisión humana ante divergencia.
- **ux-development-handoff:** el entregable es el HOF (A–N) con gate; el "Handoff Pack" 1.0 ya no basta para Desarrollo. La sección "Implementation Requirements" 1.0 se conserva en `references/`.

## Qué no rompe
- Los conceptos existentes (SCR-015, FLW-015, GEN-001/002/015, CMP-015, UXR-*) siguen siendo OKF válidos. Los campos nuevos son aditivos. Solo **no pasan** el preflight/gate hasta migrarse.

## Ruta de migración del contenido existente (decisión humana; no ejecutada por este trabajo)
1. **Registrar el proyecto Stitch real.** `GEN-001`, `GEN-002` y `components/ui-inventory.md` citan `projects/7424057371727816981`. Crear `knowledge-base/design/projects/STP-<producto>-<iniciativa>-001.md` desde `stitch-ui-generator/templates/design-project-template.md` con `external_ref: projects/7424057371727816981`, `initiative` y `product` definidos por un humano, `creation.authorized_by: human:<id>`. Verificar antes que el proyecto existe (herramienta Stitch `get_project`). Si hubiera más de un proyecto Stitch para la iniciativa, un humano decide cuál queda `active` y archiva el resto.
2. **FLW-015/016:** añadir `id`, `requirements` y `screens` (IDs de sus pantallas).
3. **SCR-015:** la unidad de pantalla es `SCR-015-NN` (cuerpo del documento). Mover cada pantalla a `screens:` en el frontmatter con `flow`, `requirements`, `required_states`, `responsive`, `a11y_requirements`, `components`, `tokens`. Sin inventar: lo que no esté en las fuentes es pregunta abierta.
4. **CMP/TKN:** CMP-015 es un solo documento con 11 componentes; para que `components:` resuelva, referenciar `CMP-015` o dividirlo en CMP por componente (decisión humana). No existen `TKN-*`: decidir dónde residen mientras no haya design system (UXR-Q4).
5. **DTM:** crear con `register-exploration` los vínculos SCR↔artefacto de GEN-001/002 (IDs `screens/…` reales ya citados en GEN-001). GEN-015 no tiene IDs de artefactos Stitch: no se inventan; se registran cuando exista la generación real.
6. **Figma:** cuando haya diseño aprobado, `register-governed` por SCR.
7. **index.md y changelog.md** de `knowledge-base/` en el mismo MR (convención de `AGENTS.md`); `graphify update .` antes del commit.

## Consumidores downstream
`development-handoff-builder` (0.2.0) no cambia; recibe el HOF/`dev-context` como entrada. Si se quiere que su plantilla DCP incluya `governed_design`, es un cambio aparte.

## Compatibilidad hacia atrás de herramientas
Las plantillas `concept-template.md` cambian `generated.by` a la nueva versión mayor.menor (`stitch-ui-generator/2.0`). Los conceptos generados con `/1.0` conservan su procedencia.

## Estructura de los paquetes
Se añadieron `manifest.yaml`, `references/` y (solo en `ux-development-handoff`) `validators/` y `tests/`. `AGENTS.md` se actualizó para reflejarlo.
