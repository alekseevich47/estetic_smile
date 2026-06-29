#!/usr/bin/env python3
"""Add mobile glass-effect toggle button and script to site headers."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CLOSE_BTN = '        <button class="nav__close" type="button" aria-label="Закрыть меню">&times;</button>'

GLASS_TOGGLE_BTN = """        <button class="nav__glass-toggle" type="button" data-glass-toggle aria-pressed="true" aria-label="Отключить эффект стекла" hidden>
          <span class="nav__glass-toggle-icon" aria-hidden="true"></span>
        </button>
"""

GLASS_TOGGLE_RE = re.compile(
    r"        <button class=\"nav__glass-toggle\"[^>]*>.*?</button>\n",
    re.DOTALL,
)

HEADER_SCRIPT_RE = re.compile(
    r'(<script defer src="((?:\.\./)*)js/header\.js(?:\?v=[^"]+)?"></script>)'
)

SKIP_PARTS = {"doctors", "assistants", "user-agreement", "privacy-policy", "personal-data-consent"}


def patch_glass_toggle(html: str) -> str:
    if "data-glass-toggle" in html:
        html = GLASS_TOGGLE_RE.sub(GLASS_TOGGLE_BTN, html, count=1)
    elif CLOSE_BTN in html:
        html = html.replace(CLOSE_BTN, GLASS_TOGGLE_BTN + "\n" + CLOSE_BTN, 1)

    if "glass-toggle.js" not in html:

        def add_script(match: re.Match[str]) -> str:
            prefix = match.group(2)
            return (
                f'{match.group(1)}\n'
                f'  <script defer src="{prefix}js/glass-toggle.js"></script>'
            )

        html, count = HEADER_SCRIPT_RE.subn(add_script, html, count=1)

    return html


def main() -> None:
    for path in sorted(ROOT.rglob("*.html")):
        if path.parent.name in SKIP_PARTS:
            continue
        text = path.read_text(encoding="utf-8")
        if "<header" not in text or "nav__close" not in text:
            continue
        patched = patch_glass_toggle(text)
        if patched != text:
            path.write_text(patched, encoding="utf-8")
            print(f"patched: {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
