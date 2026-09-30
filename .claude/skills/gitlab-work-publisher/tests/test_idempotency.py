import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / "scripts"))

from publish_issue import choose_operation


def test_existing_lineage_selects_update():
    assert choose_operation("sync", {"issue_iid": 483}) == "update"


def test_missing_lineage_selects_create():
    assert choose_operation("sync", {}) == "create"


def test_dry_run_never_becomes_live_operation():
    assert choose_operation("dry-run", {"issue_iid": 483}) == "dry-run"
