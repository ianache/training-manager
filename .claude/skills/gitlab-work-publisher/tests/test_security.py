import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / "scripts"))

from publish_issue import sanitize_error


def test_error_sanitization_removes_pat_and_token_headers():
    secret = "synthetic-test-secret"
    safe = sanitize_error(f"request failed PRIVATE-TOKEN: {secret}", secret)
    assert secret not in safe
    assert "[REDACTED]" in safe
