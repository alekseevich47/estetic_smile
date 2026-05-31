# TASKS_create6 — Кликабельная карточка «Адрес» с выбором карты

## Цель
Карточка «Адрес» в секции `#contacts` становится кликабельной кнопкой.
При клике появляется выпадающий список из трёх вариантов карт (с логотипами):
- Яндекс Карты
- 2GIS
- Google Maps

При выборе — сначала пробуем открыть приложение через deep link, при неудаче — открываем веб-версию.

---

## Файлы для чтения

| Файл | Что читать |
|---|---|
| `index.html` | строки 1008–1018 (карточка «Адрес») + строки 1124–1132 (подключение скриптов) |
| `css/layout.css` | строки 1949–2000 (стили `.contact-card`) |

## Файлы для редактирования

| Файл | Изменения |
|---|---|
| `index.html` | 1. Переделать карточку «Адрес» в `<button>`. 2. Добавить hint-текст. 3. Добавить разметку dropdown. 4. Подключить `js/maps.js`. |
| `css/layout.css` | Добавить стили для кнопки-карточки и dropdown в конец секции `.contact-card`. |
| `js/maps.js` | Создать новый файл — вся логика переключения и открытия карт. |

---

## Шаг 1 — `index.html`: карточка «Адрес»

Заменить `<article class="contact-card">` (адрес, строки 1008–1018) на `<button>`:

```html
<button class="contact-card contact-card--address" id="address-card"
        type="button" aria-haspopup="listbox" aria-expanded="false"
        aria-controls="maps-dropdown">
  <!-- иконка геометки — без изменений -->
  <div>
    <h3>Адрес</h3>
    <p>г. Тайга, ул. Лермонтова, 10</p>
    <span class="contact-card__hint">Нажмите, чтобы открыть на карте</span>
  </div>
</button>
```

Сразу после этого `</button>` (но до следующего `<article>`) добавить разметку dropdown:

```html
<div id="maps-dropdown" class="maps-dropdown" role="listbox"
     aria-label="Выберите карту" hidden>
  <button class="maps-dropdown__item" data-app="yandexmaps://maps.yandex.ru/?text=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0+%D1%83%D0%BB+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0+10" data-web="https://yandex.ru/maps/?text=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0%2C+%D1%83%D0%BB.+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0%2C+10" type="button" role="option">
    <!-- SVG логотип Яндекс Карт -->
    Яндекс Карты
  </button>
  <button class="maps-dropdown__item" data-app="dgis://2gis.ru/search?query=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0+10" data-web="https://2gis.ru/search/%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0%2C+%D1%83%D0%BB.+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0%2C+10" type="button" role="option">
    <!-- SVG логотип 2GIS -->
    2GIS
  </button>
  <button class="maps-dropdown__item" data-app="geo:55.939,85.604?q=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0+10" data-web="https://maps.google.com/?q=%D0%A2%D0%B0%D0%B9%D0%B3%D0%B0%2C+%D1%83%D0%BB.+%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0%2C+10" type="button" role="option">
    <!-- SVG логотип Google Maps -->
    Google Maps
  </button>
</div>
```

> **Логотипы:** inline SVG (≈200–400 байт каждый), вставить прямо в разметку — без внешних запросов.
> Координаты Тайги для `geo:` — уточнить или взять из Яндекс iframe в секции `#contacts`.

В конец `<body>`, после `js/main.js`, добавить:
```html
<script defer src="js/maps.js"></script>
```

---

## Шаг 2 — `css/layout.css`: стили

Добавить в конец блока `.contact-card` (после строки 2000):

```css
/* === Maps dropdown === */

/* Кнопка-карточка: сброс дефолтных стилей button */
button.contact-card {
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  background: rgba(255, 255, 255, 0.08); /* уже задано, дублируем явно */
}

.contact-card--address[aria-expanded="true"] {
  border-color: rgba(74, 127, 193, 0.55);
  background: rgba(255, 255, 255, 0.14);
}

.contact-card__hint {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  font-style: italic;
}

/* Dropdown */
.maps-dropdown {
  position: absolute;
  z-index: 200;
  min-width: 220px;
  background: #1e2a3a;
  border: 1px solid rgba(74, 127, 193, 0.35);
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  /* Анимация */
  opacity: 0;
  transform: translateY(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

.maps-dropdown:not([hidden]) {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.maps-dropdown__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: background var(--transition), color var(--transition);
}

.maps-dropdown__item:hover,
.maps-dropdown__item:focus-visible {
  background: rgba(74, 127, 193, 0.22);
  color: #fff;
  outline: none;
}

.maps-dropdown__item svg {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
}

/* Мобильные: dropdown занимает всю ширину */
@media (max-width: 600px) {
  .maps-dropdown {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 20px 20px 0 0;
    min-width: unset;
    padding: 16px;
    gap: 8px;
    transform: translateY(10px);
  }

  .maps-dropdown:not([hidden]) {
    transform: translateY(0);
  }
}
```

> Родительский контейнер `.contacts__list` (или `.contacts__content`) должен иметь `position: relative` — проверить в коде и добавить при необходимости.

---

## Шаг 3 — `js/maps.js`: логика (новый файл)

```
1. Найти #address-card и #maps-dropdown.
2. По клику на #address-card:
   - Если dropdown скрыт → показать (убрать hidden, aria-expanded="true"),
     позиционировать под карточкой (getBoundingClientRect + scroll).
   - Если открыт → скрыть.
3. Закрыть dropdown при:
   - клике вне card и dropdown (document click, проверка contains())
   - нажатии Escape
4. Для каждой кнопки .maps-dropdown__item:
   - Создать временный <a> с href = data-app, click() → setTimeout(800ms) →
     если страница не ушла (document.hasFocus()) → window.open(data-web, '_blank').
5. После выбора любого варианта — скрыть dropdown.
6. На мобильных (window.innerWidth ≤ 600) позиционирование — fixed bottom sheet
   (стили уже определены через CSS media query, JS не нужен).
```

---

## Итоговая схема изменений

```
index.html     → заменить <article> на <button>, добавить dropdown и hint, подключить скрипт
css/layout.css → добавить ~60 строк стилей после .contact-card a:focus-visible {}
js/maps.js     → создать новый файл (~50 строк)
```
