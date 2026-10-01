from pathlib import Path
import re

import yaml


REQUIRED_ENVELOPE = (
    "artifact", "okf", "id", "title", "generated", "verified", "status",
    "sources", "provenance", "human-reviewed",
)


def read_okf(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        raise ValueError(f"{path}: missing YAML frontmatter")
    parts = text.split("---", 2)
    if len(parts) != 3:
        raise ValueError(f"{path}: unclosed YAML frontmatter")
    data = yaml.safe_load(parts[1]) or {}
    if not isinstance(data, dict):
        raise ValueError(f"{path}: frontmatter must be a mapping")
    if data.get("okf") != "google-okf-v0.2":
        raise ValueError(f"{path}: only google-okf-v0.2 is supported")
    missing = [key for key in REQUIRED_ENVELOPE if key not in data or data[key] is None]
    if missing:
        raise ValueError(f"{path}: missing OKF fields: {', '.join(missing)}")
    body = parts[2].strip()
    heading = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
    objective = re.search(r"^##\s+(?:Objective|Objetivo)\s*$\n(.+)$", body, re.MULTILINE)
    data["heading"] = heading.group(1).strip() if heading else data["title"]
    data["objective"] = objective.group(1).strip() if objective else ""
    data["body"] = body
    data["source_path"] = str(path)
    return data
