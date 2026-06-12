# TASKS — Новое меню (header v2)

Только главная страница (`index.html`). Мобильное меню (≤992px) не трогаем.

---

## 0. Рефы (файлы для чтения перед правками)

| Файл | Зачем |
|---|---|
| `index.html` (L95–168) | Текущий header: лого, nav, dropdown, socials, CTA |
| `css/sections/header.css` (весь) | Все стили header, desktop + mobile |
| `js/header.js` (весь) | Логика: scroll, burger, dropdown toggle, Escape |
| `css/style.css` (L1–16) | :root переменные |
| `images/head_new.svg` | Новый фон шапки: rounded rect #25282D + обводка #E5E7F6, 1100×80 |
| `images/head.svg` | Старый фон (сложная левая маска) — для сравнения |
| `images/menu/block_1.jpg` … `block_4.jpg` | 4 фона для карточек мега-дропдауна |
| `images/icons/vk_bw.png`, `vk_color.png`, `max_bw.png`, `max_color.png` | Иконки соцсетей (image-swap) |

**Файлы для редактирования:**
- `index.html` — HTML header (лого → текст, дропдаун → мега-дропдаун, соц-иконки)
- `css/sections/header.css` — все новые стили
- `js/header.js` — логика мега-дропдауна (hover open/close)
- `.cursor/rules/stack.mdc` — обновление документации

---

## 1. Замена фона шапки

**Файл:** `css/sections/header.css`

В `.site-header` (L11) заменить:

```
background: transparent url("../../images/head.svg") center / 100% 100% no-repeat;
```

→

```
background: transparent url("../../images/head_new.svg") center / 100% 100% no-repeat;
```

`head_new.svg` — простой скруглённый прямоугольник: fill `#25282D`, stroke `#E5E7F6`. Никакой сложной левой маски, поэтому левый край плоский (без «кармана» под логотип).

---

## 2. Логотип → текст «Estetic Smile» (Patefon Light)

### 2.1 HTML

**Файл:** `index.html`, L97–99

Заменить:

```html
<a class="header__logo" href="/" aria-label="Estetic Smile — на главную">
  <img src="images/logo.png" alt="Логотип Estetic Smile" width="250" height="80">
</a>
```

На:

```html
<a class="header__logo" href="/" aria-label="Estetic Smile — на главную">
  Estetic Smile
</a>
```

### 2.2 CSS

**Файл:** `css/sections/header.css`

- `.header__logo` (L42–52): убрать все `img`-зависимые стили.
- Установить:
  - `font-family: "Patefon Light", sans-serif`
  - `font-size: ~22–26px` (подобрать визуально)
  - `color: var(--color-white)`
  - `text-decoration: none`
  - `padding-left: 28–32px` (небольшой отступ от левого края шапки)
  - `white-space: nowrap`
  - Убрать `width`, `transform: translateX(16px)`, `overflow: visible`
  - Высоту и вертикальное выравнивание обеспечить через `display: flex; align-items: center`

- Правило `.header__logo img` (L54–63) — удалить.

- В медиа-запросах для `.header__logo` (L318–321, L361–363, L569–573, L606–613) оставить только `display: none` для mobile (≤992px), остальные размеры — под новый текстовый логотип.

---

## 3. Переименование «Услуги» → «Наши услуги»

**Файл:** `index.html`, L109

```html
Услуги
```

→

```html
Наши услуги
```

---

## 4. Мега-дропдаун (desktop ≥993px)

### 4.1 HTML-структура

**Файл:** `index.html`, L112–122

Заменить текущий `<ul class="header__dropdown">` (простой список из 9 ссылок) на новую разметку:

```html
<div class="header__dropdown header__dropdown--mega" aria-label="Услуги клиники">
  <div class="mega__grid">

    <!-- Блок 1: Терапевтическое лечение (левый верхний) -->
    <a href="therapy/" class="mega__card" style="background-image: url('images/menu/block_1.jpg')">
      <div class="mega__card-overlay">
        <h3 class="mega__card-title">Терапевтическое лечение</h3>
        <ul class="mega__card-list">
          <li>Лечение кариеса</li>
          <li>Лечение пульпита</li>
          <li>Лечение периодонтита</li>
        </ul>
      </div>
    </a>

    <!-- Блок 2: Ортопедическое лечение (правый верхний) -->
    <a href="ortopediy/" class="mega__card" style="background-image: url('images/menu/block_2.jpg')">
      <div class="mega__card-overlay">
        <h3 class="mega__card-title">Ортопедическое лечение</h3>
        <ul class="mega__card-list">
          <li>Установление виниров</li>
          <li>Протезирование</li>
        </ul>
      </div>
    </a>

    <!-- Блок 3: Хирургическое лечение (левый нижний) -->
    <a href="surgery/" class="mega__card" style="background-image: url('images/menu/block_3.jpg')">
      <div class="mega__card-overlay">
        <h3 class="mega__card-title">Хирургическое лечение</h3>
        <ul class="mega__card-list">
          <li>Удаление зуба</li>
          <li>Имплантация</li>
        </ul>
      </div>
    </a>

    <!-- Блок 4: Профилактическое лечение (правый нижний) -->
    <a href="prevention/" class="mega__card" style="background-image: url('images/menu/block_4.jpg')">
      <div class="mega__card-overlay">
        <h3 class="mega__card-title">Профилактическое лечение</h3>
        <ul class="mega__card-list">
          <li>Отбеливание</li>
          <li>Гигиена</li>
          <li>Осмотры</li>
        </ul>
      </div>
    </a>

    <!-- Блок 5: Консультация (правый вертикальный, на 2 ряда) -->
    <div class="mega__consult">
      <h3 class="mega__consult-title">Не знаете с чего начать?<br>Начните с консультации</h3>
      <p class="mega__consult-text">
        <!-- Текст придумать: позвонить по номеру или оставить заявку -->
        ...
      </p>
      <a class="mega__consult-btn btn btn-dark" href="#" data-open-booking>Консультация</a>
    </div>

  </div>
</div>
```

Требования к структуре:
- Каждый из 4 блоков — **ссылка** `<a>` на соответствующую категорию (`therapy/`, `ortopediy/`, `surgery/`, `prevention/`).
- Изображение — `background-image` в inline style (как на других карточках услуг в проекте).
- `.mega__card-overlay` — затенённая область в **правой части** блока (тёмный градиент: `linear-gradient(to right, transparent 30%, rgba(0,0,0,0.75) 100%)`), внутри которой заголовок + список.
- Пункты списка — **не ссылки** (вся карточка-ссылка ведёт на категорию), просто `<li>` для визуального списка.
- Блок 5 (консультация) — `<div>` (не ссылка), внутри своя кнопка `data-open-booking`.
- Номер телефона в тексте консультации — `<a href="tel:+79234921444">+7 (923) 492-14-44</a>`, кликабельный.

### 4.2 CSS — позиционирование мега-дропдауна

**Файл:** `css/sections/header.css`

**.header__dropdown--mega (desktop):**

- `position: fixed` (не absolute — должен выходить за границы `.header__menu-item--dropdown`)
- `left: 0; right: 0; top: 0` — с отступом сверху под шапку (учесть `12px` top шапки + `80px` высоту = `top: 92px`)
- `height: calc(100vh - 92px)` — почти весь экран
- `background: #25282D` (совпадает с fill head_new.svg)
- `border-radius: 0 0 20px 20px` (скругление снизу)
- `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`
- Плавное появление:
  - `opacity: 0; visibility: hidden; transform: translateY(-8px);`
  - `transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;`
- При открытии (класс `is-open` на родителе):
  - `.header__menu-item--dropdown.is-open .header__dropdown--mega` → `opacity: 1; visibility: visible; transform: translateY(0);`

**Переопределить для desktop (min-width: 993px):**
- Скрыть старые стили `.header__dropdown` (position absolute, top: 100%, etc.) для `.header__dropdown--mega`.

**Для mobile (≤992px):**
- Мега-дропдаун должен вести себя как текущий простой аккордеон: `position: static`, `display: none` → `display: flex` при `.is-open`, без фиксированного позиционирования. Но карточки в мобильной версии нужно отображать в колонку (не grid 2×2).
- Возможное решение: в мобильной версии показывать упрощённый список ссылок (как сейчас), а `.header__dropdown--mega` скрывать. **Либо** адаптировать grid в flex-колонку.

### 4.3 CSS — сетка карточек

**.mega__grid (desktop):**

```
display: grid;
grid-template-columns: 1fr 1fr 280px;
grid-template-rows: 1fr 1fr;
gap: 14px;
max-width: 1180px;
margin: 40px auto 0;
padding: 0 16px;
height: calc(100% - 40px);
```

Блоки 1–4 занимают по 1 ячейке (2×2), блок 5 — `grid-row: 1 / 3; grid-column: 3;` (на всю высоту).

**.mega__card (блоки 1–4):**

- `position: relative; overflow: hidden; border-radius: 15px;`
- `background-size: cover; background-position: center;`
- `text-decoration: none; color: var(--color-white);`
- `display: block;` (ссылка на всю карточку)
- Hover: легкое масштабирование фона `transform: scale(1.03)` на `background-size` (через псевдоэлемент или `:hover .mega__card-overlay { background: ... darker }`)

**.mega__card-overlay:**

- `position: absolute; top: 0; right: 0; bottom: 0;`
- `width: 55–60%;` (только правая часть)
- `background: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.85) 100%);`
- `display: flex; flex-direction: column; justify-content: center;`
- `padding: 24px 28px;`

**.mega__card-title:**

- `font-size: 18px; font-weight: 700; margin-bottom: 14px;`
- `line-height: 1.25;`

**.mega__card-list:**

- `list-style: none; padding: 0; margin: 0;`
- `font-size: 14px; font-weight: 500;`
- `color: rgba(255, 255, 255, 0.8);`
- `display: flex; flex-direction: column; gap: 6px;`

**.mega__card-list li:**

- `position: relative; padding-left: 14px;`
- Псевдоэлемент `::before`: круглая точка `·` или синий кружок.

### 4.4 CSS — блок консультации (правый вертикальный)

**.mega__consult:**

- `background: #F5F5F5;` (светлый, почти белый)
- `border-radius: 15px;`
- `display: flex; flex-direction: column;`
- `padding: 32px 28px;`
- `color: var(--color-dark);`

**.mega__consult-title:**

- `font-size: 20px; font-weight: 700;`
- `margin-bottom: 18px; line-height: 1.3;`

**.mega__consult-text:**

- `font-size: 14px; color: var(--color-text-gray);`
- `line-height: 1.6; margin-bottom: auto;` (прижимает кнопку вниз)
- Ссылка телефона внутри: `color: var(--color-accent); font-weight: 600;`

**.mega__consult-btn (кнопка «Консультация»):**

- Использует существующий класс `.btn.btn-dark`: чёрный фон `#2C2C2C`, белый текст, скруглённые углы.
- `width: 100%; margin-top: 20px;`
- Hover: стандартный для `.btn-dark`.

### 4.5 CSS — адаптив мега-дропдауна для mobile (≤992px)

На мобильных устройствах мега-дропдаун должен работать как упрощённый список внутри слайд-панели:

- `.header__dropdown--mega` → `position: static; height: auto; background: transparent; box-shadow: none; border-radius: 0; transform: none; opacity: 1; visibility: visible;` (сбрасываем desktop-позиционирование)
- `.mega__grid` → `display: flex; flex-direction: column; gap: 0; padding: 0; margin: 0; max-width: none;`
- `.mega__card` → `height: auto; border-radius: 0; background-image: none !important;` (убираем фоны — только текст)
- `.mega__card-overlay` → `position: static; width: 100%; background: transparent; padding: 6px 10px;`
- `.mega__card-title` → `font-size: 15px; color: rgba(255,255,255,0.7); font-weight: 500;` (как текущие ссылки дропдауна)
- `.mega__card-list` → `display: none;` (скрываем списки — в мобильной версии достаточно заголовков-ссылок)
- `.mega__consult` → `display: none;` (скрываем блок консультации на мобильной)

### 4.6 JS — логика открытия/закрытия

**Файл:** `js/header.js`

Текущая логика:
- `.header__menu-item--dropdown` — клик по toggle → `toggleDropdown()` (переключает `is-open`)
- `mouseenter`/hover → dropdown открывается через CSS `:hover` (L147–152)

Новая логика (desktop ≥993px, определять через `window.matchMedia`):
- **Открытие**: `mouseenter` на `.header__dropdown-toggle` → добавить `is-open` на `.header__menu-item--dropdown`
- **Закрытие**: `mouseleave` с `.header__menu-item--dropdown` → убрать `is-open` с задержкой ~200ms (для плавного ухода курсора на дропдаун)
- **Также закрывать**: при скролле (уже есть в `handleScroll`), при клике вне дропдауна (уже есть)
- **Не закрывать**: при `mouseenter` на сам `.header__dropdown--mega` (сброс таймера закрытия)

Для mobile (≤992px) поведение не менять: клик по toggle → `toggleDropdown()`.

**Изменения в `header.js`:**
- Добавить `megaDropdown` и `megaDropdownItem` ссылки
- Заменить/дополнить ховер-логику: вместо CSS `:hover` использовать JS `mouseenter`/`mouseleave` с таймером
- Добавить `mql = window.matchMedia('(min-width: 993px)')` для разделения desktop/mobile поведения
- Учесть, что на скролле дропдаун должен закрываться (уже есть `closeDropdown` в `handleScroll`)

---

## 5. Замена иконок соцсетей (VK → image-swap, WhatsApp → MAX)

### 5.1 HTML

**Файл:** `index.html`, L141–152

Заменить оба `<a class="header__social-link">` с SVG-иконками на image-swap:

```html
<a class="header__social-link header__social-link--vk" href="#" target="_blank" rel="noopener" aria-label="ВКонтакте">
  <img src="images/icons/vk_bw.png" alt="" class="social-icon social-icon--default" width="20" height="20">
  <img src="images/icons/vk_color.png" alt="" class="social-icon social-icon--hover" width="20" height="20">
</a>
<a class="header__social-link header__social-link--max" href="#" target="_blank" rel="noopener" aria-label="MAX">
  <img src="images/icons/max_bw.png" alt="" class="social-icon social-icon--default" width="20" height="20">
  <img src="images/icons/max_color.png" alt="" class="social-icon social-icon--hover" width="20" height="20">
</a>
```

### 5.2 CSS

**Файл:** `css/sections/header.css`

- Удалить правила `:hover`/`:focus-visible` с `background` и `border-color` для конкретных `aria-label` (L200–212) — больше не нужны.
- Добавить image-swap стили (как в футере):
  - `.social-icon--default` — `opacity: 1; transition: opacity 0.3s ease;`
  - `.social-icon--hover` — `position: absolute; opacity: 0; transition: opacity 0.3s ease;`
  - `.header__social-link:hover .social-icon--default` → `opacity: 0;`
  - `.header__social-link:hover .social-icon--hover` → `opacity: 1;`
- `.header__social-link` должен быть `position: relative;` (для absolute-позиционирования hover-версии).

---

## 6. Кнопка «Записаться»

**Без изменений.** HTML (L153–161) и CSS (L214–237) — не трогать.

---

## 7. Мобильное меню (≤992px)

**Брейкпоинт не менять.** Вся существующая логика burger-меню, слайд-панели, `nav__close`, `nav__overlay` остаётся без изменений.

Единственное: в мобильной версии мега-дропдаун должен деградировать до упрощённого списка (см. п. 4.5).

---

## 8. Фикс прикрепления кнопок при уменьшении экрана

**Файл:** `css/sections/header.css`

Проблема: `.header__actions` имеет `transform: translateX(-80px)` (L171), что при сужении экрана может вызывать наложение на центральное меню.

**Решение:**
- Убрать `transform: translateX(-80px)` из `.header__actions`
- Использовать `margin-left: auto` (уже есть в mobile, L510–513 — вынести в десктоп)
- Для промежуточных разрешений (993–1200px): уменьшить `gap` у `.header__container`, возможно уменьшить `padding` или `font-size` пунктов меню
- Проверить, что при ширине ~1000–1100px всё не схлопывается:
  - `.header__container` gap: `clamp(10px, 1.5vw, 24px)`
  - `.header__actions` gap: `8px`
  - `.header__social-link`: `width/height: 34px` (чуть меньше на узких экранах)

Добавить медиа-запрос `@media (max-width: 1100px)`:
- Уменьшить `font-size` пунктов меню до `12px`
- Уменьшить `padding` пунктов меню до `0 8px`
- `.header__social-link` → `width: 32px; height: 32px;`

---

## 9. Обновление `.cursor/rules/stack.mdc`

**Файл:** `.cursor/rules/stack.mdc`

Внести изменения в секции:

### Header — background
```
- background: transparent url("../../images/head_new.svg") center / 100% 100% no-repeat;
  (fill: #25282D, stroke: #E5E7F6 — простой скруглённый прямоугольник)
```

### Header — логотип
```
- `.header__logo` — текст «Estetic Smile», шрифт "Patefon Light", ≈24px, белый, padding-left: ~30px
  (логотип-изображение убран)
```

### Header — соцсети
```
- VK: image-swap vk_bw.png → vk_color.png (#0077FF) при hover
- MAX: image-swap max_bw.png → max_color.png (градиент #471AFF → #9500FF) при hover
  (SVG-иконки заменены на img с image-swap, как в футере)
```

### Меню — дропдаун
Добавить новую секцию о мега-дропдауне:
```
### Мега-дропдаун «Наши услуги» (desktop ≥993px)

- Переименован: «Услуги» → «Наши услуги»
- Открывается при наведении (mouseenter), закрывается при уходе курсора (mouseleave + 200ms задержка)
- `position: fixed; left: 0; right: 0; top: 92px; height: calc(100vh - 92px)`
- Фон: `#25282D`, скругление снизу 20px, тень
- Сетка: `grid-template-columns: 1fr 1fr 280px; grid-template-rows: 1fr 1fr; gap: 14px`
- 4 карточки услуг (2×2) + 1 вертикальный блок консультации (grid-row: 1 / 3)
- Карточки: фоновое изображение (images/menu/block_N.jpg), справа градиентная overlay с заголовком и списком
- Вся карточка — ссылка на категорию (therapy/, ortopediy/, surgery/, prevention/)
- Блок консультации: светлый фон #F5F5F5, заголовок, текст с кликабельным телефоном, чёрная кнопка «Консультация» (data-open-booking)
- На mobile (≤992px): деградирует до упрощённого текстового списка (только заголовки-ссылки, без фонов и консультации)
```

### Меню — структура
Обновить описание `.header__menu` для desktop:
```
- «Наши услуги» ▼ — мега-дропдаун на всю ширину (grid 2×2 карточек + консультация)
- «Наши работы», «Акции», «О нас», «Контакты» — pill-кнопки (как раньше)
```

---

## Порядок выполнения (рекомендуемый)

1. **CSS: замена фона** (п.1) — 1 строка
2. **HTML + CSS: текстовый логотип** (п.2) — убрать img, добавить текст, font-family
3. **HTML: переименование «Услуги»** (п.3) — 1 слово
4. **HTML: мега-дропдаун разметка** (п.4.1) — заменить `<ul>` на `<div>` с гридом
5. **CSS: мега-дропдаун стили** (пп.4.2–4.5) — новый блок стилей в header.css
6. **JS: логика hover** (п.4.6) — заменить CSS :hover на JS mouseenter/mouseleave
7. **HTML + CSS: иконки соцсетей** (п.5) — image-swap
8. **CSS: фикс кнопок** (п.8) — responsive tweaks
9. **stack.mdc** (п.9) — обновить документацию
