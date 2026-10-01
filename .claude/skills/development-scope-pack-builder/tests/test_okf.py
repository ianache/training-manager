import sys
import uuid
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parents[1] / "scripts"))

from okf_reader import read_okf


def _write(path: Path, frontmatter: str) -> Path:
    path.write_text(f"---\n{frontmatter}\n---\n# Example\n", encoding="utf-8")
    return path


def test_reads_google_okf_rcp_and_preserves_nested_provenance():
    tmp_dir = Path(__file__).parent / f"_tmp_{uuid.uuid4().hex}"
    tmp_dir.mkdir()
    path = _write(tmp_dir / "RCP-001.md", """artifact: requirement-context-pack
okf: google-okf-v0.2
id: RCP-001
title: Candidate context
generated: 2026-09-30
verified: false
status: REQUIRES_REVIEW
sources:
  - https://gitlab.example.com/kb/-/blob/main/rcp/RCP-001.md
provenance:
  created_by: af-requirement-context-builder
human-reviewed: false
""")
    try:
        result = read_okf(path)
        assert result["artifact"] == "requirement-context-pack"
        assert result["provenance"]["created_by"] == "af-requirement-context-builder"
    finally:
        path.unlink()
        tmp_dir.rmdir()


def test_rejects_non_google_okf_envelope():
    tmp_dir = Path(__file__).parent / f"_tmp_{uuid.uuid4().hex}"
    tmp_dir.mkdir()
    path = _write(tmp_dir / "bad.md", "artifact: requirement-context-pack\nokf: legacy-0.2\nid: RCP-001")
    try:
        with pytest.raises(ValueError, match="google-okf-v0.2"):
            read_okf(path)
    finally:
        path.unlink()
        tmp_dir.rmdir()
