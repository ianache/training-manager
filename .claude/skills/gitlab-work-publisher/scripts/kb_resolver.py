"""Resolve knowledge base URLs from kb_project_id in product-project-map."""
from pathlib import Path
from typing import Optional


def resolve_kb_urls(kb_project_id: str, base_url: str = "https://gitlab.comsatel.com.pe") -> dict:
    """Build knowledge base URLs from kb_project_id.

    Args:
        kb_project_id: Path like 'comsatel/development/training/dev-juniors/knowledge-base'
        base_url: GitLab base URL

    Returns:
        Dict with repository_url and a builder for path-specific URLs
    """
    repository_url = f"{base_url}/knowledge/{kb_project_id}"

    def build_url(path: str, ref: str = "main") -> str:
        """Build a GitLab blob URL for a knowledge base file."""
        # Normalize path separators to forward slashes
        normalized_path = path.replace("\\", "/").lstrip("/")
        return f"{repository_url}/-/blob/{ref}/{normalized_path}"

    return {
        "repository_url": repository_url,
        "build_url": build_url,
        "kb_project_id": kb_project_id,
    }


def normalize_path(path: str) -> str:
    """Normalize file path for knowledge base (backward compat: requirements -> knowledge-base/requirement)."""
    # Replace old requirements path with new knowledge-base/requirement path
    path = path.replace("requirements\\", "knowledge-base\\requirement\\")
    path = path.replace("requirements/", "knowledge-base/requirement/")
    return path


def build_kb_references(
    concept_id: str,
    kb_project_id: str,
    context_pack_id: str,
    context_pack_path: str,
    source_concept_path: str,
    base_url: str = "https://gitlab.comsatel.com.pe",
    ref: str = "main"
) -> dict:
    """Build complete knowledge base reference section for OKF.

    Args:
        concept_id: User story ID (e.g., "US-015-025")
        kb_project_id: Knowledge base project path
        context_pack_id: Context pack identifier
        context_pack_path: Path to context pack file (will be normalized)
        source_concept_path: Path to source OKF file (will be normalized)
        base_url: GitLab base URL
        ref: Git ref (default: main)

    Returns:
        Dict with knowledge_base section for OKF frontmatter
    """
    kb = resolve_kb_urls(kb_project_id, base_url)

    context_pack_path = normalize_path(context_pack_path)
    source_concept_path = normalize_path(source_concept_path)

    return {
        "knowledge_base": {
            "provider": "gitlab",
            "repository_url": kb["repository_url"],
            "ref": ref,
            "name": kb_project_id.split("/")[-1],  # Use last component as KB name
            "kb_project_id": kb_project_id,
            "context_pack": {
                "id": context_pack_id,
                "path": context_pack_path,
                "url": kb["build_url"](context_pack_path, ref),
            },
            "source_concept": {
                "id": concept_id,
                "path": source_concept_path,
                "url": kb["build_url"](source_concept_path, ref),
            },
        }
    }
