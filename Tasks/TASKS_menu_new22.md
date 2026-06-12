# TASKS_menu_new22 — Перенос мега-меню на все внутренние страницы

## Контекст

Меню главной страницы (`index.html`) — эталон.  
Все 13 внутренних страниц содержат устаревший вариант: простой `<ul class="header__dropdown">` и кнопку «Услуги» вместо мега-дропдауна.

**JS и CSS правок не требуют** — `header.js` уже поддерживает мега-дропдаун; стили для `.header__dropdown--mega` на `.site-header` (top: 92px) уже прописаны в `css/sections/header.css` строки 181–370.

---

## Файлы для чтения (только справка)

| Файл | Что читать |
|---|---|
| `index.html` | строки 95–223 — эталонный `<header>` целиком |
| `css/sections/header.css` | строки 181–370 — стили мега-дропдауна (убедиться, что CSS покрывает `.site-header` без `--home`) |

## Файлы для редактирования

Все 13 внутренних страниц (структура заголовка идентична во всех):

```
about/index.html
contacts/index.html
therapy/index.html
ortopediy/index.html
surgery/index.html
prevention/index.html
promo/index.html
gallery/index.html
prices/index.html
licenses/index.html
documents/index.html
doctors/index.html
assistants/index.html
```

---

## Шаги (одинаковы для каждой страницы)

### Шаг 1 — Добавить шрифт Patefon в `<head>`

После строки `<link rel="icon" ...>` добавить:

```html
<link rel="preload" href="../fonts/Patefon-Light.woff2" as="font" type="font/woff2" crossorigin>
```

После блока `<link rel="stylesheet" ...>` добавить:

```html
<style>
  @font-face {
    font-family: "Patefon Light";
    src: url("../fonts/Patefon-Light.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
</style>
```

---

### Шаг 2 — Обновить логотип

Найти (в каждой странице):
```html
<a class="header__logo" href="../" aria-label="Estetic Smile — на главную">
  <img src="../images/logo.png" alt="Логотип Estetic Smile" width="250" height="80">
</a>
```

Заменить на:
```html
<a class="header__logo" href="../" aria-label="Estetic Smile — на главную">
  Estetic Smile
</a>
```

---

### Шаг 3 — Заменить дропдаун на мега-дропдаун

Найти и удалить весь блок (кнопка + старый dropdown):
```html
<li class="header__menu-item header__menu-item--dropdown">
  <button class="header__dropdown-toggle" ...>
    Услуги
    <span aria-hidden="true"></span>
  </button>
  <ul class="header__dropdown" aria-label="Услуги клиники">
    ...9 li-пунктов...
  </ul>
</li>
```

Вставить мега-дропдаун (адаптированный для внутренних страниц — пути `../therapy/`, `../ortopediy/` и т.д.):

```html
<li class="header__menu-item header__menu-item--dropdown">
  <button class="header__dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">
    Наши услуги
    <span aria-hidden="true"></span>
  </button>
  <div class="header__dropdown header__dropdown--mega" aria-label="Услуги клиники">
    <div class="mega__grid">

      <a href="../therapy/" class="mega__card" style="background-image: url('../images/menu/block_1.jpg')">
        <div class="mega__card-curtain">
          <h3 class="mega__card-title">Терапевтическое лечение</h3>
          <div class="mega__card-desc">
            <ul class="mega__card-list">
              <li>Лечение кариеса</li>
              <li>Лечение пульпита</li>
              <li>Лечение периодонтита</li>
            </ul>
            <p class="mega__card-tagline">Сохраняем здоровье зубов без боли</p>
          </div>
        </div>
      </a>

      <a href="../ortopediy/" class="mega__card" style="background-image: url('../images/menu/block_2.jpg')">
        <div class="mega__card-curtain">
          <h3 class="mega__card-title">Ортопедическое лечение</h3>
          <div class="mega__card-desc">
            <ul class="mega__card-list">
              <li>Установление виниров</li>
              <li>Протезирование</li>
            </ul>
            <p class="mega__card-tagline">Восстанавливаем форму и функцию зубов</p>
          </div>
        </div>
      </a>

      <a href="../surgery/" class="mega__card" style="background-image: url('../images/menu/block_3.jpg')">
        <div class="mega__card-curtain">
          <h3 class="mega__card-title">Хирургическое лечение</h3>
          <div class="mega__card-desc">
            <ul class="mega__card-list">
              <li>Удаление зуба</li>
              <li>Имплантация</li>
            </ul>
            <p class="mega__card-tagline">Удаление зубов любой сложности и имплантация с точным планированием</p>
          </div>
        </div>
      </a>

      <a href="../prevention/" class="mega__card" style="background-image: url('../images/menu/block_4.jpg')">
        <div class="mega__card-curtain">
          <h3 class="mega__card-title">Профилактическое лечение</h3>
          <div class="mega__card-desc">
            <ul class="mega__card-list">
              <li>Профессиональная гигиена</li>
              <li>Отбеливание</li>
              <li>Профилактические осмотры</li>
            </ul>
          </div>
        </div>
      </a>

      <div class="mega__consult">
        <h3 class="mega__consult-title">Не знаете с чего начать?<br>Начните с консультации</h3>
        <p class="mega__consult-text">
          Позвоните по номеру <a href="tel:+79234921444">+7 (923) 492-14-44</a> или оставьте заявку — мы подберём удобное время для визита.
        </p>
        <a class="mega__consult-btn btn btn-dark" href="#" data-open-booking>Оставить заявку</a>
      </div>

    </div>
  </div>
</li>
```

---

### Шаг 4 — Добавить SVG-иконку в кнопку `nav__cta`

Найти:
```html
<a class="nav__cta btn btn-primary" href="#" data-open-booking>Записаться</a>
```

Заменить на:
```html
<a class="nav__cta btn btn-primary" href="#" data-open-booking>
  Записаться
  <svg class="btn-tablet-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect class="btn-tablet-icon__case" x="5" y="3" width="14" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <rect class="btn-tablet-icon__bar btn-tablet-icon__bar--1" x="8" y="8" width="8" height="1.6" rx="0.8" fill="currentColor"/>
    <rect class="btn-tablet-icon__bar btn-tablet-icon__bar--2" x="8" y="11.2" width="8" height="1.6" rx="0.8" fill="currentColor"/>
    <rect class="btn-tablet-icon__bar btn-tablet-icon__bar--3" x="8" y="14.4" width="6" height="1.6" rx="0.8" fill="currentColor"/>
  </svg>
</a>
```

---

### Шаг 5 — Добавить соцсети и SVG-иконку в `header__actions`

Найти:
```html
<div class="header__actions">
  <a class="btn btn-primary header__cta" href="#" data-open-booking>Записаться</a>
</div>
```

Заменить на:
```html
<div class="header__actions">
  <div class="header__socials" aria-label="Социальные сети">
    <a class="header__social-link header__social-link--vk" href="#" target="_blank" rel="noopener" aria-label="ВКонтакте">
      <img src="../images/icons/vk_bw.png" alt="" class="social-icon social-icon--default" width="20" height="20">
      <img src="../images/icons/vk_color.png" alt="" class="social-icon social-icon--hover" width="20" height="20">
    </a>
    <a class="header__social-link header__social-link--max" href="#" target="_blank" rel="noopener" aria-label="MAX">
      <img src="../images/icons/max_bw.png" alt="" class="social-icon social-icon--default" width="20" height="20">
      <img src="../images/icons/max_color.png" alt="" class="social-icon social-icon--hover" width="20" height="20">
    </a>
  </div>
  <a class="btn btn-primary header__cta" href="#" data-open-booking>
    Записаться
    <svg class="btn-tablet-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect class="btn-tablet-icon__case" x="5" y="3" width="14" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <rect class="btn-tablet-icon__bar btn-tablet-icon__bar--1" x="8" y="8" width="8" height="1.6" rx="0.8" fill="currentColor"/>
      <rect class="btn-tablet-icon__bar btn-tablet-icon__bar--2" x="8" y="11.2" width="8" height="1.6" rx="0.8" fill="currentColor"/>
      <rect class="btn-tablet-icon__bar btn-tablet-icon__bar--3" x="8" y="14.4" width="6" height="1.6" rx="0.8" fill="currentColor"/>
    </svg>
  </a>
</div>
```

---

### Шаг 6 — Убрать `.container` из `header__container`

Найти:
```html
<div class="container header__container">
```

Заменить на:
```html
<div class="header__container">
```

> Причина: главная страница не использует `.container` внутри хедера; `.container` добавляет лишние `max-width`/`margin` поверх уже корректно настроенного `.header__container`.

---

### Шаг 7 — Выставить `aria-current="page"` на нужном пункте меню

В каждой странице в новом блоке меню проставить `aria-current="page"` на соответствующей ссылке:

| Страница | Ссылка с `aria-current` |
|---|---|
| `about/` | `<a href="../about/" aria-current="page">О нас</a>` |
| `contacts/` | `<a href="../contacts/" aria-current="page">Контакты</a>` |
| `gallery/` | `<a href="../gallery/" aria-current="page">Наши работы</a>` |
| `promo/` | `<a href="../promo/" aria-current="page">Акции</a>` |
| `therapy/`, `ortopediy/`, `surgery/`, `prevention/` | `aria-expanded="true"` на `.header__dropdown-toggle` (активна категория) |
| `prices/`, `licenses/`, `documents/`, `doctors/`, `assistants/` | нет активного пункта (нет в основном меню) |

---

## Порядок обработки страниц

Рекомендуется в таком порядке (от простых к сложным, где сложность = длина файла):

1. `prices/` → `licenses/` → `documents/` → `doctors/` → `assistants/` → `gallery/` (короткие заглушки)
2. `promo/` → `about/` → `contacts/`
3. `therapy/` → `ortopediy/` → `surgery/` → `prevention/`

---

## Что не трогаем

- `class="site-header"` на внутренних страницах — не добавлять `site-header--home` (разные размеры и фоны хедера намеренны)
- `css/sections/header.css` — CSS уже покрывает оба варианта хедера
- `js/header.js` — JS уже поддерживает мега-дропдаун
- Лоадер (`loader.css`, `#page-loader`) — не переносить; это отдельная функциональность главной страницы
