# Stitch project governance (stitch-ui-generator 2.0)

## Resolution rule (one project per initiative)
| Situation | Result |
|---|---|
| Exactly one `Design Project` with `project_status: active` for the initiative | `REUSE` it. Creation requests are ignored, even if a human authorization is supplied |
| None active, creation requested, `--authorized-by human:<id>` | `CREATE_AUTHORIZED`: create in Stitch, then write the `STP-*` concept |
| None active, no creation request or no human authorization | `BLOCKED` · `MISSING_STITCH_PROJECT` |
| More than one active | `BLOCKED` · `MULTIPLE_ACTIVE_STITCH_PROJECTS` (a human must archive the extras) |
| No initiative | `BLOCKED` · `MISSING_INITIATIVE` |

Archiving or superseding a project is a human decision (`project_status: archived|superseded`).

## STP concept (`knowledge-base/design/projects/STP-*.md`)
Template: `templates/design-project-template.md`. `external_ref` is the real Stitch resource name (e.g. `projects/<id>` as returned by Stitch). Never a guessed value; `PLACEHOLDER:` only in examples. `status` is the OKF lifecycle; the project lifecycle is `project_status`.

## What the skill writes where
| Fact | Location | Owner |
|---|---|---|
| Project exists, belongs to initiative | `STP-*` | stitch-ui-generator |
| SCR ↔ Stitch artifact (`project_ref`, `artifact_ref`, `version`) | DTM `traceability[].exploration_design` | stitch-ui-generator |
| Prompts, variants, critical review | `GEN-*` (references the DTM) | stitch-ui-generator |
| Which design is built | DTM `governed_design` | figma-design-validator |

Regenerating a screen replaces `exploration_design` and moves the previous value to `exploration_history`. The project never changes.

## Stable-ID limitation
Stitch returns resource names such as `projects/<id>` and `screens/<id>`. Record exactly what the tool returned. If a version or revision is not exposed, write `version: not-exposed-by-stitch` and note it in the `GEN-*`; staleness is then detected only by comparing against `latest_known_version` captured at verification time.

## Live verification
Before reusing `project_ref`, call the Stitch tools (`get_project`) and record the date and result in the `GEN-*`. If the tool is unavailable (not authorized), record that as an open question; do not claim verification.
