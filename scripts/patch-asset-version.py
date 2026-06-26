#!/usr/bin/env python3
"""Append ?v=SITE_VERSION to local css/js/font URLs in all HTML pages."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "version.txt"

HREF_SRC_RE = re.compile(
    r'((?:href|src)=["\'])((?:\.\./)*(?:css|js|fonts)/[^"\']+?)(?:\?v=[^"\']*)?(["\'])',
    re.IGNORECASE,
)
FONT_FACE_URL_RE = re.compile(
    r'(url\(["\'])((?:\.\./)*fonts/[^"\']+?)(?:\?v=[^"\']*)?(["\']\))',
    re.IGNORECASE,
)


def read_version() -> str:
    if not VERSION_FILE.exists():
        raise FileNotFoundError(f"Missing {VERSION_FILE.relative_to(ROOT)}")
    version = VERSION_FILE.read_text(encoding="utf-8").strip()
    if not version:
        raise ValueError(f"{VERSION_FILE.relative_to(ROOT)} is empty")
    return version


def patch_html(html: str, version: str) -> str:
    def replace_href_src(match: re.Match[str]) -> str:
        return f"{match.group(1)}{match.group(2)}?v={version}{match.group(3)}"

    def replace_font_url(match: re.Match[str]) -> str:
        return f"{match.group(1)}{match.group(2)}?v={version}{match.group(3)}"

    html = HREF_SRC_RE.sub(replace_href_src, html)
    return FONT_FACE_URL_RE.sub(replace_font_url, html)


def patch_file(path: Path, version: str) -> bool:
    original = path.read_text(encoding="utf-8")
    updated = patch_html(original, version)
    if updated == original:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def patch_all_html(version: str | None = None) -> int:
    version = version or read_version()
    changed = 0
    for path in sorted(ROOT.rglob("*.html")):
        if patch_file(path, version):
            print(f"versioned: {path.relative_to(ROOT)}")
            changed += 1
    return changed


def main() -> int:
    version = sys.argv[1] if len(sys.argv) > 1 else read_version()
    changed = patch_all_html(version)
    print(f"done: {changed} file(s), v={version}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
