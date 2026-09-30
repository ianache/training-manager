# Knowledge Base URL Resolution

## Overview

The gitlab-work-publisher skill now dynamically resolves knowledge base URLs using the `kb_project_id` property from `config/product-project-map.yaml`. This eliminates the need to hardcode URLs in OKF files.

## Configuration

Each product in `product-project-map.yaml` now includes:

```yaml
products:
  devqa-juniors:
    project_id: 605                                    # GitLab issue project
    enabled: true
    kb_project_id: 'comsatel/development/training/dev-juniors/knowledge-base'
```

### kb_project_id Format

```
organization/group/subgroup/knowledge-base
```

**Generated URL:** `https://gitlab.comsatel.com.pe/knowledge/{kb_project_id}`

### Example

**Input:**
```yaml
kb_project_id: 'comsatel/development/training/dev-juniors/knowledge-base'
```

**Generated Repository URL:**
```
https://gitlab.comsatel.com.pe/knowledge/comsatel/development/training/dev-juniors/knowledge-base
```

**File URL (auto-generated):**
```
https://gitlab.comsatel.com.pe/knowledge/comsatel/development/training/dev-juniors/knowledge-base/-/blob/main/knowledge-base/requirement/user-stories/US-015-025-party-management.okf.md
```

## OKF Path Structure

### Old (v0.1)
```
requirements/
  ├── context-packs/
  └── user-stories/
```

### New (v0.2 with KB resolution)
```
knowledge-base/
  └── requirement/
      ├── context-packs/
      └── user-stories/
```

The `kb_resolver.py` utility automatically:
1. Normalizes file paths (`requirements/` → `knowledge-base/requirement/`)
2. Converts backslashes to forward slashes for GitLab URLs
3. Constructs full blob URLs using `kb_project_id`

## How It Works

1. **Product Resolution:** When publishing, the skill reads the product config and extracts `kb_project_id`
2. **URL Building:** The `kb_resolver.build_url()` function constructs GitLab blob URLs
3. **Issue Rendering:** `issue_renderer.py` uses resolved URLs for GitLab issue description
4. **Path Normalization:** File paths are automatically converted to the new structure

## Publishing with URL Resolution

**Before (hardcoded URLs):**
```yaml
knowledge_base:
  repository_url: "https://gitlab.comsatel.com.pe/knowledge/kb-uxui-agentic"
  context_pack:
    url: "https://gitlab.comsatel.com.pe/knowledge/kb-uxui-agentic/-/blob/main/context-packs/RCP-003.md"
```

**After (auto-generated from kb_project_id):**
```yaml
knowledge_base:
  kb_project_id: 'comsatel/development/training/dev-juniors/knowledge-base'
  # URLs are auto-generated during rendering based on kb_project_id
```

## Backward Compatibility

- OKF files can still include hardcoded URLs
- If `kb_project_id` is provided during rendering, it takes precedence
- Path normalization happens automatically (old `requirements/` paths are converted to new `knowledge-base/requirement/`)

## Usage Example

```bash
python scripts/publish_issue.py \
  knowledge-base/requirement/user-stories/US-015-025-party-management.okf.md \
  --product devqa-juniors \
  --mode dry-run
```

The skill will:
1. Read `kb_project_id` from `devqa-juniors` config
2. Generate URLs using that project ID
3. Include those URLs in the rendered GitLab issue

## Files Modified

- `kb_resolver.py` — New utility for URL resolution and path normalization
- `publish_issue.py` — Pass `kb_project_id` to issue renderer
- `issue_renderer.py` — Use resolved URLs when rendering
- `product-project-map.yaml` — Add `kb_project_id` to all products
