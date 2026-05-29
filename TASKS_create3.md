# TASKS_create3 — Бегущая строка (marquee-strip)

## Цель
Добавить горизонтальную бегущую строку с 4 блоками-преимуществами между секциями `#hero` и `#advantages`. Каждый блок содержит пустотелый SVG-смайл с CSS-анимацией + текст.

---

## Файлы для чтения перед реализацией

| Файл | Строки | Зачем |
|---|---|---|
| `index.html` | 122–147 | Место вставки: конец `#hero`, начало `#advantages` |
| `css/style.css` | 1–16 | CSS-переменные |
| `css/layout.css` | 1–10, 121–201 | `.container`, `.advantages` |
| `css/animations.css` | весь (134 строк) | Существующие keyframes, чтобы не дублировать |

## Файлы для редактирования

| Файл | Что добавить |
|---|---|
| `index.html` | HTML блока `.marquee-strip` |
| `css/layout.css` | Стили `.marquee-strip` + responsive |
| `css/animations.css` | `@keyframes` для смайлов |

---

## Шаги реализации

### Шаг 1 — HTML в `index.html`
Вставить между строками 146 (`</section>` конец `#hero`) и 147 (`<section id="advantages"`):

```
<div class="marquee-strip" aria-label="Ключевые преимущества">
  <div class="marquee-strip__track">
    <!-- 4 уникальных айтема (дублируются ×2 для бесшовной петли) -->
    <!-- item: [SVG-смайл с уникальным id класса] + [текст] -->
    <!-- Дубли помечены aria-hidden="true" -->
  </div>
</div>
```

**4 текста преимуществ:**
1. `Без боли и страха` — смайл: wink (подмигивание)
2. `Результат за 1 визит` — смайл: счастливая улыбка (рот растягивается)
3. `Команда с душой` — смайл: влюблённый (глаза в виде сердечек)
4. `Комфорт на каждом шаге` — смайл: cool (надевает очки)

Каждый SVG рисуется inline: окружность-лицо (stroke, no fill) + глаза (circles) + рот (path arc). Элементы анимируемых частей получают отдельные классы.

### Шаг 2 — CSS в `css/layout.css`
Добавить сразу после блока `/* Advantages */` новый блок `/* Marquee strip */`:

- `.marquee-strip` — белый фон, `overflow: hidden`, тонкие border-top/bottom
- `.marquee-strip__track` — `display: flex; width: max-content; gap: 16px; animation: marquee-scroll linear infinite`
- `.marquee-strip:hover .marquee-strip__track` — `animation-play-state: paused`
- `.marquee-item` — pill-карточка: border 1px rgba(44,44,44,0.12), border-radius: 14px, padding, flex row, gap; no background (прозрачный)
- `.marquee-item__icon` — размер SVG 44×44, `color: var(--color-text-muted)`, stroke
- `.marquee-item__text` — font-size 15px, font-weight 600, white-space: nowrap

Responsive:
- `@media (max-width: 768px)` — уменьшить padding и font-size

`@media (prefers-reduced-motion: reduce)` — `animation: none; flex-wrap: wrap; justify-content: center`

### Шаг 3 — @keyframes в `css/animations.css`
Добавить в конец файла:

1. `@keyframes marquee-scroll` — `from: translateX(0)` → `to: translateX(-50%)`
2. `@keyframes smiley-wink` — анимировать один глаз: `scaleY(1) → scaleY(0.05) → scaleY(1)`, с задержкой повтора через `animation-delay` внутри длинного цикла (3% wink, 97% пауза — через `animation-timing-function: steps(1)` или ключевые кадры с паузой)
3. `@keyframes smiley-smile` — рот: `d` (path morphing через `clip-path` или `transform scaleX`) либо просто `transform: scaleX(1.15) → scaleX(1)`
4. `@keyframes smiley-heartbeat` — глаза-сердечки: `transform: scale(1) → scale(1.25) → scale(1)`, пульс
5. `@keyframes smiley-glasses` — линза очков: `opacity: 0 → 1`, `translateY(-4px → 0)` при первом появлении, потом idle

**Привязка к элементам:**
- `.marquee-item--wink .smiley__eye-right` → `animation: smiley-wink 4s ease-in-out infinite`
- `.marquee-item--smile .smiley__mouth` → `animation: smiley-smile 3s ease-in-out infinite`
- `.marquee-item--heart .smiley__eye` → `animation: smiley-heartbeat 1.4s ease-in-out infinite`
- `.marquee-item--cool .smiley__glasses` → `animation: smiley-glasses 5s ease-in-out infinite`

---

## Архитектурные решения

- **Бесшовная петля**: трек содержит 8 айтемов (4 оригинала + 4 дубля `aria-hidden`). `translateX(-50%)` возвращает в начало незаметно.
- **Чистый CSS**: JS не нужен.
- **SVG inline**: управление stroke-анимациями через CSS-классы без внешних файлов.
- **transform-origin**: для глаз смайла — `transform-origin: center center` внутри SVG-пространства.
- **`will-change: transform`** на `.marquee-strip__track` для GPU-слоя.
- Дубли помечены `aria-hidden="true"` — скринридеры читают контент только один раз.
