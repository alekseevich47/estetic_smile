# TASKS_create6_rep — Исправление dropdown карты + иконки + фон

## Диагностика проблем

### Проблема 1: dropdown «гуляет» по экрану на мобильном
**Причина:** `animations.css` добавляет `will-change: opacity, transform` (строка 8) на
секции/карточки при scroll-анимации. Любой предок с `transform` или `will-change: transform`
**ломает `position: fixed`** — оно начинает работать как `position: absolute` внутри этого предка,
а не относительно viewport.

**Решение:** В JS переносить `#maps-dropdown` в `document.body` при инициализации
(`document.body.appendChild(dropdown)`). Тогда dropdown всегда вне трансформируемых предков.

### Проблема 2: анимация закрытия не работает
**Причина:** `hidden` атрибут мгновенно ставит `display: none`, не давая сработать CSS-переходу.
Текущий scroll-хендлер вместо закрытия — перепозиционирует.

**Решение:** Заменить `hidden` на CSS-класс `.maps-dropdown--open`. Отдельно управлять
`display` (убирать через `transitionend`). Scroll — плавно скрывать.

---

## Файлы для чтения перед кодом

| Файл | Строки |
|---|---|
| `js/maps.js` | весь файл (130 строк) |
| `css/layout.css` | 2027–2097 (блок `.maps-dropdown`) |
| `index.html` | 1008–1050 (разметка карточки «Адрес» + dropdown) |

## Файлы для редактирования

| Файл | Изменения |
|---|---|
| `js/maps.js` | Полная замена логики (см. Шаг 2) |
| `css/layout.css` | Заменить блок `.maps-dropdown` (строки 2027–2097) (см. Шаг 3) |
| `index.html` | Заменить `<img>` иконок в dropdown (см. Шаг 4) |

---

## Шаг 1 — Иконки (подготовка файлов пользователем)

**Папка:** `images/maps/`

| Файл | Карта | Размер |
|---|---|---|
| `images/maps/yandex.png` | Яндекс Карты | 64×64 px |
| `images/maps/2gis.png` | 2GIS | 64×64 px |
| `images/maps/google.png` | Google Maps | 64×64 px |

Формат — PNG с прозрачным фоном. Отображаются в 32×32 px (retina-ready).
В разметке `index.html` иконки уже должны быть как `<img>`:
```html
<img src="images/maps/yandex.png" width="32" height="32" alt="Яндекс Карты" loading="lazy">
```

---

## Шаг 2 — `js/maps.js`: полная замена логики

```
1. При инициализации:
   - document.body.appendChild(dropdown)  ← КЛЮЧЕВОЕ: выносим из трансформируемых предков
   - dropdown.style.display = 'none'

2. showDropdown():
   - dropdown.style.display = 'flex'
   - requestAnimationFrame → добавить класс .maps-dropdown--open (запускает CSS-переход)
   - Позиционировать через getBoundingClientRect() карточки → position: fixed, top/left/width
   - На мобильных (≤600px): не задавать top/left/width (bottom-sheet через CSS)
   - aria-expanded="true"

3. hideDropdown(animated = true):
   - Убрать .maps-dropdown--open (запускает CSS-переход обратно)
   - После transitionend → dropdown.style.display = 'none'
   - Если animated = false → сразу display: none без transitionend
   - aria-expanded="false"

4. Scroll-хендлер:
   - Если dropdown открыт → вызвать hideDropdown(animated = true)
   - НЕ перепозиционировать

5. Resize-хендлер:
   - Если dropdown открыт → перепозиционировать (только на desktop)

6. Клик вне → hideDropdown()
7. Escape → hideDropdown() + focus на карточку
8. Клик по пункту → hideDropdown() + openMap()
```

---

## Шаг 3 — `css/layout.css`: заменить блок `.maps-dropdown` (строки 2027–2097)

Изменения относительно текущего кода:

| Свойство | Было | Станет |
|---|---|---|
| `background` | `#1e2a3a` (тёмный) | `#ffffff` (белый) |
| `border` | `rgba(74,127,193,0.35)` | `#e0e0e0` |
| `box-shadow` | тёмная тень | `0 8px 24px rgba(0,0,0,0.15)` |
| `color` текста пункта | `rgba(255,255,255,0.85)` | `#2c2c2c` |
| `color` hover пункта | `#fff` | `#1a1a1a` |
| `background` hover | `rgba(74,127,193,0.22)` | `#f0f4fa` |
| `position` | `absolute` (ломается) | `fixed` (вынесено в body) |
| Анимация | `:not([hidden])` | `.maps-dropdown--open` |

Мобильный `@media (≤600px)`:
- `position: fixed; bottom: 0; left: 0; right: 0` — работает корректно т.к. dropdown в body
- Добавить полупрозрачный оверлей через `::before` на `body` (или отдельный `<div id="maps-overlay">`)

> **Оверлей на мобильных:** При открытии dropdown — показывать затемнение за ним.
> Проще всего: отдельный `<div id="maps-overlay" class="maps-overlay">` добавить в body,
> управлять классом `.is-visible` из JS.

---

## Шаг 4 — `index.html`: иконки в dropdown

В разметке кнопок `.maps-dropdown__item` заменить `<!-- SVG ... -->` на `<img>`:

```html
<!-- Яндекс Карты -->
<img src="images/maps/yandex.png" width="32" height="32" alt="" aria-hidden="true" loading="lazy">

<!-- 2GIS -->
<img src="images/maps/2gis.png" width="32" height="32" alt="" aria-hidden="true" loading="lazy">

<!-- Google Maps -->
<img src="images/maps/google.png" width="32" height="32" alt="" aria-hidden="true" loading="lazy">
```

Также добавить в `<body>` перед закрывающим тегом:
```html
<div id="maps-overlay" class="maps-overlay" aria-hidden="true"></div>
```

---

## Итог изменений

```
js/maps.js     → полная замена (~80 строк): перенос в body, CSS-класс анимации, scroll-close
css/layout.css → заменить 70 строк блока .maps-dropdown: светлый фон, fixed, .--open класс
index.html     → <img> иконок, <div id="maps-overlay">
images/maps/   → загрузить 3 PNG файла (пользователь)
```
