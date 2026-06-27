#!/usr/bin/env python3
"""Generate price table HTML from prices/price.xlsx into prices/index.html."""
from __future__ import annotations

import html
import re
import subprocess
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "prices" / "price.xlsx"
INDEX = ROOT / "prices" / "index.html"
PATCH = ROOT / "scripts" / "patch-asset-version.py"

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
NS_R = {"m": NS["m"], "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}

CATEGORIES = [
    ("anesthesia", "Анестезия"),
    ("therapy", "Терапия"),
    ("orthopedics", "Ортопедия"),
    ("hygiene", "Гигиена"),
    ("radiology", "Рентгенология"),
    ("surgery", "Хирургия"),
]

MARKER_START = "<!-- PRICES_TABLE_START -->"
MARKER_END = "<!-- PRICES_TABLE_END -->"


def col_letters(cell_ref: str) -> str:
    return re.sub(r"\d+", "", cell_ref)


def read_shared_strings(z: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in z.namelist():
        return []
    root = ET.fromstring(z.read("xl/sharedStrings.xml"))
    strings: list[str] = []
    for si in root.findall(".//m:si", NS):
        texts = [t.text or "" for t in si.findall(".//m:t", NS)]
        strings.append("".join(texts))
    return strings


def cell_value(cell: ET.Element, shared: list[str]) -> str:
    cell_type = cell.get("t")
    value_el = cell.find("m:v", NS)
    if value_el is None or value_el.text is None:
        inline = cell.find("m:is", NS)
        if inline is not None:
            texts = [t.text or "" for t in inline.findall(".//m:t", NS)]
            return "".join(texts)
        return ""
    raw = value_el.text
    if cell_type == "s" and raw.isdigit():
        return shared[int(raw)]
    return raw


def read_sheet_rows(z: zipfile.ZipFile, sheet_path: str, shared: list[str]) -> list[list[str]]:
    root = ET.fromstring(z.read(sheet_path))
    rows: list[list[str]] = []
    for row in root.findall(".//m:sheetData/m:row", NS):
        cells_by_col: dict[str, str] = {}
        for cell in row.findall("m:c", NS):
            ref = cell.get("r", "")
            cells_by_col[col_letters(ref)] = cell_value(cell, shared)
        if not cells_by_col:
            continue
        max_col = max(cells_by_col.keys(), key=lambda c: (len(c), c))
        width = ord(max_col[-1]) - ord("A") + 1
        if len(max_col) > 1:
            width = 26 + ord(max_col[1]) - ord("A") + 1
        line: list[str] = []
        for idx in range(width):
            col = chr(ord("A") + idx)
            line.append(cells_by_col.get(col, ""))
        rows.append(line)
    return rows


def sheet_paths_by_order(z: zipfile.ZipFile) -> list[str]:
    workbook = ET.fromstring(z.read("xl/workbook.xml"))
    rels_root = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    rel_map = {
        rel.get("Id"): rel.get("Target")
        for rel in rels_root.findall("{http://schemas.openxmlformats.org/package/2006/relationships}Relationship")
    }
    paths: list[str] = []
    for sheet in workbook.findall("m:sheets/m:sheet", NS):
        rel_id = sheet.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
        target = rel_map.get(rel_id, "")
        if target.startswith("/"):
            target = target.lstrip("/")
        elif not target.startswith("xl/"):
            target = f"xl/{target}"
        paths.append(target)
    return paths


def normalize_search(*parts: str) -> str:
    text = " ".join(p for p in parts if p)
    text = text.replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text


def format_price(value: str) -> str:
    value = value.strip().replace("\xa0", "")
    if not value:
        return ""
    try:
        if "." in value:
            number = int(float(value))
        else:
            number = int(value)
    except ValueError:
        return html.escape(value)
    formatted = f"{number:,}".replace(",", "\u00a0")
    return f"{formatted}&nbsp;₽"


def format_service_cell(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    parts = [html.escape(part) for part in text.split("\n") if part.strip() or len(parts) == 1]
    return "<br>".join(parts) if parts else ""


def parse_items(rows: list[list[str]]) -> list[tuple[str, str, str, str]]:
    header_idx = None
    for idx, row in enumerate(rows):
        if len(row) >= 3 and row[0].strip() == "#" and row[1].strip() == "Код":
            header_idx = idx
            break
    if header_idx is None:
        return []

    items: list[tuple[str, str, str, str]] = []
    for row in rows[header_idx + 1 :]:
        if len(row) < 4:
            continue
        num = row[0].strip()
        if not num or not num[0].isdigit():
            continue
        code = row[1].strip()
        name = row[2].strip()
        price = row[3].strip() if len(row) > 3 else ""
        if not name:
            continue
        items.append((num, code, name, price))
    return items


def build_table_html(items_by_category: dict[str, list[tuple[str, str, str, str]]], labels: dict[str, str]) -> str:
    lines = [
        '        <div class="prices-table-wrap">',
        '          <table class="prices-table" data-prices-table>',
        "            <thead>",
        "              <tr>",
        '                <th class="prices-table__col-category" scope="col">Категория</th>',
        '                <th scope="col">#</th>',
        '                <th scope="col">Код</th>',
        '                <th scope="col">Услуга</th>',
        '                <th scope="col">Стоимость</th>',
        "              </tr>",
        "            </thead>",
        "            <tbody>",
    ]

    for slug, _label in CATEGORIES:
        for num, code, name, price in items_by_category.get(slug, []):
            label = labels[slug]
            search = normalize_search(num, code, name, label)
            lines.append(
                "              <tr"
                f' data-category="{slug}"'
                f' data-search="{html.escape(search, quote=True)}"'
                ">"
                f'                <td class="prices-table__category">{html.escape(label)}</td>'
                f"                <td>{html.escape(num)}</td>"
                f'                <td class="prices-table__code">{html.escape(code)}</td>'
                f'                <td class="prices-table__service">{format_service_cell(name)}</td>'
                f'                <td class="prices-table__price">{format_price(price)}</td>'
                "              </tr>"
            )

    lines.extend(
        [
            "            </tbody>",
            "          </table>",
            "        </div>",
            '        <p class="prices-empty" data-prices-empty hidden>Ничего не найдено. Попробуйте изменить запрос.</p>',
        ]
    )
    return "\n".join(lines)


def load_prices_from_xlsx(path: Path) -> dict[str, list[tuple[str, str, str, str]]]:
    if not path.exists():
        raise FileNotFoundError(f"Missing {path.relative_to(ROOT)}")

    with zipfile.ZipFile(path) as z:
        shared = read_shared_strings(z)
        sheet_paths = sheet_paths_by_order(z)
        if len(sheet_paths) < len(CATEGORIES):
            raise ValueError(f"Expected at least {len(CATEGORIES)} sheets in {path.name}")

        items_by_category: dict[str, list[tuple[str, str, str, str]]] = {}
        for (slug, _label), sheet_path in zip(CATEGORIES, sheet_paths):
            rows = read_sheet_rows(z, sheet_path, shared)
            items_by_category[slug] = parse_items(rows)
        return items_by_category


def inject_table(html_text: str, table_html: str) -> str:
    if MARKER_START not in html_text or MARKER_END not in html_text:
        raise ValueError(f"Markers not found in {INDEX.relative_to(ROOT)}")
    start = html_text.index(MARKER_START) + len(MARKER_START)
    end = html_text.index(MARKER_END)
    return html_text[:start] + "\n" + table_html + "\n        " + html_text[end:]


def main() -> int:
    items = load_prices_from_xlsx(XLSX)
    labels = {slug: label for slug, label in CATEGORIES}
    table_html = build_table_html(items, labels)

    html_text = INDEX.read_text(encoding="utf-8")
    INDEX.write_text(inject_table(html_text, table_html), encoding="utf-8")

    total = sum(len(v) for v in items.values())
    print(f"Updated {INDEX.relative_to(ROOT)} ({total} services across {len(CATEGORIES)} categories)")

    if PATCH.exists():
        subprocess.run([sys.executable, str(PATCH)], check=True, cwd=ROOT)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
