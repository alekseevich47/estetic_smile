#!/usr/bin/env python3
"""Add «Реквизиты» link to Company nav/footer on all pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PATTERN = re.compile(
    r'(\s*)(<li><a href="([^"]*?)documents/"(?: aria-current="page")?>Документы</a></li>)'
)


def patch(html: str, *, current_page: str | None = None) -> str:
    if "requisites/" in html and "Реквизиты" in html:
        return html

    def repl(m: re.Match[str]) -> str:
        ws, link, prefix = m.group(1), m.group(2), m.group(3)
        rest = html[m.end() : m.end() + 120]
        if f"{prefix}requisites/" in rest:
            return m.group(0)
        current = ' aria-current="page"' if current_page == "requisites" else ""
        return (
            f"{ws}{link}\n"
            f'{ws}<li><a href="{prefix}requisites/"{current}>Реквизиты</a></li>'
        )

    return PATTERN.sub(repl, html)


def main() -> None:
    count = 0
    for path in ROOT.rglob("*.html"):
        if "Tasks" in path.parts or path.parts[-2:] == ("pages", "steps.html"):
            continue
        text = path.read_text(encoding="utf-8")
        current = "requisites" if path.parent.name == "requisites" else None
        new = patch(text, current_page=current)
        if new != text:
            path.write_text(new, encoding="utf-8")
            count += 1
            print(path.relative_to(ROOT))
    print(f"Patched {count} files")


if __name__ == "__main__":
    main()
