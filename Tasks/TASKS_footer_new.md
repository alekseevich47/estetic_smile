# TASKS_footer_new — Полная переработка footer

## Легенда

| Метка | Значение |
|---|---|
| ✂️ | Удаление |
| ✏️ | Изменение существующего |
| ➕ | Создание нового |
| 📖 | Прочитать перед работой |
| 📱 | Только для мобильной версии (≤768px) |
| 🖥 | Только для компьютерной версии (>768px) |

---

## 0. Подготовка: создать пустые placeholder-страницы

Все новые страницы создаются по шаблону существующих inner-страниц: `header` + `inner-hero` (с breadcrumbs и заглушкой «Страница в разработке») + `footer` (уже новый — см. шаг 5). Пути к ресурсам: `../css/`, `../js/`, `../images/`.

### ➕ T0.1 — `licenses/index.html`
- `inner-hero`: H1 «Лицензии», подзаголовок «Документы и лицензии клиники Estetic Smile.»
- Контент-секция: заглушка «Информация появится в ближайшее время.»
- **Создать**: `licenses/index.html`.

### ➕ T0.2 — `documents/index.html`
- `inner-hero`: H1 «Документы», подзаголовок «Официальные документы клиники.»
- Контент-секция: заглушка.
- **Создать**: `documents/index.html`.

### ➕ T0.3 — `doctors/index.html`
- `inner-hero`: H1 «Врачи», подзаголовок «Специалисты клиники Estetic Smile.»
- Контент-секция: заглушка.
- **Создать**: `doctors/index.html`.

### ➕ T0.4 — `assistants/index.html`
- `inner-hero`: H1 «Ассистенты», подзаголовок «Ассистенты клиники Estetic Smile.»
- Контент-секция: заглушка.
- **Создать**: `assistants/index.html`.

### ➕ T0.5 — `prices/index.html`
- `inner-hero`: H1 «Цены», подзаголовок «Стоимость услуг клиники Estetic Smile.»
- Контент-секция: заглушка.
- **Создать**: `prices/index.html`.

---

## 1. Меню: переименовать «Галерея» → «Наши работы»

### ✏️ T1.1 — Обновить header__menu во ВСЕХ HTML-файлах
Заменить текст ссылки `Галерея` на `Наши работы` во всех `<ul class="header__menu">`:
- `index.html`
- `therapy/index.html`
- `ortopediy/index.html`
- `surgery/index.html`
- `prevention/index.html`
- `about/index.html`
- `promo/index.html`
- `gallery/index.html`
- `contacts/index.html`
- `licenses/index.html`
- `documents/index.html`
- `doctors/index.html`
- `assistants/index.html`
- `prices/index.html`

**Редактировать**: все перечисленные `*/index.html`.
**📖 Читать**: `index.html` строки 114 (header__menu), любая inner-страница для формата.

### ✏️ T1.2 — Обновить `aria-current` в `gallery/index.html`
Путь остаётся `gallery/`, но текст `aria-current="page"` уже на «Наши работы».
**Редактировать**: `gallery/index.html`.

---

## 2. Footer HTML: главная страница (`index.html`)

### 📖 T2.0 — Прочитать текущий footer
**📖 Читать**: `index.html` строки 778–850 (весь `<footer>`).

### ✏️ T2.1 — Заменить логотип в footer__top
Заменить `src="images/logo.png"` на `src="images/logo_new.png"` в `footer__logo`.
Оставить `width="250" height="80"` и `loading="lazy"`.
**Редактировать**: `index.html`, строка 781.

### ✂️ T2.2 — Удалить footer__top-nav
Удалить весь `<nav class="footer__top-nav" ...>` (строки 784–790).
**Редактировать**: `index.html`.

### ✏️ T2.3 — Оставить footer__top-cta
Кнопка «Записаться» (строки 792–800) остаётся без изменений.
**Ничего не делать**.

### ➕ T2.4 — Полностью заменить footer__middle
Заменить всё содержимое `<div class="footer__middle container">` (строки 803–845) на новую структуру:

```html
<div class="footer__middle container">

  <!-- Колонка 1: Наши услуги -->
  <div class="footer__col footer__col--services" data-footer-accordion>
    <h3 class="footer__col-title" data-footer-accordion-toggle>
      Наши услуги
      <span class="footer__col-arrow" aria-hidden="true"></span>
    </h3>
    <ul class="footer__col-list" data-footer-accordion-body>
      <li><a href="therapy/">Лечение кариеса</a></li>
      <li><a href="therapy/">Лечение пульпита</a></li>
      <li><a href="therapy/">Лечение периодонтита</a></li>
      <li><a href="surgery/">Удаление зуба</a></li>
      <li><a href="surgery/">Имплантация</a></li>
      <li><a href="ortopediy/">Протезирование</a></li>
      <li><a href="ortopediy/">Виниры</a></li>
      <li><a href="prevention/">Отбеливание</a></li>
      <li><a href="prevention/">Гигиена</a></li>
    </ul>
  </div>

  <!-- Колонка 2: Компания -->
  <div class="footer__col footer__col--company">
    <h3 class="footer__col-title">Компания</h3>
    <ul class="footer__col-list">
      <li><a href="about/">О нас</a></li>
      <li><a href="licenses/">Лицензии</a></li>
      <li><span class="footer__col-inactive">Отзывы</span></li>
      <li><a href="documents/">Документы</a></li>
      <li class="footer__col-item--desktop-only"><span class="footer__col-inactive">Пользовательское соглашение</span></li>
    </ul>
  </div>

  <!-- Колонка 3: Специалисты -->
  <div class="footer__col footer__col--specialists">
    <h3 class="footer__col-title">Специалисты</h3>
    <ul class="footer__col-list">
      <li><a href="doctors/">Врачи</a></li>
      <li><a href="assistants/">Ассистенты</a></li>
    </ul>
  </div>

  <!-- Колонка 4: Ссылки (столбик) -->
  <div class="footer__col footer__col--stacked">
    <ul class="footer__col-list">
      <li><a href="gallery/">Наши работы</a></li>
      <li><a href="prices/">Цены</a></li>
      <li><a href="promo/">Акции</a></li>
      <li><a href="contacts/">Контакты</a></li>
      <li class="footer__col-item--desktop-only"><span class="footer__col-inactive">Версия для слабовидящих</span></li>
    </ul>
  </div>

  <!-- Колонка 5: Как с нами связаться -->
  <div class="footer__col footer__col--contact">
    <h3 class="footer__col-title">Как с нами связаться</h3>
    <div class="footer__contact-items">
      <a href="tel:+79234921444" class="footer__contact-item">
        <span class="footer__contact-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6.6 10.8a14.7 14.7 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.7c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
        </span>
        <span>+7 (923) 492-14-44</span>
      </a>
      <button class="footer__contact-item footer__contact-item--address" id="footer-address-card" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="maps-dropdown">
        <span class="footer__contact-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2.5A7.5 7.5 0 0 0 4.5 10c0 5.3 6.2 10.5 7 11.1.3.2.7.2 1 0 .8-.6 7-5.8 7-11.1A7.5 7.5 0 0 0 12 2.5Zm0 10.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
        </span>
        <div>
          <span>г. Тайга, ул. Лермонтова, 10</span>
          <span class="footer__contact-hint">нажмите, чтобы открыть на карте</span>
        </div>
      </button>
      <div class="footer__contact-item">
        <span class="footer__contact-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm1 10V7h-2v6.3l4.4 2.6 1-1.7-3.4-1.7Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
        </span>
        <span>Пн-Сб — 09:30 - 19:00, Вс — выходной</span>
      </div>
    </div>
    <div class="footer__social-icons">
      <a class="footer__social-icon footer__social-icon--vk" href="#" aria-label="ВКонтакте">
        <img src="images/icons/vk_bw.png" alt="" loading="lazy">
      </a>
      <a class="footer__social-icon footer__social-icon--max" href="#" aria-label="MAX">
        <img src="images/icons/max_bw.png" alt="" loading="lazy">
      </a>
    </div>
  </div>

</div>
```

**Редактировать**: `index.html`.

### ➕ T2.5 — Добавить мобильный правовой блок (после footer__middle, внутри footer)
Сразу после `</div>` (закрытия `footer__middle`), но до `footer__bottom`, добавить:

```html
<div class="footer__legal-mobile">
  <span>© 2026 ООО «Эстетик Смайл»</span>
  <span class="footer__col-inactive">Пользовательское соглашение</span>
  <span class="footer__col-inactive">Разработка сайта</span>
  <span class="footer__col-inactive">Версия для слабовидящих</span>
</div>
```

Этот блок видим только на мобильных (≤768px), скрыт на десктопе.
**Редактировать**: `index.html`.

### ✏️ T2.6 — Заменить footer__bottom
Заменить содержимое `<div class="footer__bottom container">` (строка 847–849) на:

```html
<div class="footer__bottom container">
  <span>© 2026 ООО «Эстетик Смайл»</span>
  <span class="footer__bottom-dev">by urbanstudio</span>
</div>
```

Этот блок видим только на десктопе (>768px), скрыт на мобильных.
**Редактировать**: `index.html`.

---

## 3. Footer CSS: полная переработка `contacts.css`

### 📖 T3.0 — Прочитать текущие стили footer
**📖 Читать**: `css/sections/contacts.css` строки 351–653 (весь блок `.footer`).

### ✏️ T3.1 — Заменить всю секцию `.footer` и её медиа-запросы
Полностью заменить CSS с строки 351 до конца файла новой реализацией.

**Основные изменения:**

#### footer__top
- Убрать `footer__top-nav` (pill-кнопки) — удалить все связанные стили.
- Оставить `.footer__logo` и `.footer__top-cta`.
- 🖥 `footer__top`: `display: flex; align-items: center; justify-content: space-between`.
- 📱 ≤768px: столбик (лого → CTA, центрировано).

#### footer__middle (🖥 desktop)
- `grid-template-columns`: 5 колонок. Примерное распределение:
  - `footer__col--services`: `minmax(180px, 1fr)`
  - `footer__col--company`: `minmax(160px, 0.9fr)`
  - `footer__col--specialists`: `minmax(140px, 0.7fr)`
  - `footer__col--stacked`: `minmax(120px, 0.6fr)`
  - `footer__col--contact`: `minmax(200px, 1.1fr)`
- `footer__col-title`: `font-size: 13px` (уменьшен с 14px), остальное без изменений.
- `footer__col-list a`: `font-size: 14px` (уменьшен).
- `footer__col-inactive`: `color: rgba(255,255,255,0.4); cursor: default;` (некликабельные строки).
- `footer__col-item--desktop-only`: `display: block` на десктопе, `display: none` на мобильных.

#### footer__middle (📱 mobile ≤768px)
- `grid-template-columns: 1fr` (одна колонка).
- Все `footer__col` идут друг за другом.
- `footer__col-title`: cursor pointer только для `[data-footer-accordion-toggle]`.
- `footer__col-arrow`: стрелка вниз `▼`, transition `transform 0.3s`. При открытом аккордеоне: `transform: rotate(180deg)`.
- `footer__col-list`: `max-height: 0; overflow: hidden; transition: max-height 0.35s ease` (аккордеон-анимация для «Наши услуги»). Для остальных колонок — всегда видимы (без max-height).
- `footer__col--stacked .footer__col-list`: без заголовка-аккордеона, элементы идут списком.
- `footer__col--services` — ТОЛЬКО эта колонка имеет аккордеон-поведение на мобильных (скрыта по умолчанию).

#### footer__contact-items
- `display: flex; flex-direction: column; gap: 12px`.
- `footer__contact-item`: `display: flex; align-items: flex-start; gap: 10px; color: rgba(255,255,255,0.72); font-size: 14px`.
- `footer__contact-icon`: `flex-shrink: 0; color: rgba(255,255,255,0.4);` — иконки серые, контурные.
- `footer__contact-hint`: `font-size: 12px; color: rgba(255,255,255,0.35); font-style: italic; margin-top: 2px`.
- `footer__contact-item--address`: кнопка, `cursor: pointer; background: none; border: none; text-align: left; color: inherit; font-family: inherit`. Hover: `color: #fff`.

#### footer__social-icons
- `display: flex; gap: 12px; margin-top: 16px`.
- `footer__social-icon`: `display: inline-flex; width: 36px; height: 36px; opacity: 0.55; transition: opacity 0.3s, filter 0.3s`.
- `footer__social-icon img`: `width: 100%; height: 100%; object-fit: contain`.
- Hover: `opacity: 1`.
- `footer__social-icon--vk:hover img`: `filter: brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(1500%) hue-rotate(188deg) brightness(95%) contrast(90%);` (≈ #0077FF).
- `footer__social-icon--max:hover img`: градиентный эффект через `filter` или `background` + `mix-blend-mode`. Наиболее надёжный способ: использовать `background: linear-gradient(135deg, #471AFF, #9500FF)` на родителе + `mix-blend-mode: lighten` или создать CSS-градиентную маску. Допустимо упростить до однотонного фиолетового через `filter` с `hue-rotate` (~270deg).

#### footer__legal-mobile (📱)
- `display: none` на десктопе, `display: flex; flex-direction: column; align-items: center; gap: 8px` на мобильных.
- `padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.1)` (сепаратор сверху).
- `font-size: 13px; color: rgba(255,255,255,0.5)`.

#### footer__bottom
- 📱 `display: none`.
- 🖥 `display: flex; justify-content: space-between; align-items: center` (© слева/центр, by urbanstudio справа).
- `border-top: 1px solid rgba(255,255,255,0.1)`.
- `font-size: 13px; color: rgba(255,255,255,0.5)`.
- `footer__bottom-dev`: `color: rgba(255,255,255,0.35)`.

#### Сепараторы
- `footer__legal-mobile`: `border-top: 1px solid rgba(255,255,255,0.1)` — такая же линия, как у `footer__top`.
- `footer__bottom`: такая же линия.

#### Размеры шрифтов (общее уменьшение)
- `footer__col-title`: `font-size: 13px` (было 14px).
- `footer__col-list a`, `footer__col-list span`: `font-size: 14px`.
- `footer__contact-item`: `font-size: 14px`.
- `footer__contact-hint`: `font-size: 12px`.

**Редактировать**: `css/sections/contacts.css` (строки 351–653).

---

## 4. JS: аккордеон для footer (мобильные) + карты

### ➕ T4.1 — Добавить аккордеон для «Наши услуги» в footer
В `js/accordion.js` (или в `js/main.js`, или отдельным обработчиком) добавить логику:
- По клику на `[data-footer-accordion-toggle]` переключать класс `is-open` на родителе `[data-footer-accordion]`.
- `is-open` → `footer__col-list` раскрывается (`max-height` на значение scrollHeight), стрелка поворачивается.
- Только для `[data-footer-accordion]` (не трогать основной FAQ-аккордеон).

**Редактировать**: `js/main.js` (добавить несколько строк) или добавить в `js/accordion.js`.
**📖 Читать**: `js/accordion.js` (текущая реализация FAQ-аккордеона).

### ➕ T4.2 — Интегрировать выпадающий список карт для адреса в footer
Кнопка `#footer-address-card` должна открывать тот же `#maps-dropdown`, что и `#address-card` в секции contacts.
- Добавить обработчик в `js/maps.js`: при клике на `#footer-address-card` открывать `#maps-dropdown` (позиционировать рядом с кнопкой).
- Закрытие: клик по `#maps-overlay`, выбор карты, повторный клик по кнопке.
- **Редактировать**: `js/maps.js`.
- **📖 Читать**: `js/maps.js` (текущая реализация для `#address-card`).

---

## 5. Синхронизировать footer на ВСЕХ страницах

### 📖 T5.0 — Канонический footer (главная страница)
Каноническая структура footer находится в `index.html` (строки 788–926). Все страницы должны быть приведены к ней.

**Ключевые особенности, отличающиеся от первоначального плана:**
- Логотип: не `<img src="logo_new.png">`, а **текстовый `<span>`** со шрифтом Patefon Light (inline-стили)
- Колонка 4: не `footer__col--stacked` с единым `<ul>`, а отдельные `<h3 class="footer__col-title">` + `<a>` для каждой ссылки + `<ul>` только для «Версия для слабовидящих»
- Соцсети: image-swap (default → color PNG), не CSS filter
- Время работы: два `<span>` с `<br>` (раздельные строки)
- Главная имеет класс `footer--home` (влияет на центрирование `footer__bottom`); inner-страницы **без** этого класса
- **📖 Читать**: `index.html` строки 788–926.

### ✏️ T5.1 — Исправить 5 placeholder-страниц под каноническую структуру
Placeholder-страницы (`licenses`, `documents`, `doctors`, `assistants`, `prices`) уже имеют новый footer, но с расхождениями относительно канона с главной. Исправить:

**а) Логотип**: заменить `<img src="../images/logo_new.png">` на текстовый `<span>`:
```html
<span style="display: inline-flex; align-items: center; width: var(--footer-logo-width); aspect-ratio: 250 / 80; color: #fff; font-family: 'Patefon Light', 'Patefon', serif; font-size: clamp(30px, 3.4vw, 46px); font-weight: 300; line-height: 1; white-space: nowrap;">Estetic Smile</span>
```

**б) Колонка 4**: заменить `footer__col--stacked` с `<ul>` на структуру как на главной:
```html
<div class="footer__col footer__col--specialists">
  <h3 class="footer__col-title">
    <a href="../gallery/">Наши работы</a>
  </h3>
  <h3 class="footer__col-title">
    <a href="../prices/">Цены</a>
  </h3>
  <h3 class="footer__col-title">
    <a href="../promo/">Акции</a>
  </h3>
  <h3 class="footer__col-title">
    <a href="../contacts/">Контакты</a>
  </h3>
  <ul class="footer__col-list">
    <li class="footer__col-item--desktop-only"><a href="#">Версия для слабовидящих</a></li>
  </ul>
</div>
```

**в) Время работы**: заменить `<span>Пн-Сб — 09:30 - 19:00, Вс — выходной</span>` на:
```html
<div>
  <span>Пн-Сб — 09:30 - 19:00</span><br>
  <span>Вс — выходной</span>
</div>
```

**Редактировать**: `licenses/index.html`, `documents/index.html`, `doctors/index.html`, `assistants/index.html`, `prices/index.html`.

### ✏️ T5.2 — Заменить footer на 8 СТАРЫХ inner-страницах
Эти страницы всё ещё содержат **старый** footer (с `footer__top-nav`, старыми колонками, `footer__col--docs`, `footer__col--social` и т.д.). Полностью заменить `<footer>` на каноническую структуру из `index.html` (строки 788–926), адаптировав пути (`../`):

- `therapy/index.html`
- `ortopediy/index.html`
- `surgery/index.html`
- `prevention/index.html`
- `about/index.html`
- `promo/index.html`
- `gallery/index.html`
- `contacts/index.html`

**Правила адаптации:**
- Логотип: идентичный текстовый `<span>` (как на главной)
- Все `href` — с префиксом `../` (например `href="../therapy/"`)
- `src` соцсетей: `src="../images/icons/vk_bw.png"`, `src="../images/icons/vk_color.png"` и т.д.
- `href="tel:+79234921444"` — без изменений
- `data-open-booking` — без изменений
- **БЕЗ** класса `footer--home`
- На текущей странице — ссылка с `aria-current="page"` (аналогично placeholder-страницам)
- Не забыть убрать старый `footer__top-nav`, `footer__col--docs`, `footer__col--social` и старый `footer__bottom`

**Редактировать**: все 8 перечисленных файлов.
**📖 Читать**: `index.html` (строки 788–926) + `licenses/index.html` (эталон после T5.1).

---

## 6. Обновить `stack.mdc`

### ✏️ T6.1 — Обновить секцию «Меню и навигация»
- Пункт `Галерея → gallery/` → `Наши работы → gallery/`.
- Добавить новые страницы в «не меню, но существуют»: `licenses/`, `documents/`, `doctors/`, `assistants/`, `prices/`.

### ✏️ T6.2 — Обновить секцию «Footer (новая структура)»
Заменить текущее описание на новое:

```
### Footer

.footer__top — логотип (logo_new.png) + кнопка CTA «Записаться» (flex, space-between)
.footer__middle — 5 колонок (desktop) / 1 колонка (mobile):
  1. Наши услуги — 9 ссылок (dropdown-пункты меню «Услуги»), на mobile — аккордеон
  2. Компания — О нас, Лицензии, Отзывы (некликабельно), Документы, Пользовательское соглашение (desktop-only)
  3. Специалисты — Врачи, Ассистенты
  4. Столбик — Наши работы, Цены, Акции, Контакты, Версия для слабовидящих (desktop-only)
  5. Как с нами связаться — телефон, адрес (с картами), часы, иконки VK + MAX
.footer__legal-mobile (≤768px) — ©, Пользовательское соглашение, Разработка сайта, Версия для слабовидящих
.footer__bottom (>768px) — © ООО «Эстетик Смайл» (слева) + by urbanstudio (справа), разделены линией

Иконки соцсетей: vk_bw.png → hover #0077FF; max_bw.png → hover градиент #471AFF→#9500FF.
```

### ✏️ T6.3 — Обновить структуру файлов
- Добавить в дерево: `licenses/index.html`, `documents/index.html`, `doctors/index.html`, `assistants/index.html`, `prices/index.html`.
- Добавить `images/logo_new.png`.
- Обновить описание `contacts.css`: `/* Contacts + Footer */`.

### ✏️ T6.4 — Обновить секцию «Footer — колонка «Наши услуги»»
Заменить 4 ссылки на 9 ссылок из dropdown-меню «Услуги».

### ✏️ T6.5 — Обновить секцию «Footer — top-nav»
Удалить (больше не существует).

**Редактировать**: `.cursor/rules/stack.mdc`.

---

## Порядок выполнения

1. **T0** — создать 5 placeholder-страниц (нужны для ссылок из footer)
2. **T1** — переименовать «Галерея» → «Наши работы» в меню (14 файлов)
3. **T2** — новый footer HTML на `index.html` (главная)
4. **T3** — новый footer CSS в `contacts.css`
5. **T4** — JS: аккордеон footer + карты
6. **T5** — синхронизировать footer на всех 8 существующих inner-страницах
7. **T6** — обновить `stack.mdc`
