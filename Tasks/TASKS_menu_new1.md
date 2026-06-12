# TASKS — Редизайн мега-дропдауна (v3)

Только главная страница (`index.html`). Только desktop (≥993px). Мобильное меню и другие страницы не трогаем.

---

## 0. Рефы

| Файл | Зачем |
|---|---|
| `index.html` L107–167 | Текущая HTML-структура дропдауна (`.header__menu-item--dropdown`, все `.mega__card`, `.mega__consult`) |
| `index.html` L372–415 | Тексты-описания для 4 категорий услуг (в `.service-card__content p`) — взять оттуда для новых `.mega__card-desc` |
| `css/sections/header.css` L195–339 | Текущие стили мега-дропдауна (desktop `min-width: 993px`) |
| `js/header.js` весь | Логика hover (открытие/закрытие, таймер, scroll, Escape) |

**Файлы для редактирования:**

| Файл | Что меняем |
|---|---|
| `index.html` L112–165 | Замена HTML внутри `.header__dropdown--mega` (4 карточки + консультация) |
| `css/sections/header.css` L195–340 | Новые стили `.mega__card`, `.mega__card-curtain`, `.mega__card-title`, `.mega__card-desc`, высота дропдауна, отступы грида |
| `.cursor/rules/stack.mdc` | Обновление документации мега-дропдауна |

**НЕ редактировать:**
- `js/header.js` — JS-логика hover/open/close не меняется
- Все mobile-стили (≤992px) — не трогаем
- `.mega__consult` — блок консультации остаётся без изменений (кроме возможной адаптации высоты)

---

## 1. Уменьшение высоты дропдауна (шапка + дропдаун ≤ 2/3 экрана)

**Файл:** `css/sections/header.css`

Заменить в `@media (min-width: 993px)`:

- `.site-header--home .header__dropdown--mega` → `top: 76px` (без изменений)
- Высоту: `height: calc(100vh - 76px)` → `height: auto; max-height: calc(66.67vh - 76px)`
- У `.mega__grid`: `margin: 40px auto 0` → `margin: 20px auto 0` (уменьшить верхний отступ пропорционально)
- У `.mega__grid`: `height: calc(100% - 40px)` → заменить на `height: auto` (контент сам определяет высоту, max-height родителя ограничивает)

---

## 2. Новый дизайн карточек — шторка с анимацией

### 2.1 Что меняется

**Было:** `.mega__card-overlay` — градиентная overlay в правой части (58% ширины), всегда видна. Содержит заголовок и `<ul>` список.

**Стало:** `.mega__card-curtain` — шторка во всю ширину карточки, в состоянии покоя занимает нижнюю полосу (~36% высоты). Содержит заголовок (виден всегда) и описание (скрыто, показывается при hover).

### 2.2 Новая HTML-структура одной карточки

Заменить текущую структуру (4 шт.):

```html
<!-- БЫЛО -->
<a href="therapy/" class="mega__card" style="background-image: url('images/menu/block_1.jpg')">
  <div class="mega__card-overlay">
    <h3 class="mega__card-title">Терапевтическое лечение</h3>
    <ul class="mega__card-list">…</ul>
  </div>
</a>
```

На новую (для каждой из 4 карточек):

```html
<a href="therapy/" class="mega__card" style="background-image: url('images/menu/block_1.jpg')">
  <div class="mega__card-curtain">
    <h3 class="mega__card-title">Терапевтическое лечение</h3>
    <p class="mega__card-desc">Лечение кариеса, пульпита, периодонтита — сохраняем здоровье зубов без боли.</p>
  </div>
</a>
```

**Ключевые изменения в HTML:**
- `.mega__card-overlay` → `.mega__card-curtain`
- `<ul class="mega__card-list">` удалить
- Добавить `<p class="mega__card-desc">` с кратким описанием категории

**Тексты описаний (взять из секции #services, `index.html` L378–413):**

| Карточка | `.mega__card-desc` |
|---|---|
| Терапевтическое лечение | Лечение кариеса, пульпита, периодонтита — сохраняем здоровье зубов без боли. |
| Ортопедическое лечение | Протезирование, виниры, коронки — восстанавливаем форму и функцию зубов. |
| Хирургическое лечение | Удаление зубов любой сложности и имплантация с точным планированием. |
| Профилактическое лечение | Профессиональная гигиена, отбеливание и профилактические осмотры. |

### 2.3 CSS — состояние покоя (default)

**Файл:** `css/sections/header.css`, внутри `@media (min-width: 993px)`

Удалить старые правила: `.mega__card-overlay`, `.mega__card-list`, `.mega__card-list li`, `.mega__card-list li::before`, `:hover` на `.mega__card-overlay`.

Добавить новые:

**.mega__card** (основные стили без изменений):
- `position: relative; overflow: hidden; border-radius: 15px;`
- `background-size: cover; background-position: center;`
- `text-decoration: none; color: var(--color-white); display: block;`
- Убрать старый hover `background-size: 105%` (заменяется анимацией шторки)

**.mega__card-curtain** (нижняя полоса в покое):
- `position: absolute; bottom: 0; left: 0; right: 0;`
- `height: 36%;` — занимает нижнюю треть карточки
- `overflow: hidden;` — **критично**: контент выше шторки (описание) обрезается
- `display: flex; flex-direction: column; justify-content: flex-end;` — заголовок прижат к низу
- `padding: 24px;`
- `background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 100%);`
- `backdrop-filter: blur(5px);` — лёгкое замыливание фото под шторкой
- `transition: height 0.45s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.45s ease, background 0.45s ease;`

**.mega__card-title:**
- `font-size: 18px; font-weight: 700; margin: 0 0 10px; color: var(--color-white);`
- `transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);`

**.mega__card-desc:**
- `font-size: 13px; line-height: 1.55; color: rgba(255, 255, 255, 0.85);`
- `opacity: 0; transform: translateY(10px);` — скрыт в покое
- `transition: opacity 0.35s ease 0s, transform 0.35s ease 0s;` — быстрое исчезание (без задержки)

### 2.4 CSS — hover (анимация появления)

**.mega__card:hover .mega__card-curtain:**
- `height: 100%;` — шторка выезжает на всю высоту
- `backdrop-filter: blur(14px);` — сильное замыливание
- `background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 70%, transparent 100%);` — сильнее затемнение

**.mega__card:hover .mega__card-title:**
- `transform: translateY(-40px);` — заголовок уезжает вверх одновременно со шторкой

**.mega__card:hover .mega__card-desc:**
- `opacity: 1; transform: translateY(0);` — описание плавно появляется
- `transition: opacity 0.35s ease 0.12s, transform 0.35s ease 0.12s;` — с задержкой 120ms (после начала движения шторки)

### 2.5 Порядок анимации

| Событие | Что происходит | Тайминг |
|---|---|---|
| **Hover** | Шторка выезжает вверх (height 36% → 100%) | 0.45s, сразу |
| | Заголовок уезжает вверх (translateY: -40px) | 0.45s, синхронно со шторкой |
| | Описание проявляется (opacity 0 → 1) | 0.35s, с задержкой 0.12s |
| **Mouse leave** | Описание исчезает (opacity 1 → 0) | 0.35s, без задержки |
| | Заголовок возвращается (translateY: 0) | 0.45s, синхронно |
| | Шторка опускается (height 100% → 36%) | 0.45s, синхронно |

CSS-переходы на hover и default реализуют это автоматически (разные задержки на вход и выход).

---

## 3. Контент ближе к краям

**Файл:** `css/sections/header.css`, внутри `@media (min-width: 993px)`

В `.mega__grid`:
- `max-width: 1180px` → `max-width: 1240px`
- `padding: 0 16px` → `padding: 0 20px`

Разница: на экране 1440px (шапка ~1280px) боковые отступы уменьшатся с ~66px до ~40px с каждой стороны.

---

## 4. Блок `.mega__consult` — без изменений

HTML и CSS блока консультации не трогаем. Единственное: он автоматически адаптируется под новую высоту дропдауна через `grid-row: 1 / 3` и flex-растяжение.

---

## 5. Обновление `.cursor/rules/stack.mdc`

Заменить секцию «Мега-дропдаун „Наши услуги“ (desktop ≥993px)» на:

```markdown
### Мега-дропдаун «Наши услуги» (desktop ≥993px)
```
.header__menu-item--dropdown — родительский li с position: relative
.header__dropdown-toggle     — кнопка «Наши услуги»
.header__dropdown--mega      — мега-дропдаун:
  · position: fixed; left: 0; right: 0; top: 76px (главная) / 92px (внутренние)
  · max-height: calc(66.67vh - 76px) — шапка + дропдаун ≤ 2/3 экрана
  · background: #25282D, border-radius: 0 0 20px 20px, box-shadow
  · opacity: 0; visibility: hidden; transform: translateY(-8px) → is-open: visible

.mega__grid             — grid-template-columns: 1fr 1fr 280px; grid-template-rows: 1fr 1fr; gap: 14px
                          max-width: 1240px, margin: 20px auto 0, padding: 0 20px

.mega__card (4 шт., 2×2) — <a> на категорию, background-image: block_N.jpg, border-radius: 15px, overflow: hidden
  .mega__card-curtain   — position: absolute, bottom: 0, height: 36% (покой) → 100% (hover)
                          overflow: hidden (обрезает описание в покое)
                          backdrop-filter: blur(5px → 14px), flex column, justify-content: flex-end
  .mega__card-title     — font-size: 18px, font-weight: 700, hover: translateY(-40px)
  .mega__card-desc      — font-size: 13px, opacity: 0 → 1 (с задержкой 0.12s на hover)

.mega__consult (правый вертикальный, grid-row: 1 / 3):
  · background: #F5F5F5, border-radius: 15px, flex column
  · заголовок + текст (с кликабельным tel:) + чёрная кнопка «Консультация» (data-open-booking)

Desktop hover-логика (JS):
  · БЕЗ ИЗМЕНЕНИЙ — mouseenter/mouseleave с таймером 200ms
```
```

---

## Порядок выполнения

1. **CSS: высота дропдауна + отступы** (п.1 + п.3) — 4-5 строк в header.css
2. **HTML: новая структура карточек** (п.2.2) — заменить 4 `.mega__card` в index.html
3. **CSS: стили шторки** (пп.2.3–2.5) — новый блок правил вместо старых `.mega__card-overlay` / `.mega__card-list`
4. **stack.mdc** — обновить документацию (п.5)
