# Idempotency

The stable key is `concept_id` (for example `US-027`). Live `create` and `sync` search the target project's issues for that key before POSTing. If a caller has lineage with `issue_iid`, `sync` performs PUT on that issue. A successful result returns the pair `project_id` and `issue_iid` so the caller can persist it in the OKF lineage store.

Concurrent callers should use an external lock or serialized worker. GitLab search is a duplicate guard, not a distributed transaction.
