#!/usr/bin/env python3
"""Append ?v=SITE_VERSION to local css/js/font/image URLs in HTML and CSS."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "version.txt"

IMAGE_EXT = r"(?:jpg|jpeg|png|gif|webp|svg|ico|pdf)"
LOCAL_ASSET_PATH = (
    rf"(?:(?:\.\./)*(?:css|js|fonts|images)/|images/)[^\"']+?"
    rf"|[^/\"']+\.{IMAGE_EXT}"
)

ATTR_RE = re.compile(
    rf'((?:href|src|content)=(["\']))({LOCAL_ASSET_PATH})(?:\?v=[^"\']*)?(["\'])',
    re.IGNORECASE,
)
URL_RE = re.compile(
    rf'(url\((["\']?))((?:\.\./)*(?:fonts|images)/[^\'")]+?)(?:\?v=[^\'")]*)?(["\']?\))',
    re.IGNORECASE,
)
MASK_URL_RE = re.compile(
    rf'((?:-webkit-)?mask:\s*url\((["\']?))((?:\.\./)*images/[^\'")]+?)(?:\?v=[^\'")]*)?(["\']?\))',
    re.IGNORECASE,
)
IMPORT_LOCAL_RE = re.compile(
    r'(@import\s+(?:url\()?)(["\'])((?!https?://|//)[^"\']+?\.css)(?:\?v=[^"\']*)?(["\'])(\))?(;)',
    re.IGNORECASE,
)

def read_version() -> str:
    if not VERSION_FILE.exists():
        raise FileNotFoundError(f"Missing {VERSION_FILE.relative_to(ROOT)}")
    version = VERSION_FILE.read_text(encoding="utf-8").strip()
    if not version:
        raise ValueError(f"{VERSION_FILE.relative_to(ROOT)} is empty")
    return version


def is_remote_url(path: str) -> bool:
    lowered = path.lower()
    return lowered.startswith(("http://", "https://", "//"))


def patch_text(text: str, version: str) -> str:
    def replace_attr(match: re.Match[str]) -> str:
        path = match.group(3)
        if is_remote_url(path):
            return match.group(0)
        return f"{match.group(1)}{path}?v={version}{match.group(4)}"

    def replace_url(match: re.Match[str]) -> str:
        path = match.group(3)
        if is_remote_url(path):
            return match.group(0)
        return f"{match.group(1)}{path}?v={version}{match.group(4)}"

    def replace_import(match: re.Match[str]) -> str:
        path = match.group(3)
        return (
            f"{match.group(1)}{match.group(2)}{path}?v={version}"
            f"{match.group(4)}{match.group(5) or ''}{match.group(6)}"
        )

    text = ATTR_RE.sub(replace_attr, text)
    text = URL_RE.sub(replace_url, text)
    text = MASK_URL_RE.sub(replace_url, text)
    return IMPORT_LOCAL_RE.sub(replace_import, text)


def patch_file(path: Path, version: str) -> bool:
    original = path.read_text(encoding="utf-8")
    updated = patch_text(original, version)
    if updated == original:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def iter_patch_files() -> list[Path]:
    files: set[Path] = set()
    files.update(ROOT.rglob("*.html"))
    files.update(ROOT.glob("css/*.css"))
    files.update(ROOT.glob("css/**/*.css"))
    return sorted(files)


def patch_all(version: str | None = None) -> int:
    version = version or read_version()
    changed = 0
    for path in iter_patch_files():
        if patch_file(path, version):
            print(f"versioned: {path.relative_to(ROOT)}")
            changed += 1
    return changed


def main() -> int:
    version = sys.argv[1] if len(sys.argv) > 1 else read_version()
    changed = patch_all(version)
    print(f"done: {changed} file(s), v={version}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
