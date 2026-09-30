import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / "scripts"))

from issue_renderer import render_issue
from okf_reader import read_okf


def test_renderer_is_minimal_and_contains_lineage():
    concept = read_okf(Path(__file__).parents[1] / "examples" / "US-027.okf.md")
    rendered = render_issue(concept, "CLocator")
    assert rendered["title"] == "US-027 — Registrar tienda de concesionaria"
    assert "Source Concept: [US-027](https://project.comsatel.com.pe/knowledge/kb-comsatel/-/blob/main/concepts/US-027.okf.md)" in rendered["description"]
    assert "REQUIREMENTS_READY" in rendered["description"]
    assert "GITLAB_PAT" not in rendered["description"]
    assert "Producto::CLocator" in rendered["labels"]


def test_renderer_exposes_knowledge_base_and_context_pack_links():
    concept = read_okf(Path(__file__).parents[1] / "examples" / "US-027.okf.md")
    rendered = render_issue(concept, "CLocator")
    assert "- Knowledge Base: [kb-comsatel](https://project.comsatel.com.pe/knowledge/kb-comsatel)" in rendered["description"]
    assert "- Context Pack: [RCP-US-027](https://project.comsatel.com.pe/knowledge/kb-comsatel/-/blob/main/context-packs/RCP-US-027.md)" in rendered["description"]
    assert "- Source Concept: [US-027](https://project.comsatel.com.pe/knowledge/kb-comsatel/-/blob/main/concepts/US-027.okf.md)" in rendered["description"]
