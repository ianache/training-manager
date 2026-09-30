---
artifact: gitlab-publication-result
okf: google-okf-v0.2
id: PUB-{{ concept_id }}
title: GitLab publication result for {{ concept_id }}
generated: {{ generated }}
verified: false
status: REQUIRES_REVIEW
sources:
  - {{ knowledge_base.source_concept.url }}
provenance:
  created_by: gitlab-work-publisher
  method: gitlab-rest-api
human-reviewed: false
---

## Publication

- concept_id: {{ concept_id }}
- provider: gitlab
- project_id: {{ project_id }}
- issue_iid: {{ issue_iid }}
- operation: {{ operation }}
