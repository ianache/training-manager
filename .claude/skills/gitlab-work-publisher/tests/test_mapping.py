import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / "scripts"))

from validators import load_product_map, resolve_product


def test_default_product_map_is_safe_and_disabled():
    mapping = load_product_map(Path(__file__).parents[1] / "config" / "product-project-map.yaml")
    assert set(mapping) == {"CLocator", "CLocator2", "SmartSuite", "SIGO"}
    assert all(item["project_id"] is None and item["enabled"] is False for item in mapping.values())


def test_unknown_or_unconfigured_product_is_rejected():
    mapping = {"CLocator": {"project_id": None, "enabled": False}}
    try:
        resolve_product("CLocator", mapping)
    except ValueError as exc:
        assert "not enabled" in str(exc)
    else:
        raise AssertionError("unconfigured product should be rejected")
