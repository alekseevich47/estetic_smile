# TASKS_create5.md — План изменений

## Файлы для чтения (контекст)
- `css/loader.css` — анимация лоадера
- `js/loader.js` — логика лоадера
- `css/layout.css` — шапка (строки 2280–2600), marquee (строка 203–228)
- `css/animations.css` — @keyframes marquee-scroll (строка 162)
- `js/header.js` — логика шапки
- `index.html` — HTML шапки (строки 95–138), кнопки «Записаться»
- `css/style.css` — .btn-primary, .btn-secondary

## Файлы для редактирования
- `css/loader.css`
- `js/loader.js`
- `css/layout.css`
- `css/animations.css`
- `js/header.js`
- `index.html`
- `css/style.css`

---

## 1. Screen-loader

### 1а. Заменить анимацию «перо» → плавное появление (fade-in)
**Файлы:** `css/loader.css`, `js/loader.js`

- В `css/loader.css`: удалить все `#l-1` … `#l-12`, `#ornament`, `@keyframes draw-stroke`, правила `stroke-dasharray/stroke-dashoffset`.
- Добавить `@keyframes loader-fade-in { from { opacity:0; } to { opacity:1; } }`.
- Применить к SVG-элементу целиком: `animation: loader-fade-in 1s ease both`.
- Убрать завитушки (элемент `#ornament`) из SVG в `index.html` (или скрыть через `display:none`).
- **Ручная настройка времени:** константа `LOADER_ANIMATION_DURATION` в `js/loader.js` (строка 1). Также продублировать значение `1s` в `css/loader.css` в свойстве `animation-duration`.

### 1б. Показывать лоадер только при первом заходе на главную
**Файл:** `js/loader.js`

- Удалить логику `showAndNavigate` (отображение при переходе на другие страницы).
- Удалить обработчик кликов по ссылкам (`document.addEventListener("click", ...)`).
- Удалить обработчик `pageshow`.
- Оставить только инициализацию при `DOMContentLoaded` → `hideAfterAnimation()`.
- Лоадер подключён только в `index.html`, на других страницах его нет → дополнительных проверок не нужно.

### 1в. Время анимации — 1 секунда, затем плавное скрытие
**Файлы:** `js/loader.js`, `css/loader.css`

- `LOADER_ANIMATION_DURATION = 1000` (мс) в `js/loader.js` — **здесь менять вручную**.
- Скрытие (`transition: opacity 0.5s ease`) уже есть в `loader.css` — оставить как есть.

---

## 2. Бегущая строка — замедление

**Файл:** `css/layout.css` строка 216

- Изменить `animation: marquee-scroll 24s linear infinite` → `marquee-scroll 40s linear infinite`.
- **Ручная настройка скорости:** значение `40s` в этой же строке — чем больше, тем медленнее.

---

## 3. Шапка

### 3а. Увеличить логотип + прямоугольная зона
**Файлы:** `css/layout.css`, `index.html`

- `.header__logo img`: увеличить `width/height` с 44px до 60px.
- `.header__logo`: добавить `background: rgba(255,255,255,0.07)`, `padding: 8px 16px`, `border-radius: 12px`.

### 3б. Плавающая шапка со скруглёнными углами и отступом сверху
**Файл:** `css/layout.css`

- `.site-header`: убрать `position: sticky; top:0`, заменить на `position: fixed; top: 12px; left: 50%; transform: translateX(-50%); width: calc(100% - 32px); max-width: 1280px; border-radius: 20px`.
- Добавить `backdrop-filter: blur(12px); background: rgba(44,44,44,0.92)`.
- В `index.html` добавить `<div style="height:87px">` (компенсация fixed) или padding-top у `<main>`.
- **Ручная настройка отступа сверху:** значение `top: 12px` в `.site-header` в `css/layout.css`.
- Адаптив: на мобильных (`≤768px`) `width: calc(100% - 16px); top: 8px`.

### 3в. Контур вокруг кнопок навигации, hover → белый фон + тёмный текст
**Файл:** `css/layout.css`

- `.header__menu a, .header__dropdown-toggle`: добавить `border: 1px solid rgba(255,255,255,0.25)`.
- `.header__menu a:hover, .header__dropdown-toggle:hover, ...`: `background: #fff; color: #2C2C2C; border-color: #fff`.
- `.header__cta` (кнопка «Записаться»): добавить явный `border: 1px solid #4A7FC1`, hover → `background: #fff; color: #2C2C2C; border-color: #fff`.

### 3г. Скрытие шапки при скролле вниз, появление при скролле вверх / покое
**Файл:** `js/header.js`, `css/layout.css`

- Логика в `header.js`:
  - Хранить `lastScrollY`, `ticking`.
  - При скролле вниз на **>80px** от последней позиции → `header.classList.add('header--hidden')`.
  - При скролле вверх или остановке → `header.classList.remove('header--hidden')`.
  - Порог 80px — **погрешность**, предотвращает мигание при небольших движениях вниз.
- В `css/layout.css`: `.site-header { transition: transform 0.4s ease, opacity 0.4s ease; }` + `.site-header.header--hidden { transform: translateX(-50%) translateY(-110%); }`.

### 3д. Мобильный дропдаун «Услуги» закрывается при скролле
**Файл:** `js/header.js`

- Добавить `window.addEventListener('scroll', closeDropdown, { passive: true })` — закрывает выпадающий список при любом скролле (работает и на ПК, и на мобильных).
- Убедиться, что `closeDropdown` не блокирует скролл страницы (убрать любой `overflow:hidden` на `body` при открытом дропдауне если есть).

### 3е. ПК: плавный hover-дропдаун «Услуги»
**Файл:** `css/layout.css`

- Уже реализован через `:hover` + `opacity/visibility/transform transition`.
- Проверить/уточнить: убедиться что `transition` на `.header__dropdown` включает `opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease` — при необходимости скорректировать.
- Убрать `:focus-within` как триггер (может мешать плавному закрытию на ПК) или оставить только `.is-open` и `:hover`.

---

## 4. Кнопки «Записаться» — анимированная иконка планшета с полосками

**Файлы:** `index.html`, `css/style.css`, `css/animations.css`

- Внутри каждой кнопки «Записаться» добавить inline SVG-иконку планшета (`<svg class="btn-tablet-icon">`).
- На «экране» планшета — 3 горизонтальные полоски (`<rect>` или `<line>`), каждая с отдельной задержкой анимации.
- В `css/animations.css`: `@keyframes bar-blink { 0%,100%{opacity:0.15} 50%{opacity:1} }`.
- Каждой полоске: `animation: bar-blink 1.4s ease-in-out infinite`, задержки `0s / 0.2s / 0.4s` — эффект последовательного мигания.
- Иконка масштабируется через `width/height` в em (привязана к font-size кнопки).
- Адаптив: `white-space: nowrap` на кнопках, иконка не уменьшается ниже `14px`.
- Применить ко всем вхождениям в `index.html`: header (строка 129), hero (150), promo (505), cta (685, 731).

---

