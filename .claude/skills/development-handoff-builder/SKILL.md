---
name: development-handoff-builder
description: Build a bounded, traceable development context pack for developers and coding agents.
metadata:
  package: dtc-common
  version: 0.2.0
  standard: google-okf-v0.2
---

# development-handoff-builder

Build a bounded Development Context Pack for Developers and coding agents. This Skill sits between approved architecture/design work and implementation, remaining traceable to AF and verifiable by QA.

## Inputs

Architecture Context Pack, requirements, User Stories, ASRs, ADRs, standards, constraints, existing DTC artifacts, review criteria, security/privacy requirements and QA constraints.

## Procedure

1. Load and normalize sources; preserve identity, version, timestamp and trust.
2. Define scope, actors, boundaries, assumptions and non-goals.
3. Create or inspect the design with stable IDs and explicit decisions.
4. Preserve the AF → ARQ → DTC → DEV → QA chain.
5. Check failure modes, security, observability, testability, rollout and rollback.
6. Run traceability and quality gates; link findings to evidence and IDs.
7. Write the artifact using the Google OKF v0.2 envelope and lifecycle status.
8. If `READY_FOR_DEV`, link the implementation handoff; otherwise name the owner and next action.

## Rules

- Never invent requirements, fields, policies or architecture decisions; mark assumptions or blockers.
- Every normative choice has an ID, rationale and source or inferred provenance.
- Never set `human-reviewed: true` without a named human and review event.
- Use repository-relative paths or stable IDs for internal links.
- Preserve versions and classify changes as compatible, breaking, additive or unknown.

## Quality gates

Required sections and IDs exist; critical inputs have sources and freshness/trust; forward and backward traceability has no unexplained orphan; security, failure, observability and testing concerns are covered; status is exactly `READY_FOR_DEV`, `REQUIRES_REVIEW` or `BLOCKED`; `READY_FOR_DEV` has no blocking finding and a handoff path.

## Output

Use [`templates/development-context-pack.md`](templates/development-context-pack.md). The resulting Markdown document must use `okf: google-okf-v0.2` and include `artifact`, `id`, `title`, `generated`, `verified`, `status`, `sources`, `provenance` and `human-reviewed`.
