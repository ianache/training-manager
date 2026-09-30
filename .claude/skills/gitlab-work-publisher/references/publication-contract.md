# Publication contract

The publisher accepts only Google OKF v0.2 documents (`okf: google-okf-v0.2`, `artifact: user-story`, `type: user-story`) whose `gate` is exactly `REQUIREMENTS_READY`. The envelope must contain `id`, `title`, `generated`, `verified`, `status`, `sources`, `provenance`, and `human-reviewed`. It sends a minimal title, description, and comma-separated label set to GitLab. The operational Issue is a projection, not a second knowledge source.

The description must preserve `Source Concept`, OKF version, product, current gate, objective, and lineage status. It must not contain credentials or the complete Context Pack.

The source OKF must provide a `knowledge_base` object containing the GitLab repository URL and ref, plus `context_pack` and `source_concept` objects containing stable IDs, repository-relative paths, and complete HTTP(S) URLs. The publisher renders the repository, ref, Context Pack, and source concept as explicit references. The work repository remains independently resolved by the product-to-project map.
