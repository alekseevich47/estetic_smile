#!/usr/bin/env python3
"""Add accessibility (low-vision) placeholder links to site headers."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

A11Y_ICON = '<span class="a11y-glasses-icon" aria-hidden="true"></span>'

DESKTOP_LINK = f"""<a class="header__a11y-link" href="#" aria-label="Версия для слабовидящих" title="Версия для слабовидящих">
            {A11Y_ICON}
          </a>
          """

MOBILE_BAR_LINK = f"""<a class="header__a11y-link header__a11y-link--mobile-bar" href="#" aria-label="Версия для слабовидящих" title="Версия для слабовидящих">
          {A11Y_ICON}
        </a>
        """

NAV_PANEL_BLOCK = f"""<div class="nav__divider" aria-hidden="true"></div>
            <a class="nav__a11y-link" href="#">
              <span class="nav__a11y-icon" aria-hidden="true">
                {A11Y_ICON}
              </span>
              <span>Версия для слабовидящих</span>
            </a>
"""

A11Y_SVG_RE = re.compile(
    r'<svg class="(?:header__a11y-icon|nav__a11y-icon-svg)"[^>]*>.*?</svg>',
    re.DOTALL,
)

SKIP_PARTS = {"doctors", "assistants"}


def replace_a11y_icons(html: str) -> str:
    return A11Y_SVG_RE.sub(A11Y_ICON, html)


def patch_header_a11y(html: str) -> str:
    html = replace_a11y_icons(html)

    if "header__a11y-link" in html:
        return html

    html = html.replace(
        '<div class="header__socials" aria-label="Социальные сети">\n          <a class="header__social-link header__social-link--vk"',
        '<div class="header__socials" aria-label="Социальные сети">\n          ' + DESKTOP_LINK + '<a class="header__social-link header__social-link--vk"',
    )

    html = html.replace(
        '<div class="header__actions">\n        <div class="header__socials"',
        '<div class="header__actions">\n        ' + MOBILE_BAR_LINK + '<div class="header__socials"',
    )

    marker = 'aria-label="MAX">\n                <img class="footer__social-icon__img footer__social-icon__img--default"'
    if marker in html:
        old = """              </a>
            </div>
          </div>
        </div>

        <a class="nav__cta btn btn-primary\""""
        new = f"""              </a>
            </div>
            {NAV_PANEL_BLOCK}          </div>
        </div>

        <a class="nav__cta btn btn-primary\""""
        if old in html:
            html = html.replace(old, new, 1)

    return html


def main() -> None:
    for path in sorted(ROOT.rglob("index.html")):
        if path.parent.name in SKIP_PARTS:
            continue
        text = path.read_text(encoding="utf-8")
        if "<header" not in text:
            continue
        patched = patch_header_a11y(text)
        if patched != text:
            path.write_text(patched, encoding="utf-8")
            print(f"patched: {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
