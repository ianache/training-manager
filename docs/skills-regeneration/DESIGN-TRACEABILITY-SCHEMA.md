# DESIGN-TRACEABILITY-SCHEMA

Vista de conjunto. El esquema normativo campo a campo vive junto a cada Skill propietario (para que viaje con él):

| Concepto | Prefijo | Propietario | Esquema normativo |
|---|---|---|---|
| Stitch Design Project | `STP-` | stitch-ui-generator | `stitch-ui-generator/references/stitch-project-governance.md`, `templates/design-project-template.md` |
| Screen (campos aditivos) | `SCR-` | ui-spec-writer | `ui-spec-writer/references/screen-spec-schema.md` |
| User Flow (campos aditivos) | `FLW-` | user-flow-designer | `user-flow-designer/templates/concept-template.md` |
| Design Traceability Map | `DTM-` | stitch-ui-generator (exploration) · figma-design-validator (governed) | `ux-development-handoff/references/design-traceability-map.md` |
| UX Development Handoff | `HOF-` | ux-development-handoff | `ux-development-handoff/references/design-to-code-contract.md` |
| Accessibility Report | `ARP-` | accessibility-reviewer | `accessibility-reviewer/templates/concept-template.md` |
| Design Decision | `DD-` | claude-design-orchestrator | `claude-design-orchestrator/templates/concept-template.md` |

## Cadena y dónde vive cada eslabón (un hecho, un lugar)

```
US/AC ── UXR ── FLW ──(screens)──► SCR ──(flow, requirements)──►
                                     │
                                     └─ DTM entry (screen: SCR-…)
                                          ├─ exploration_design  → STP-… + artifact_ref        (Stitch)
                                          ├─ governed_design     → file_ref / node_ref / version (Figma)
                                          ├─ stitch_figma        → divergence + DD-…
                                          └─ components / tokens → CMP-… / TKN-…
HOF-… ── dtm_ref ► DTM ; screens ► SCR ; gate{result, human_review}
DCP-… (development-handoff-builder) ◄── solo si el gate pasa
```

Navegación inversa: de un `artifact_ref` a su SCR (clave `screen` del DTM), de ahí a `flow` y `requirements`; de un CMP/TKN a los SCR que lo listan (búsqueda en `components`/`tokens`). Un artefacto de diseño sin SCR se detecta (`ORPHAN_STITCH_ARTIFACT`).

## Reglas de ID y referencias
- IDs estables; nunca se renombran en silencio. `SCR-NNN` o sub-pantalla `SCR-NNN-NN`; archivos legados sin `id` en frontmatter se resuelven por el prefijo del nombre de archivo.
- Referencias externas (Stitch/Figma): valor real devuelto por la herramienta, o `PLACEHOLDER:<texto>` solo en ejemplos. El perfil `production` rechaza placeholders (`PLACEHOLDER_REFERENCE`).
- Si la herramienta no entrega versión o ID estable: se registra la referencia verificable disponible y se documenta la limitación (`version: not-exposed-by-<tool>`).

## Desviaciones deliberadas respecto del prompt (justificadas en `03-CHANGE-DESIGN.md`)
1. `project_status` (no `status`) para el estado del proyecto Stitch: `status` es el ciclo de vida OKF.
2. El SCR **no** guarda `design.stitch{…}`: esos datos están solo en el DTM para evitar dos fuentes de verdad.
3. La preparación de un SCR para generar es **derivada**, no un campo.
4. El estado `superseded` de Stitch no es "obsoleto": es lineage válido. Solo `stale` o `version ≠ latest_known_version` falla.

## Cumplimiento OKF v0.2
Los conceptos nuevos (STP, DTM, HOF, ARP, DD) y los SCR/FLW llevan `type/title/description/tags/status/generated{by,at -05:00}/sources`; `status: draft`; sin `verified` salvo flujo humano. El validador lo comprueba (`OKF_INVALID`, `DANGLING_REFERENCE` para fuentes irresolubles). No existe en el repositorio un documento de especificación OKF v0.2; se sigue la convención observada en `AGENTS.md` y los conceptos existentes.
