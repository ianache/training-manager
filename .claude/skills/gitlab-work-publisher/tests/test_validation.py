import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parents[1] / "scripts"))

from okf_reader import read_okf
from validators import validate_publish_request


def test_okf_and_request_require_requirements_ready():
    concept = read_okf(Path(__file__).parents[1] / "examples" / "US-027.okf.md")
    assert concept["id"] == "US-027"
    assert concept["type"] == "user-story"
    assert concept["gate"] == "REQUIREMENTS_READY"
    assert concept["okf"] == "google-okf-v0.2"
    assert concept["artifact"] == "user-story"
    assert concept["provenance"]["created_by"] == "af-user-story-generator"
    validate_publish_request(concept, {"product": "CLocator", "mode": "dry-run"})


def test_legacy_okf_version_field_is_rejected():
    path = Path(__file__).parents[1] / "tests" / "legacy.okf.md"
    path.write_text("---\nokf_version: '0.2'\nid: US-1\n---\n# legacy\n", encoding="utf-8")
    try:
        with pytest.raises(ValueError, match="google-okf-v0.2"):
            read_okf(path)
    finally:
        path.unlink()


def test_non_ready_concept_is_rejected():
    concept = {"id": "US-1", "type": "user-story", "gate": "DRAFT", "title": "x"}
    with pytest.raises(ValueError, match="REQUIREMENTS_READY"):
        validate_publish_request(concept, {"product": "CLocator", "mode": "dry-run"})


def test_pat_is_required_only_for_live_modes(monkeypatch):
    concept = {
        "id": "US-1", "type": "user-story", "gate": "REQUIREMENTS_READY", "title": "x",
        "knowledge_base": {
            "provider": "gitlab", "name": "kb-comsatel",
            "repository_url": "https://project.comsatel.com.pe/knowledge/kb-comsatel", "ref": "main",
            "context_pack": {"id": "RCP-US-1", "path": "context-packs/RCP-US-1.md", "url": "https://project.comsatel.com.pe/knowledge/kb-comsatel/-/blob/main/context-packs/RCP-US-1.md"},
            "source_concept": {"id": "US-1", "path": "concepts/US-1.okf.md", "url": "https://project.comsatel.com.pe/knowledge/kb-comsatel/-/blob/main/concepts/US-1.okf.md"},
        },
    }
    validate_publish_request(concept, {"product": "CLocator", "mode": "dry-run"})
    monkeypatch.delenv("GITLAB_PAT", raising=False)
    with pytest.raises(ValueError, match="GITLAB_PAT"):
        validate_publish_request(concept, {"product": "CLocator", "mode": "create"})


def test_publication_requires_knowledge_lineage():
    concept = {"id": "US-1", "type": "user-story", "gate": "REQUIREMENTS_READY", "title": "x"}
    with pytest.raises(ValueError, match="knowledge_base"):
        validate_publish_request(concept, {"product": "CLocator", "mode": "dry-run"})


def test_knowledge_base_requires_complete_repository_references():
    concept = {
        "id": "US-1", "type": "user-story", "gate": "REQUIREMENTS_READY", "title": "x",
        "knowledge_base": {"provider": "gitlab", "name": "kb-comsatel", "repository_url": "kb://kb-comsatel", "ref": "main",
            "context_pack": {"id": "RCP-US-1", "path": "context-packs/RCP-US-1.md", "url": "kb://kb-comsatel/context-packs/RCP-US-1"},
            "source_concept": {"id": "US-1", "path": "concepts/US-1.okf.md", "url": "kb://kb-comsatel/concepts/US-1"}},
    }
    with pytest.raises(ValueError, match="repository_url"):
        validate_publish_request(concept, {"product": "CLocator", "mode": "dry-run"})
