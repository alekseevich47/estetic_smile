#!/usr/bin/env python3
"""Add conditional glass header assets and class to all pages with site header."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE_VERSION = "2026062603"
SKIP_PARTS = {"doctors", "assistants", "user-agreement", "privacy-policy", "personal-data-consent"}

GLASS_SCRIPT_MARKER = 'id="glass-detect"'
GLASS_CSS_MARKER = "header-glass-home.css"


def asset_prefix(path: Path) -> str:
    depth = len(path.parent.relative_to(ROOT).parts)
    return "../" * depth


def patch_css_file() -> None:
    css_path = ROOT / "css" / "header-glass-home.css"
    content = css_path.read_text(encoding="utf-8")

    if "html.glass-header-enabled" in content:
        return

    content = content.replace(
        "/* Liquid glass header — только главная. Откат: убрать класс + этот файл. */",
        "/* Liquid glass header — все страницы; активен при html.glass-header-enabled (glass-detect.js). */",
    )

    patched_lines: list[str] = []

    for line in content.splitlines():
        stripped = line.lstrip()
        if (
            (
                ".site-header--glass" in line
                or "body:has(.site-header--glass)" in line
                or "body.menu-open .site-header--glass" in line
            )
            and "html.glass-header-enabled" not in line
            and stripped.endswith("{")
        ):
            indent = line[: len(line) - len(stripped)]
            patched_lines.append(f"{indent}html.glass-header-enabled {stripped}")
        else:
            patched_lines.append(line)

    css_path.write_text("\n".join(patched_lines) + "\n", encoding="utf-8")


def patch_html(html: str, prefix: str) -> str:
    script_tag = (
        f'  <script src="{prefix}js/glass-detect.js?v={CACHE_VERSION}"></script>'
    )
    css_tag = (
        f'  <link rel="stylesheet" href="{prefix}css/header-glass-home.css?v={CACHE_VERSION}">'
    )

    if GLASS_SCRIPT_MARKER not in html:
        html = html.replace(
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' + script_tag,
            1,
        )

    if GLASS_CSS_MARKER not in html:
        animations_link = f'href="{prefix}css/animations.css?v={CACHE_VERSION}"'
        if animations_link in html:
            html = html.replace(
                f'  <link rel="stylesheet" href="{prefix}css/animations.css?v={CACHE_VERSION}">',
                f'  <link rel="stylesheet" href="{prefix}css/animations.css?v={CACHE_VERSION}">\n{css_tag}',
                1,
            )
        else:
            layout_link = f'href="{prefix}css/layout.css?v={CACHE_VERSION}"'
            html = html.replace(
                f'  <link rel="stylesheet" href="{prefix}css/layout.css?v={CACHE_VERSION}">',
                f'  <link rel="stylesheet" href="{prefix}css/layout.css?v={CACHE_VERSION}">\n{css_tag}',
                1,
            )

    placeholder = "__SITE_HEADER_GLASS__"
    html = html.replace('class="site-header site-header--glass"', placeholder)
    html = html.replace('class="site-header"', 'class="site-header site-header--glass"')
    html = html.replace(placeholder, 'class="site-header site-header--glass"')

    return html


def main() -> None:
    patch_css_file()

    for path in sorted(ROOT.rglob("index.html")):
        if path.parent.name in SKIP_PARTS:
            continue

        html = path.read_text(encoding="utf-8")

        if 'id="header"' not in html or 'class="site-header' not in html:
            continue

        prefix = asset_prefix(path)
        updated = patch_html(html, prefix)

        if updated != html:
            path.write_text(updated, encoding="utf-8")
            print(f"patched {path.relative_to(ROOT)}")

    steps = ROOT / "pages" / "steps.html"
    if steps.exists():
        html = steps.read_text(encoding="utf-8")
        if 'id="header"' in html:
            updated = patch_html(html, "../")
            if updated != html:
                steps.write_text(updated, encoding="utf-8")
                print("patched pages/steps.html")


if __name__ == "__main__":
    main()
