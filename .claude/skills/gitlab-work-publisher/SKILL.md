---
name: gitlab-work-publisher
description: Publish approved OKF v0.2 User Stories to GitLab as minimal operational Issue projections.
---

# GitLab Work Publisher

Use this skill after the human gate `REQUIREMENTS_READY`. It validates a Google OKF v0.2 User Story document, resolves its product to a configured GitLab project, and creates or synchronizes one Issue while keeping the OKF concept as the source of truth.

## Contract

- Input: a Markdown file with the canonical `okf: google-okf-v0.2` envelope and a request with `product` and `mode`.
- Modes: `dry-run`, `create`, `update`, `sync`.
- Products: `CLocator`, `CLocator2`, `SmartSuite`, `SIGO`.
- Authentication: only `GITLAB_PAT`, sent in the `PRIVATE-TOKEN` header.
- Live modes require an enabled product map entry with a numeric `project_id`.
- The OKF input must include a `knowledge_base` object with GitLab `repository_url`, `ref`, and complete URLs for `context_pack` and `source_concept`.
- `dry-run` never makes a network call and emits a safe preview.
- A live result emits lineage `concept_id ↔ provider + project_id + issue_iid`.
- The Issue description links back to the knowledge base, Context Pack, and source concept.

The GitLab Issue is an operational projection, not a replacement OKF document. Any Markdown artifact produced by this package uses the same Google OKF v0.2 frontmatter. The knowledge-base repository may be different from the GitLab work repository selected by the product map.

## Invocation

```text
python scripts/publish_issue.py examples/US-027.okf.md --product CLocator --mode dry-run
```

Configure `config/product-project-map.yaml` locally before live use. Never put a PAT in that file, the OKF file, logs, templates, or committed results.

## Safety

The publisher refuses non-User-Story concepts, gates other than `REQUIREMENTS_READY`, unknown products, disabled projects, and live requests without `GITLAB_PAT`. Errors redact the PAT. The Issue body is intentionally a compact projection; it does not replace OKF or copy the full Context Pack.
