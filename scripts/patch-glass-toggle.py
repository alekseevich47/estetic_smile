#!/usr/bin/env python3
"""Add mobile glass-effect toggle button and script to site headers."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CLOSE_BTN = '        <button class="nav__close" type="button" aria-label="Закрыть меню">&times;</button>'

GLASS_TOGGLE_BTN = """        <button class="nav__glass-toggle" type="button" data-glass-toggle aria-pressed="true" aria-label="Отключить эффект стекла" hidden>
          <span class="nav__glass-toggle-icon nav__glass-toggle-icon--on" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.5" y="5.5" width="13" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M5.5 12.5L8.5 9.5L11 11.5L14.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
              <path d="M3.5 8H16.5" stroke="currentColor" stroke-width="1" opacity="0.35"/>
            </svg>
          </span>
          <span class="nav__glass-toggle-icon nav__glass-toggle-icon--off" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.25 2.75L5.75 10.25H9.75L8.75 17.25L14.25 9.75H10.25L11.25 2.75Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
"""

HEADER_SCRIPT_RE = re.compile(
    r'(<script defer src="((?:\.\./)*)js/header\.js(?:\?v=[^"]+)?"></script>)'
)

SKIP_PARTS = {"doctors", "assistants", "user-agreement", "privacy-policy", "personal-data-consent"}


def patch_glass_toggle(html: str) -> str:
    if "data-glass-toggle" not in html and CLOSE_BTN in html:
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
