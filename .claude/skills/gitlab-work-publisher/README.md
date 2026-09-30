# gitlab-work-publisher

Skill Package for publishing approved Google OKF v0.2 User Stories to GitLab Issues at `https://project.comsatel.com.pe`.

## Quick start

```powershell
python -m pip install -r requirements.txt
pytest -q
python scripts/publish_issue.py examples/US-027.okf.md --product CLocator --mode dry-run
```

The default product map deliberately has no invented IDs:

```yaml
CLocator:
  project_id: null
  enabled: false
```

Set a real numeric `project_id` and `enabled: true` only after project ownership confirms it. For live modes, provide the PAT in the process environment:

```powershell
$env:GITLAB_PAT = "..."
python scripts/publish_issue.py path/to/US-027.okf.md --product CLocator --mode sync
Remove-Item Env:GITLAB_PAT
```

`sync` first searches the target project for the concept ID, then updates the existing issue or creates exactly one. `create` also performs the search as a duplicate guard. `update` requires a previously known `issue_iid` in the caller's lineage state; the library function `publish()` accepts that state without persisting it.

Every publishable OKF must carry origin references, for example:

```yaml
knowledge_base:
  provider: gitlab
  name: kb-comsatel
  repository_url: https://project.comsatel.com.pe/knowledge/kb-comsatel
  ref: main
  context_pack:
    id: RCP-US-027
    path: context-packs/RCP-US-027.md
    url: https://project.comsatel.com.pe/knowledge/kb-comsatel/-/blob/main/context-packs/RCP-US-027.md
  source_concept:
    id: US-027
    path: concepts/US-027.okf.md
    url: https://project.comsatel.com.pe/knowledge/kb-comsatel/-/blob/main/concepts/US-027.okf.md
```

The document envelope must also include `artifact: user-story`, `okf: google-okf-v0.2`, `id`, `title`, `generated`, `verified`, `status`, `sources`, `provenance`, and `human-reviewed`. The GitLab Issue is intentionally a compact operational projection rather than another full OKF source document.

The resulting Issue renders these as clickable Markdown links under `Lineage`; the Issue is therefore traceable back to the knowledge source that originated the User Story.

## Package layout

- `SKILL.md`: runtime instructions and safety contract.
- `config/`: GitLab endpoint and product-to-project mapping.
- `scripts/`: OKF reader, validators, renderer, REST client, and CLI.
- `templates/`: minimal issue and publication shapes.
- `references/`: operational contract, security, idempotency, lineage, and API notes.
- `examples/`: valid OKF sample and request.
- `tests/`: unit and security tests.

## Verification

Run `pytest -q` from this directory. Run `python -m compileall -q scripts` for static syntax validation. No live API test is run by default because no PAT or project IDs are stored in the package.
