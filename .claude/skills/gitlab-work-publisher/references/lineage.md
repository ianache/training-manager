# Provenance and lineage

The source concept is the immutable knowledge identity. A publication result has:

```yaml
concept_id: US-027
provider: gitlab
project_id: 123
issue_iid: 483
operation: create
```

This is an output for the caller's lineage/provenance store; the skill does not silently mutate the source OKF file. GitLab's project-scoped `iid` is retained alongside `project_id` because the global Issue ID and project Issue IID are distinct identifiers.

The Issue also includes clickable origin references:

```text
Knowledge Base → Context Pack → Source Concept
```

The knowledge-base repository is independent from the GitLab project that stores the Issue. Every origin URL must include the repository and ref, for example `https://host/group/knowledge-base/-/blob/main/concepts/US-027.okf.md`.
