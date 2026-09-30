"""Read the deliberately small OKF v0.2 front matter used by this skill."""
from pathlib import Path
import re
import yaml


def _front_matter(text: str) -> dict:
    if not text.startswith("---"):
        raise ValueError("OKF document must start with YAML front matter")
    parts = text.split("---", 2)
    if len(parts) != 3:
        raise ValueError("OKF front matter is not closed")
    data = yaml.safe_load(parts[1]) or {}
    if not isinstance(data, dict):
        raise ValueError("OKF front matter must be a mapping")
    body = parts[2].strip()
    heading = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
    objective = re.search(r"^##\s+Objetivo\s*$\n(.+)$", body, re.MULTILINE)
    data["title"] = heading.group(1).strip() if heading else data.get("title", data.get("id", ""))
    data["objective"] = objective.group(1).strip() if objective else data.get("objective", "")
    data["body"] = body
    return data


def read_okf(path: Path) -> dict:
    data = _front_matter(path.read_text(encoding="utf-8"))
    if data.get("okf") != "google-okf-v0.2":
        raise ValueError("only google-okf-v0.2 is supported")
    required = (
        "artifact", "okf", "id", "title", "generated", "verified", "status",
        "provenance", "sources", "human-reviewed", "type", "gate", "product",
    )
    missing = [key for key in required if key not in data or data[key] is None]
    if missing:
        raise ValueError(f"missing OKF fields: {', '.join(missing)}")
    if data["artifact"] != "user-story" or data["type"] != "user-story":
        raise ValueError("OKF User Stories require artifact and type user-story")
    if not isinstance(data["provenance"], dict) or not isinstance(data["sources"], list):
        raise ValueError("OKF provenance must be a mapping and sources must be a list")
    return data
