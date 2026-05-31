# TASKS_ref2 — План изменений UI

## Задача 1: Фикс шапки на мобильных

**Проблема:** на `≤768px` шапка тонкая, кнопка «Записаться» смещена в центр, логотип съезжает.

**Причина:** `head.svg` как фон задаёт высоту визуально, но сам блок `.site-header` (80px) не держит пропорции при сжатии. `transform: translateX(-80px)` на `.header__actions` ломает layout на узких экранах.

**Читать:** `css/sections/header.css`  
**Редактировать:** `css/sections/header.css`

**Что делать:**
1. В `@media (max-width: 768px)` явно задать `height: 64px` на `.site-header`.
2. Убрать/пересчитать `transform: translateX(-80px)` у `.header__actions` — заменить на `margin-left: auto` только внутри мобильного контекста.
3. `.header__logo` на `≤768px`: зафиксировать `width`, убрать `overflow: hidden` (или исправить `margin-left` на `img`), чтобы логотип не вылезал за SVG-фон.
4. На `≤480px` кнопку CTA уменьшить до `padding: 0 12px`, сохранить `min-height: 34px`.

---

## Задача 2: Мобильное меню — slide-in панель справа

**Сейчас:** `.header__nav` выпадает сверху вниз (`translateY`).  
**Нужно:** полноэкранная панель, выезжает справа (`translateX(100%)`), внутри — логотип сверху по центру, затем пункты меню по центру (с вложенным списком для «Услуг»), снизу — кнопка «Записаться».

**Читать:** `css/sections/header.css`, `js/header.js`, `index.html` (строки 85–143)  
**Редактировать:** `css/sections/header.css`, `js/header.js`, `index.html`

**Что делать:**

### HTML (`index.html`)
- В блок `.header__nav` добавить:
  - `<div class="nav__logo">` с логотипом + названием клиники (копия из `.footer__logo`)
  - Кнопку закрытия `×` (`.nav__close`) — позиция `absolute top-right`
  - `<a class="nav__cta btn btn-primary">Записаться</a>` внизу панели

### CSS (`css/sections/header.css`)
- На `≤992px` изменить `.header__nav`:
  - `position: fixed; inset: 0 0 0 auto` (или `right: 0; top: 0; bottom: 0`)
  - `width: min(320px, 100vw)`
  - `display: flex; flex-direction: column; align-items: center`
  - `padding: 40px 24px 32px`
  - `background: var(--color-dark)`
  - `transform: translateX(100%)` → закрыто; `transform: translateX(0)` → открыто
  - Добавить `transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)`
- `.nav__logo`: `display: flex; align-items: center; gap: 12px; margin-bottom: 40px`
- `.header__menu` внутри панели: `flex-direction: column; align-items: center; gap: 0; width: 100%`
- Пункты меню: крупный текст (18–20px), без border, простой `hover: color: accent`
- Вложенный список «Услуг» — индентация, меньший размер (14–15px), `color: rgba(white, 0.7)`
- `.nav__cta`: `margin-top: auto; width: 100%; text-align: center`
- Добавить `.nav__close`: `position: absolute; top: 16px; right: 16px` — иконка «×»
- `body.menu-open`: добавить `::after` overlay (dim background) чтобы затемнить контент позади панели

### JS (`js/header.js`)
- Убрать ссылку на `nav.addEventListener("scroll", ...)` — скролл внутри панели не нужен
- При открытии: `showHeader()` + убрать scroll lock (он уже есть через `body.menu-open { overflow: hidden }`)
- `.nav__close` — добавить listener: `setMenuState(false)`
- Клик по оверлею (`body.menu-open::after` или отдельный div `#nav-overlay`) — `setMenuState(false)`

---

## Задача 3: Кнопка «наверх»

**Читать:** `css/sections/cta.css` (там floating-btn стили), `js/cookie.js`  
**Редактировать:** `css/sections/cta.css`, `js/cookie.js`, `index.html`

**Что делать:**

### HTML (`index.html`)
- Добавить кнопку рядом с `#floating-btn`:
  ```html
  <button id="scroll-top-btn" class="scroll-top-btn" type="button" aria-label="Наверх">
    <!-- SVG стрелка вверх -->
  </button>
  ```

### CSS (`css/sections/cta.css`)
- `.scroll-top-btn`:
  - `position: fixed; bottom: 24px; right: 24px` (или рядом с floating-btn)
  - `width: 44px; height: 44px; border-radius: 50%`
  - `background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2)`
  - `opacity: 0; pointer-events: none; transform: translateY(12px)`
  - `transition: opacity 0.3s, transform 0.3s`
- `.scroll-top-btn.is-visible`: `opacity: 1; pointer-events: auto; transform: translateY(0)`
- Если оба floating-btn и scroll-top-btn рядом — расположить столбиком через `bottom: 80px` у scroll-top

### JS (`js/cookie.js`)
- В `initCookie()` добавить обработчик: при `window.scrollY > 300` добавлять `.is-visible` на `#scroll-top-btn`
- Клик на кнопку: `window.scrollTo({ top: 0, behavior: 'smooth' })`

---

## Задача 4: Новый footer

**Структура (по скриншотам):**

| Блок | Мобайл | Десктоп |
|---|---|---|
| Верх | Логотип + кнопка «Записаться» | Логотип (лево) + nav-ссылки (центр) + кнопка (право) |
| Середина | 2 колонки: соцсети \| телефон; Направления \| Документы | 4 колонки |
| Низ | «Разработка сайта» | «Разработка сайта» (право) |

**Читать:** `css/sections/contacts.css` (строки 354–513), `index.html` (строки 1106–1157)  
**Редактировать:** `css/sections/contacts.css`, `index.html`

**Что делать:**

### HTML (`index.html`, блок `<footer>`)
Переписать разметку footer:
```
footer.footer
  div.footer__top.container
    a.footer__logo (лого + название)
    nav.footer__top-nav (Галерея, Акции, О нас, Отзывы, Контакты)
    a.btn.btn-secondary.footer__top-cta "Записаться"

  div.footer__middle.container
    div.footer__col (Наши услуги — список)
    div.footer__col (Документы — список)
    div.footer__col (Соцсети — кнопки VK, WhatsApp)
    div.footer__col (Как с нами связаться — телефон)

  div.footer__bottom.container
    span "© 2026 Estetic Smile"
    a.footer__dev-link "Разработка сайта" (с иконкой)
```

### CSS (`css/sections/contacts.css`, блок `.footer`)
- **`.footer__top`**: `display: flex; align-items: center; justify-content: space-between; padding: 28px 0; border-bottom: 1px solid rgba(white,0.1)`
  - На `≤768px`: только лого + кнопка (nav скрыть)
- **`.footer__top-nav`**: flex строчка, ссылки как `pill` (как на скрине — oval border), скрыть на мобайл
- **`.footer__middle`**: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; padding: 40px 0`
  - На `≤768px`: `grid-template-columns: 1fr 1fr; gap: 24px 16px`
- **`.footer__col h3`**: 14px, uppercase, `color: rgba(white,0.5)`, `margin-bottom: 14px`
- **`.footer__col ul`**: список без маркеров, gap 8px
- Соцсети: кнопки с иконкой + текстом (`VK — ВКонтакте`, `WhatsApp — Mах`), стиль из скрина — тёмный прямоугольник с иконкой в circle
- Телефон: крупный, `font-weight: 700`
- **`.footer__bottom`**: `display: flex; justify-content: space-between; padding: 16px 0; border-top: ...; font-size: 13px; color: rgba(white,0.5)`
- **Удалить** старые классы: `.footer__main`, `.footer__brand`, `.footer__nav` (или очистить)

---

## Порядок реализации

1. Задача 1 (шапка mobile fix) — изолированный CSS-фикс
2. Задача 2 (slide-in меню) — CSS + JS + minor HTML
3. Задача 3 (scroll-to-top) — HTML + CSS + JS
4. Задача 4 (footer) — HTML + CSS

## Файлы к изменению

| Файл | Задачи |
|---|---|
| `css/sections/header.css` | 1, 2 |
| `js/header.js` | 2 |
| `index.html` | 2, 3, 4 |
| `css/sections/cta.css` | 3 |
| `js/cookie.js` | 3 |
| `css/sections/contacts.css` | 4 |

**Страницы `pages/*.html`** — после реализации нужно продублировать изменения шапки и footer (разметка идентична).
