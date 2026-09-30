import os
from pathlib import Path
import yaml
from urllib.parse import urlparse

MODES = {"dry-run", "create", "update", "sync"}


def _require_http_url(value: str, field: str) -> None:
    parsed = urlparse(value or "")
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError(f"knowledge_base.{field} must be a complete HTTP(S) URL")


def load_product_map(path: Path) -> dict:
    payload = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    products = payload.get("products")
    if not isinstance(products, dict):
        raise ValueError("product map must contain products")
    return products


def resolve_product(product: str, mapping: dict) -> dict:
    item = mapping.get(product)
    if not item:
        raise ValueError(f"unknown product: {product}")
    if not item.get("enabled") or item.get("project_id") is None:
        raise ValueError(f"product {product} is not enabled or has no project_id")
    try:
        item["project_id"] = int(item["project_id"])
    except (TypeError, ValueError) as exc:
        raise ValueError(f"invalid project_id for {product}") from exc
    return item


def validate_publish_request(concept: dict, request: dict) -> None:
    mode = request.get("mode", "dry-run")
    if mode not in MODES:
        raise ValueError(f"unsupported mode: {mode}")
    if concept.get("type") != "user-story":
        raise ValueError("only user-story concepts are publishable")
    if concept.get("gate") != "REQUIREMENTS_READY":
        raise ValueError("concept must be at REQUIREMENTS_READY")
    knowledge_base = concept.get("knowledge_base")
    if not isinstance(knowledge_base, dict):
        raise ValueError("knowledge_base must describe the source repository")
    for field in ("provider", "repository_url", "ref", "name"):
        if not knowledge_base.get(field):
            raise ValueError(f"missing knowledge_base.{field}")
    if knowledge_base["provider"] != "gitlab":
        raise ValueError("knowledge_base.provider must be gitlab")
    _require_http_url(knowledge_base["repository_url"], "repository_url")
    for entity_name in ("context_pack", "source_concept"):
        entity = knowledge_base.get(entity_name)
        if not isinstance(entity, dict):
            raise ValueError(f"missing knowledge_base.{entity_name}")
        for field in ("id", "path", "url"):
            if not entity.get(field):
                raise ValueError(f"missing knowledge_base.{entity_name}.{field}")
        _require_http_url(entity["url"], f"{entity_name}.url")
    if not request.get("product"):
        raise ValueError("product is required")
    if mode != "dry-run" and not os.getenv("GITLAB_PAT"):
        raise ValueError("GITLAB_PAT is required for live modes")
