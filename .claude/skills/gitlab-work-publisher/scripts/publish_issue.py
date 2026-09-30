import argparse
import json
import os
from pathlib import Path

from issue_renderer import render_issue
from gitlab_client import GitLabClient
from okf_reader import read_okf
from validators import load_product_map, resolve_product, validate_publish_request


def choose_operation(mode: str, lineage: dict) -> str:
    if mode == "dry-run":
        return "dry-run"
    if mode == "update":
        return "update"
    return "update" if lineage.get("issue_iid") else "create"


def sanitize_error(message: str, secret: str | None = None) -> str:
    safe = message
    if secret:
        safe = safe.replace(secret, "[REDACTED]")
    return safe.replace("PRIVATE-TOKEN", "[REDACTED-HEADER]")


def publish(concept_path: Path, request: dict, package_root: Path, lineage: dict | None = None):
    concept = read_okf(concept_path)
    validate_publish_request(concept, request)
    mapping = load_product_map(package_root / "config" / "product-project-map.yaml")
    product = request.get("product") or concept.get("product")
    target = mapping.get(product)
    if not target:
        raise ValueError(f"unknown product: {product}")
    if request.get("mode") != "dry-run":
        target = resolve_product(product, mapping)
    kb_project_id = target.get("kb_project_id")
    issue = render_issue(concept, product, kb_project_id)
    operation = choose_operation(request.get("mode", "dry-run"), lineage or {})
    result = {"concept_id": concept["id"], "product": product, "mode": request.get("mode", "dry-run"), "operation": operation, "issue": issue}
    if operation == "dry-run":
        return result
    client = GitLabClient("https://project.comsatel.com.pe", os.environ["GITLAB_PAT"])
    try:
        if operation == "update":
            remote = client.update_issue(target["project_id"], int((lineage or {})["issue_iid"]), {"title": issue["title"], "description": issue["description"], "labels": issue["labels"]})
        else:
            existing = client.list_issues(target["project_id"], concept["id"])
            remote = existing[0] if existing else client.create_issue(target["project_id"], issue)
            operation = "update" if existing else "create"
        result["lineage"] = {"provider": "gitlab", "project_id": target["project_id"], "issue_iid": remote.get("iid"), "concept_id": concept["id"]}
        result["operation"] = operation
        return result
    except Exception as exc:
        raise RuntimeError(sanitize_error(str(exc), os.environ.get("GITLAB_PAT"))) from exc


def main() -> int:
    parser = argparse.ArgumentParser(description="Publish an OKF v0.2 User Story as a GitLab Issue")
    parser.add_argument("okf_path", type=Path)
    parser.add_argument("--product", required=True)
    parser.add_argument("--mode", choices=("dry-run", "create", "update", "sync"), default="dry-run")
    args = parser.parse_args()
    try:
        result = publish(args.okf_path, {"product": args.product, "mode": args.mode}, Path(__file__).parents[1])
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except (ValueError, RuntimeError) as exc:
        print(json.dumps({"error": sanitize_error(str(exc), os.environ.get("GITLAB_PAT"))}))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
