# TASKS_menu_all — Мобильное меню на всех страницах

**Цель:** привести мобильное боковое меню всех 13 внутренних страниц к эталону главной страницы.

---

## Что меняется (на каждой из 13 внутренних страниц)

| # | Действие | Где |
|---|----------|-----|
| A | Заменить `<img>` в `.nav__logo` на текстовый span | `<nav class="header__nav">` |
| B | Вставить блок `.nav__mobile` | после `</ul>` (конец `.header__menu`), до `.nav__cta` |
| C | Добавить `#maps-dropdown` + `#maps-overlay` | в футере, сразу после `</div>` кнопки `#footer-address-card` |
| D | Добавить `<script defer src="../js/maps.js">` | в конец списка скриптов, перед `main.js` |

Изменения в CSS и JS не требуются:
- `header.css` — стили `.nav__mobile` уже есть
- `accordion.js` → `initFooterAccordion()` ищет `[data-footer-accordion]` глобально
- `header.js` — burger/close/overlay уже работают корректно

---

## Страницы (13 файлов)

```
about/index.html
assistants/index.html
contacts/index.html
doctors/index.html
documents/index.html
gallery/index.html
licenses/index.html
ortopediy/index.html
prevention/index.html
prices/index.html
promo/index.html
surgery/index.html
therapy/index.html
```

---

## Шаги реализации

### Шаг 1 — Подготовка (чтение эталонов, без правок)

Прочитать для понимания шаблонов:
- `index.html` строки 87–273 — эталонный `<nav>` с `.nav__mobile`
- `index.html` строки 888–902 — эталонный `#maps-dropdown`
- `index.html` строка 1080 — эталонный `#maps-overlay`
- `about/index.html` строки 36–128 — текущая структура `<nav>` внутренней страницы

---

### Шаг 2 — Изменение A: замена логотипа в `.nav__logo` (все 13 страниц)

**Что заменить** (в каждом файле):
```html
<!-- БЫЛО -->
<a class="nav__logo" href="../" aria-label="Estetic Smile — на главную">
  <img src="../images/logo.png" alt="Логотип Estetic Smile" width="48" height="48">
</a>

<!-- СТАЛО -->
<a class="nav__logo" href="../" aria-label="Estetic Smile — на главную">
  <span class="nav__logo-text">Estetic Smile</span>
</a>
```

---

### Шаг 3 — Изменение B: вставка `.nav__mobile` (все 13 страниц)

Вставить блок **между** `</ul>` (конец `.header__menu`) и `<a class="nav__cta ...">`.

Шаблон блока для внутренних страниц (пути с `../`):

```html
<div class="nav__mobile">
  <ul class="nav__mobile-list">
    <li class="nav__group" data-footer-accordion>
      <button class="nav__group-toggle" type="button" data-footer-accordion-toggle>
        Наши услуги
        <span class="nav__group-arrow" aria-hidden="true"></span>
      </button>
      <ul class="nav__group-body" data-footer-accordion-body>
        <li><a href="../therapy/">Лечение кариеса</a></li>
        <li><a href="../therapy/">Лечение пульпита</a></li>
        <li><a href="../therapy/">Лечение периодонтита</a></li>
        <li><a href="../surgery/">Удаление зуба</a></li>
        <li><a href="../surgery/">Имплантация</a></li>
        <li><a href="../ortopediy/">Протезирование</a></li>
        <li><a href="../ortopediy/">Виниры</a></li>
        <li><a href="../prevention/">Отбеливание</a></li>
        <li><a href="../prevention/">Гигиена</a></li>
      </ul>
    </li>

    <li class="nav__group" data-footer-accordion>
      <button class="nav__group-toggle" type="button" data-footer-accordion-toggle>
        Компания
        <span class="nav__group-arrow" aria-hidden="true"></span>
      </button>
      <ul class="nav__group-body" data-footer-accordion-body>
        <li><a href="../about/">О нас</a></li>
        <li><a href="../licenses/">Лицензии</a></li>
        <li><span class="nav__group-inactive">Отзывы</span></li>
        <li><a href="../documents/">Документы</a></li>
      </ul>
    </li>

    <li class="nav__group" data-footer-accordion>
      <button class="nav__group-toggle" type="button" data-footer-accordion-toggle>
        Специалисты
        <span class="nav__group-arrow" aria-hidden="true"></span>
      </button>
      <ul class="nav__group-body" data-footer-accordion-body>
        <li><a href="../doctors/">Врачи</a></li>
        <li><a href="../assistants/">Ассистенты</a></li>
      </ul>
    </li>

    <li class="nav__mobile-item"><a href="../gallery/">Наши работы</a></li>
    <li class="nav__mobile-item"><a href="../prices/">Цены</a></li>
    <li class="nav__mobile-item"><a href="../promo/">Акции</a></li>
    <li class="nav__mobile-item"><a href="../contacts/">Контакты</a></li>
  </ul>

  <div class="nav__divider" aria-hidden="true"></div>

  <div class="nav__contact">
    <h3 class="nav__contact-title">Как с нами связаться</h3>
    <div class="footer__contact-items">
      <a href="tel:+79234921444" class="footer__contact-item">
        <span class="footer__contact-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6.6 10.8a14.7 14.7 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.7c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
        </span>
        <span>+7 (923) 492-14-44</span>
      </a>
      <button class="footer__contact-item footer__contact-item--address" id="nav-address-card" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="maps-dropdown">
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
        <div>
          <span>Пн-Сб — 09:30 - 19:00</span><br>
          <span>Вс — выходной</span>
        </div>
      </div>
    </div>
    <div class="footer__social-icons">
      <a class="footer__social-icon footer__social-icon--vk" href="#" aria-label="ВКонтакте">
        <img class="footer__social-icon__img footer__social-icon__img--default" src="../images/icons/vk_bw.png" alt="" loading="lazy">
        <img class="footer__social-icon__img footer__social-icon__img--hover" src="../images/icons/vk_color.png" alt="" loading="lazy" aria-hidden="true">
      </a>
      <a class="footer__social-icon footer__social-icon--max" href="#" aria-label="MAX">
        <img class="footer__social-icon__img footer__social-icon__img--default" src="../images/icons/max_bw.png" alt="" loading="lazy">
        <img class="footer__social-icon__img footer__social-icon__img--hover" src="../images/icons/max_color.png" alt="" loading="lazy" aria-hidden="true">
      </a>
    </div>
  </div>
</div>
```

> **aria-current:** на каждой странице добавить `aria-current="page"` на ссылку текущей страницы внутри `.nav__mobile-item` или внутри `.nav__group-body`. Например, на `about/index.html` → `<a href="../about/" aria-current="page">О нас</a>`.

---

### Шаг 4 — Изменение C: добавить `#maps-dropdown` и `#maps-overlay` (все 13 страниц)

Вставить сразу перед `</footer>`:

```html
<div id="maps-dropdown" class="maps-dropdown" role="listbox"
     aria-label="Выберите карту" hidden>
  <button class="maps-dropdown__item" data-app="yandexmaps://maps.yandex.ru/?text=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0+%D1%83%D0%BB+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0+10" data-web="https://yandex.ru/maps/?text=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0%2C+%D1%83%D0%BB.+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0%2C+10" type="button" role="option">
    <img src="../images/maps/yandex.png" width="32" height="32" alt="" aria-hidden="true" loading="lazy">
    Яндекс Карты
  </button>
  <button class="maps-dropdown__item" data-app="dgis://2gis.ru/search?query=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0+10" data-web="https://2gis.ru/search/%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0%2C+%D1%83%D0%BB.+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0%2C+10" type="button" role="option">
    <img src="../images/maps/2gis.png" width="32" height="32" alt="" aria-hidden="true" loading="lazy">
    2GIS
  </button>
  <button class="maps-dropdown__item" data-app="geo:55.939,85.604?q=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0+10" data-web="https://maps.google.com/?q=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0%2C+%D1%83%D0%BB.+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0%2C+10" type="button" role="option">
    <img src="../images/maps/google.png" width="32" height="32" alt="" aria-hidden="true" loading="lazy">
    Google Maps
  </button>
</div>
```

И отдельно перед `</body>`:

```html
<div id="maps-overlay" class="maps-overlay" aria-hidden="true"></div>
```

> **Примечание:** `maps.js` при инициализации перемещает `#maps-dropdown` и `#maps-overlay` через `document.body.appendChild()`, поэтому место вставки в HTML некритично. На главной `#maps-dropdown` находится в секции `#contacts` — на внутренних страницах можно поместить перед `</footer>` для порядка.

---

### Шаг 5 — Изменение D: подключить `maps.js` (все 13 страниц)

В конец списка `<script>`, **перед** `<script defer src="../js/main.js">`:

```html
<script defer src="../js/maps.js"></script>
```

---

## Итого по файлам

| Файл | Читать | Редактировать |
|------|--------|---------------|
| `index.html` | строки 87–273, 888–902, 1080 | нет |
| `about/index.html` | строки 36–128, конец файла | ШАГ 2–5 |
| `assistants/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `contacts/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `doctors/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `documents/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `gallery/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `licenses/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `ortopediy/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `prevention/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `prices/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `promo/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `surgery/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `therapy/index.html` | строки 36–130, конец файла | ШАГ 2–5 |
| `css/sections/header.css` | нет правок | нет |
| `js/header.js` | нет правок | нет |
| `js/accordion.js` | нет правок | нет |
| `js/maps.js` | нет правок | нет |
