# TASKS_super — Реструктуризация главной и внутренних страниц

## Легенда

| Метка | Значение |
|---|---|
| ✂️ | Удаление |
| ✏️ | Изменение существующего |
| ➕ | Создание нового |
| 📖 | Прочитать перед работой |

---

## 0. Подготовка: новый JS-модуль `modal.js`

### ➕ T0.1 — Создать `js/modal.js`
Модальное окно с формой записи (перенести HTML-форму из `#booking-form` в разметку модалки, которая монтируется в `index.html` и всех pages).

- Экспортирует `initModal()` → навешивает обработчики на все кнопки «Записаться» (по `[data-open-booking]`) и кнопку закрытия.
- Открытие: `showModal()` — добавляет `body.modal-open`, `overflow: hidden`.
- Закрытие: `hideModal()` — по крестику, по клику на оверлей, по Escape.
- **Важно**: `initForm()` уже ищет `[data-booking-form]` — он должен найти форму внутри модалки, поэтому вызов `initForm()` должен быть ПОСЛЕ добавления модалки в DOM.
- Анимация: `opacity` + `transform` (как у lightbox/gallery).
- **Читать**: `js/form.js` (форма), `js/gallery.js` (lightbox-паттерн для модалки).

### ➕ T0.2 — Добавить CSS для модалки
Создать `css/sections/modal.css`:
- `.modal-overlay` — `position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s`.
- `.modal-overlay.is-open` — `opacity: 1; pointer-events: auto`.
- `.modal` — `background: #fff; border-radius: 26px; max-width: 560px; width: 90%; max-height: 90vh; overflow-y: auto; padding: 40px 32px; position: relative; transform: translateY(20px); transition: transform 0.3s`.
- `.modal-overlay.is-open .modal` — `transform: translateY(0)`.
- `.modal__close` — кнопка × в правом верхнем углу.
- Стили формы внутри модалки адаптировать из `booking.css` (убрать тёмный фон, сделать светлый).
- **Читать**: `css/sections/booking.css` (стили формы), `css/sections/gallery.css` (`.lightbox` для анимации).

### ✏️ T0.3 — Подключить modal.css и modal.js
- В `css/layout.css`: добавить `@import "sections/modal.css";`.
- В `js/main.js`: добавить вызов `initModal()` (перед `initForm()`).
- В `index.html` и всех `pages/*.html`: добавить `<script defer src="js/modal.js">`.
- **Редактировать**: `css/layout.css`, `js/main.js`, `index.html`, все `pages/*.html`.

---

## 1. Убираем `cta-1`

### ✂️ T1.1 — index.html
Удалить `<section id="cta-1" ...>` целиком (строки 507–522).
**Редактировать**: `index.html`.

### ✏️ T1.2 — stack.mdc
Убрать `cta-1 → #2C2C2C (dark)` из чередования фонов.
**Редактировать**: `.cursor/rules/stack.mdc`.

---

## 2. Секция `promo`

### ✂️ T2.1 — Убрать `promo__media`
Удалить `<div class="promo__media" ...>` из `#promo` (строки 549–560).
**Редактировать**: `index.html`.

### ✏️ T2.2 — Кнопка «Записаться по акции» → модалка
Заменить `href="#booking-form"` на `data-open-booking` (или `href="#"` с `data-open-booking`), чтобы открывать модальное окно.
**Редактировать**: `index.html`.

### ✏️ T2.3 — Кнопка «Другие акции» → `/promo`
Заменить `href="pages/services.html"` на `href="promo/"`.
**Редактировать**: `index.html`.

### ✏️ T2.4 — Обновить CSS promo (учесть отсутствие media)
После удаления `promo__media`, контент должен центрироваться (одна колонка). Адаптировать `promo.css`: убрать `grid-template-columns`, сделать контент по центру.
**Редактировать**: `css/sections/promo.css`.

---

## 3. Секция `booking-form` → модальное окно

### ✂️ T3.1 — Удалить `#booking-form` из index.html
Удалить ВЕСЬ `<section id="booking-form" ...>` (строки 638–703). Саму форму (`<form class="booking-form">`) перенести в разметку модального окна (см. шаг T0.1).
**Редактировать**: `index.html`, `js/modal.js`.

### ✂️ T3.2 — Удалить `booking__media`
Не переносить `booking__media` в модалку — просто удалить.
**Редактировать**: `index.html`.

### ✏️ T3.3 — Все кнопки «Записаться» → открывают модалку
Заменить ВСЕ ссылки `href="#booking-form"` на `href="#"` с атрибутом `data-open-booking`:
- В hero (строка 168)
- В header desktop CTA (строка 140)
- В header mobile nav CTA (строка 116)
- В footer CTA (строка 1119)
- На всех pages (about.html, gallery.html, contacts.html, services.html — везде, где есть `href` на `#booking-form`)
**Редактировать**: `index.html`, `pages/about.html`, `pages/gallery.html`, `pages/contacts.html`, `pages/services.html`.

### ✏️ T3.4 — Обновить CSS booking
Стили формы в модалке должны быть на светлом фоне (`#fff`). Перенести релевантные стили из `booking.css` в `modal.css`, адаптировав цвета (тёмный текст, светлый фон полей). `booking.css` можно оставить пустым или закомментировать (но не удалять — может пригодиться).
**Редактировать**: `css/sections/modal.css`, `css/sections/booking.css`.

### ✏️ T3.5 — Обновить stack.mdc
Убрать `booking → #2C2C2C` из чередования фонов. Убрать `booking.css` из структуры (или отметить как deprecated).
**Редактировать**: `.cursor/rules/stack.mdc`.

---

## 4. Секция `steps`

### ✂️ T4.1 — Удалить из index.html
Удалить `<section id="steps" ...>` (строки 704–768).
**Редактировать**: `index.html`.

### ➕ T4.2 — Сохранить в отдельный файл
Создать `pages/steps.html` — автономная страница с header, footer и полной секцией steps. **Не подключать в меню** (просто архивный файл).
**Создать**: `pages/steps.html`.

### ✏️ T4.3 — Обновить layout.css и stack.mdc
- В `css/layout.css`: закомментировать `@import "sections/steps.css";` (не удалять).
- В `stack.mdc`: убрать `steps → #F5F5F5` из чередования.
**Редактировать**: `css/layout.css`, `.cursor/rules/stack.mdc`.

---

## 5. Убираем `cta-2`

### ✂️ T5.1 — Удалить из index.html
Удалить `<section id="cta-2" ...>` (строки 769–784).
**Редактировать**: `index.html`.

### ✏️ T5.2 — Обновить stack.mdc
Убрать `cta-2 → #2C2C2C` из чередования.
**Редактировать**: `.cursor/rules/stack.mdc`.

---

## 6. FAQ: первый item закрыт по умолчанию

### ✏️ T6.1 — Убрать `is-open` с первого faq__item
В `index.html`, первом `<article class="faq__item">` (строка 927):
- Убрать класс `is-open`.
- У `button.faq__question`: `aria-expanded="false"`.
- У `div.faq__answer`: `aria-hidden="true"`.
**Редактировать**: `index.html`.

---

## 7. Секция `services`: 4 карточки + отдельные страницы

### ✏️ T7.1 — Переписать services__grid в index.html
Заменить 6 карточек на 4:

```html
<!-- Карточка 1: переиспользуем caries.jpg -->
<article class="service-card">
  <div class="service-card__media">
    <img src="images/services/caries.jpg" alt="Терапевтическое лечение зубов" loading="lazy">
  </div>
  <div class="service-card__content">
    <h3>Терапевтическое лечение</h3>
    <p>Лечение кариеса, пульпита, периодонтита — сохраняем здоровье зубов без боли.</p>
    <a class="btn btn-primary" href="therapy/">Подробнее</a>
  </div>
</article>

<!-- Карточка 2: переиспользуем prosthetics.jpg -->
<article class="service-card">
  <div class="service-card__media">
    <img src="images/services/prosthetics.jpg" alt="Ортопедическое лечение зубов" loading="lazy">
  </div>
  <div class="service-card__content">
    <h3>Ортопедическое лечение</h3>
    <p>Протезирование, виниры, коронки — восстанавливаем форму и функцию зубов.</p>
    <a class="btn btn-primary" href="ortopediy/">Подробнее</a>
  </div>
</article>

<!-- Карточка 3: переиспользуем implant.jpg -->
<article class="service-card">
  <div class="service-card__media">
    <img src="images/services/implant.jpg" alt="Хирургическое лечение зубов" loading="lazy">
  </div>
  <div class="service-card__content">
    <h3>Хирургическое лечение</h3>
    <p>Удаление зубов любой сложности и имплантация с точным планированием.</p>
    <a class="btn btn-primary" href="surgery/">Подробнее</a>
  </div>
</article>

<!-- Карточка 4: переиспользуем whitening.jpg -->
<article class="service-card">
  <div class="service-card__media">
    <img src="images/services/whitening.jpg" alt="Профилактическое лечение зубов" loading="lazy">
  </div>
  <div class="service-card__content">
    <h3>Профилактическое лечение</h3>
    <p>Профессиональная гигиена, отбеливание и профилактические осмотры.</p>
    <a class="btn btn-primary" href="prevention/">Подробнее</a>
  </div>
</article>
```

- **Редактировать**: `index.html`.

### ➕ T7.2 — Создать `therapy/index.html`
- Hero: «Терапевтическое лечение — здоровье ваших зубов»
- Текст: описание лечения кариеса, пульпита, периодонтита (методы, анестезия, гарантия).
- CTA-полоса: «Записаться на консультацию» (кнопка с `data-open-booking`).
- Структура: `inner-hero` + `page-section` + `page-cta`, как в `about.html`.
- Все ресурсные пути (CSS, JS, изображения) используют `../` (т.к. файл на уровень глубже).
- Header + footer — скопировать с `pages/about.html` (адаптировать пути).
- **Создать**: `therapy/index.html`.

### ➕ T7.3 — Создать `ortopediy/index.html`
- Hero: «Ортопедическое лечение — восстановление зубного ряда»
- Текст: протезирование, виниры, коронки, мосты.
- CTA-полоса с кнопкой записи.
- Все пути — `../`.
- **Создать**: `ortopediy/index.html`.

### ➕ T7.4 — Создать `surgery/index.html`
- Hero: «Хирургическое лечение — удаление и имплантация»
- Текст: удаление зубов, имплантация, костная пластика.
- CTA-полоса с кнопкой записи.
- Все пути — `../`.
- **Создать**: `surgery/index.html`.

### ➕ T7.5 — Создать `prevention/index.html`
- Hero: «Профилактика — сохраните здоровье надолго»
- Текст: гигиена, отбеливание, профилактические осмотры.
- CTA-полоса с кнопкой записи.
- Все пути — `../`.
- **Создать**: `prevention/index.html`.

### ✏️ T7.6 — Обновить stack.mdc
- Услуг: 4 категории (терапия, ортопедия, хирургия, профилактика).
- Файлы страниц: `therapy/index.html`, `ortopediy/index.html`, `surgery/index.html`, `prevention/index.html`.
- Убрать `pages/services.html`.
- **Редактировать**: `.cursor/rules/stack.mdc`.

---

## 8. Marquee-strip: убрать смайлы

### ✏️ T8.1 — Удалить SVG-иконки из marquee-item
В каждом `.marquee-item` (бегущая строка в index.html, строки 191–372):
- Удалить `<svg class="marquee-item__icon smiley" ...>` целиком.
- Оставить только `<span class="marquee-item__text">...</span>`.

**Важно**: удалить ВСЕ экземпляры (4 уникальных + дубликаты), всего 16 блоков. Текст оставить:
- «Без боли и страха — вы расслабитесь»
- «Результат за 1 визит — красивая улыбка»
- «Команда с душой — заботимся о каждом»
- «Комфорт на каждом шаге лечения»
**Редактировать**: `index.html`.

---

## 9. Меню «О нас» → `/about`

### ✏️ T9.1 — Обновить ссылку в меню index.html
В `index.html`, в `<ul class="header__menu">`: заменить `href="#about"` на `href="about/"`.
В `footer__top-nav`: заменить `href="#about"` на `href="about/"`.
**Редактировать**: `index.html`.

### ✏️ T9.2 — Обновить `about/index.html`
- Страница уже существует как `pages/about.html` — **перенести** в `about/index.html`.
- Адаптировать все пути ресурсов с `../` на `../` (фактически пути не меняются, т.к. оба на один уровень от корня).
- В header меню: `aria-current="page"` на «О нас».
- Кнопка «Записаться» → `data-open-booking`.
- CTA-кнопка → `data-open-booking`.
- Телефон в футере — заменить на `+7 (923) 492-14-44`.
- Обновить пути в dropdown «Услуги» (см. T12.2).
- **Создать**: `about/index.html` (перенос из `pages/about.html`).

---

## 10. Меню «Акции» → `/promo`

### ✏️ T10.1 — Обновить ссылку в меню index.html
В `index.html`: заменить `href="#promo"` → `href="promo/"`.
Аналогично в футере (`footer__top-nav`).
**Редактировать**: `index.html`.

### ➕ T10.2 — Создать `promo/index.html`
- `inner-hero` (тёмный градиент): «Акции и специальные предложения Estetic Smile».
- Секция 1 (белый фон): акция из `#promo` на главной («–15% на идеальную улыбку»), карточка с текстом и кнопкой записи `data-open-booking`.
- Секция 2 (белый фон): «Пенсионерам скидка 10% на протезирование». Текст: «Для пациентов пенсионного возраста действует специальная цена на все виды протезирования. Восстановите комфорт жевания и эстетику улыбки на выгодных условиях. Акция действует постоянно при предъявлении пенсионного удостоверения.»
- `page-cta` с кнопкой записи.
- Все пути — `../`.
- **Создать**: `promo/index.html`.

---

## 11. Меню «Галерея» → `/gallery`

### ✏️ T11.1 — Обновить ссылку в меню index.html
В `index.html`: заменить `href="#gallery"` → `href="gallery/"`.
Аналогично в футере.
**Редактировать**: `index.html`.

### ✏️ T11.2 — Обновить `gallery/index.html`
- В header: `aria-current="page"` на «Галерея».
- Кнопка «Записаться» → `data-open-booking`.
- Контент: `inner-hero` («Галерея работ») + секция-заглушка с текстом «Фотографии наших работ появятся здесь в ближайшее время. Следите за обновлениями!».
- Убрать галерею-сетку и lightbox-разметку (фото временно отсутствуют).
- Все пути — `../`.
- **Редактировать**: `gallery/index.html`.

---

## 12. Редактируем dropdown «Услуги»

### ✏️ T12.1 — Обновить dropdown в index.html
Заменить пункты меню:

```html
<ul class="header__dropdown" aria-label="Услуги клиники">
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
```

**Редактировать**: `index.html`.

### ✏️ T12.2 — Обновить dropdown на ВСЕХ pages
В `pages/about.html`, `pages/gallery.html`, `pages/contacts.html`:
Заменить dropdown на новый список (как в T12.1). Учесть, что пути — `../` для файлов в pages/.
**Редактировать**: `pages/about.html`, `pages/gallery.html`, `pages/contacts.html`.

### ✏️ T12.3 — Обновить footer «Наши услуги»
В footer (на index.html и всех pages) заменить список услуг:

```html
<ul>
  <li><a href="therapy/">Терапевтическое лечение</a></li>
  <li><a href="ortopediy/">Ортопедическое лечение</a></li>
  <li><a href="surgery/">Хирургическое лечение</a></li>
  <li><a href="prevention/">Профилактическое лечение</a></li>
</ul>
```

**Редактировать**: `index.html`, `pages/about.html`, `pages/gallery.html`, `pages/contacts.html`.

### ✏️ T12.4 — Обновить footer__top-nav на всех страницах
Заменить: `#gallery` → `gallery/`, `#promo` → `promo/`, `#about` → `about/`, `#reviews` → `index.html#reviews`, `#contacts` → `contacts/`.
На страницах в pages/ (пока ещё не перенесённых) — префикс `../`.
**Редактировать**: `index.html`, все `pages/*.html`.

---

## 13. FAQ: убрать/добавить вопросы

### ✂️ T13.1 — Удалить вопрос про брекеты
Удалить `<article class="faq__item">` с вопросом «Как долго идет лечение брекетами?» (строки 975–985).
**Редактировать**: `index.html`.

### ✂️ T13.2 — Удалить вопрос про детский приём
Удалить `<article class="faq__item">` с вопросом «Есть ли детский прием?» (строки 999–1009).
**Редактировать**: `index.html`.

### ➕ T13.3 — Добавить вопрос про виниры
После вопроса про отбеливание (или в любое место) добавить:

```html
<article class="faq__item">
  <h3>
    <button class="faq__question" type="button" aria-expanded="false" aria-controls="faq-answer-veneers">
      <span>Как происходит процедура установки виниров?</span>
      <span class="faq__icon" aria-hidden="true"></span>
    </button>
  </h3>
  <div id="faq-answer-veneers" class="faq__answer" aria-hidden="true">
    <p>Сначала проводится диагностика и подбор цвета. Затем врач минимально подготавливает поверхность зуба, снимает слепки и фиксирует временные накладки. Через несколько дней готовые виниры фиксируются на постоянный цемент — процедура безболезненна и занимает 1–2 визита.</p>
  </div>
</article>
```

**Редактировать**: `index.html`.

### ✏️ T13.4 — Обновить ответ про отбеливание
В FAQ item «Делаете ли вы отбеливание за один визит?» (строка 996) убрать, если конфликтует по смыслу после изменений (уже есть в prevention). Оставить как есть.
**Ничего не делать** (пункт остаётся без изменений).

### ✏️ T13.5 — Обновить stack.mdc
FAQ: 7 вопросов (было 8: убрали брекеты и детский приём, добавили виниры).
**Редактировать**: `.cursor/rules/stack.mdc`.

---

## 14. Отзывы: модальное окно оставления отзыва (вариант A — otziv.txt)

### 📖 T14.0 — Прочитать прототип
Прочитать `otziv.txt` — прототип модалки на нативном `<dialog>`:
- 5 эмодзи-рейтинг (😢 → 😁) через скрытые radio
- textarea для текста отзыва
- Кнопка отправки с анимацией успеха (зелёная + «Успешно отправлено!»)
- Тряска модалки при ошибке валидации
- Backdrop blur
- **Читать**: `otziv.txt` (корень проекта).

### ➕ T14.1 — Создать `js/review-form.js`
Модальное окно отзыва:
- При клике на кнопку «Оставить отзыв» — открывает `<dialog>` (нативный `showModal()`).
- Рейтинг: 5 radio-кнопок со смайлами (😢🙁😐🙂😁), эмодзи анимируются (scale + filter при hover/checked).
- Валидация: рейтинг выбран обязательно, текст ≥ 10 символов.
- При ошибке: `.bounce-modal` (keyframe shake), focus на поле.
- При успехе: кнопка зеленеет, текст меняется на «Успешно отправлено!», через 1.5с закрывается и сбрасывается.
- После отправки: динамически добавляет `.review-card` в `.reviews__track` (имя + текст + 5 звёзд).
- **Читать**: `js/form.js` (валидация), `otziv.txt` (прототип), `js/slider.js` (структура .review-card).
- `window.initReviewForm = initReviewForm;`.

### ➕ T14.2 — Разметка модалки в `index.html`
Добавить в конец `<main>` (перед `</main>`):

Кнопка вызова (в секции reviews, после `.reviews__controls`):
```html
<button class="btn btn-primary" data-open-review>Оставить отзыв</button>
```

Модалка (в конец `<body>`, перед скриптами):
```html
<dialog class="review-dialog" id="review-dialog" aria-label="Форма отзыва">
  <div class="review-dialog__content">
    <button class="review-dialog__close" type="button" aria-label="Закрыть">&times;</button>
    <h3>Как вам наш сервис?</h3>
    <p class="review-dialog__subtitle">Пожалуйста, оцените вашу работу по шкале от 1 до 5</p>
    <form class="review-form" data-review-form novalidate>
      <div class="review-form__rating">
        <label><input type="radio" name="rating" value="1" required><span class="review-form__emoji">😢</span></label>
        <label><input type="radio" name="rating" value="2"><span class="review-form__emoji">🙁</span></label>
        <label><input type="radio" name="rating" value="3"><span class="review-form__emoji">😐</span></label>
        <label><input type="radio" name="rating" value="4"><span class="review-form__emoji">🙂</span></label>
        <label><input type="radio" name="rating" value="5"><span class="review-form__emoji">😁</span></label>
      </div>
      <div class="review-form__field">
        <input name="name" type="text" placeholder="Ваше имя" required>
      </div>
      <div class="review-form__field">
        <textarea name="text" placeholder="Расскажите нам подробнее..." required rows="4"></textarea>
      </div>
      <button type="submit" class="btn btn-primary review-form__submit">
        <span>Отправить отзыв</span>
      </button>
    </form>
  </div>
</dialog>
```

**Редактировать**: `index.html`.

### ➕ T14.3 — Добавить CSS в `reviews.css`
Стили для модалки отзыва:
- `.review-dialog` — `border-radius: 16px; max-width: 420px; opacity: 0; transform: scale(0.9); transition: ...`.
- `.review-dialog[open]` — `opacity: 1; transform: scale(1)`.
- `::backdrop` — `background: rgba(28,29,33,0.4); backdrop-filter: blur(4px)`.
- `.review-form__emoji` — `font-size: 32px; filter: grayscale(40%); transition: transform 0.2s, filter 0.2s`.
- `label:hover .review-form__emoji` / `:checked + .review-form__emoji` — scale + grayscale(0).
- `.review-form__submit.sending` — зелёный фон, pointer-events: none.
- `.bounce-modal` — анимация shake.
**Редактировать**: `css/sections/reviews.css`.

### ✏️ T14.4 — Подключить `review-form.js`
- В `js/main.js`: добавить `initReviewForm()`.
- В `index.html`: `<script defer src="js/review-form.js">`.
**Редактировать**: `js/main.js`, `index.html`.

---

## 15. Финальная синхронизация

### ✏️ T15.1 — Обновить все `tel:` и телефон в футере
На всех страницах заменить `tel:+79999999999` на `tel:+79234921444` и текст на `+7 (923) 492-14-44`.
**Редактировать**: `index.html` (уже ок), все `pages/*.html`.

### ✏️ T15.2 — Обновить `pages/contacts.html`
- Dropdown «Услуги» → новый список (T12.1).
- Footer → новые ссылки.
- Кнопка «Записаться» → `data-open-booking`.
**Редактировать**: `pages/contacts.html`.

### ✂️ T15.3 — Удалить `pages/services.html`
Страница `pages/services.html` больше не нужна — услуги разбиты по 4 отдельным страницам.
**Удалить**: `pages/services.html`.

### ✏️ T15.4 — Обновить `stack.mdc` (финальная версия)
- Обновить структуру файлов.
- Обновить разделы главной.
- Обновить контент (кол-во услуг = 4, FAQ = 7).
- Обновить чередование фонов.
**Редактировать**: `.cursor/rules/stack.mdc`.

---

## 16. Clean URLs: убираем `.html` из всех ссылок

### 📖 T16.0 — Принцип
Статический сайт без серверного роутинга. Чтобы ссылки были вида `домен.ru/therapy` (без `.html`), каждая страница помещается в свою директорию с `index.html`:
```
estetic_smile/
├── index.html               # Главная
├── therapy/index.html       # → /therapy/
├── ortopediy/index.html     # → /ortopediy/
├── surgery/index.html       # → /surgery/
├── prevention/index.html    # → /prevention/
├── about/index.html         # → /about/
├── promo/index.html         # → /promo/
├── gallery/index.html       # → /gallery/
├── contacts/index.html      # → /contacts/
└── pages/steps.html         # [архив]
```
Локальный сервер (`python -m http.server`) автоматически отдаёт `index.html` при заходе в директорию.

### ➕ T16.1 — Создать корневые директории
Создать пустые папки в корне проекта:
```
therapy/
ortopediy/
surgery/
prevention/
about/
promo/
gallery/
contacts/
```

### ✏️ T16.2 — Адаптировать пути в новых `index.html`
Все страницы на один уровень глубже корня → пути к ресурсам:
- CSS/JS: `../css/style.css`, `../js/main.js`
- Изображения: `../images/logo.png`, `../images/hero.jpg`
- Ссылки на другие страницы: `../therapy/`, `../about/` (или `therapy/`, `about/` — без `../`, т.к. они тоже на уровень глубже)
- Ссылка на главную: `../` или `../index.html`

**Правило для href внутри страниц в `xxx/index.html`:**
- На другие страницы того же уровня: `../therapy/`, `../surgery/` и т.д.
- На главную: `../`
- На якорь на главной: `../#reviews`

### ✏️ T16.3 — Обновить ссылки в index.html (главная)
Все href на страницы заменить с `pages/xxx.html` на `xxx/`:
- `pages/about.html` → `about/`
- `pages/gallery.html` → `gallery/`
- `pages/contacts.html` → `contacts/`
- `pages/promo.html` → `promo/`
- `pages/therapy.html` → `therapy/`
- `pages/ortopediy.html` → `ortopediy/`
- `pages/surgery.html` → `surgery/`
- `pages/prevention.html` → `prevention/`
**Редактировать**: `index.html`.

### ✂️ T16.4 — Удалить старые файлы из pages/
Удалить: `pages/about.html`, `pages/gallery.html`, `pages/contacts.html`, `pages/services.html` (уже удалён в T15.3).
Оставить: `pages/steps.html` (архив).
**Удалить**: `pages/about.html`, `pages/gallery.html`, `pages/contacts.html`.

### ✏️ T16.5 — Создать `contacts/index.html`
Перенести содержимое `pages/contacts.html` → `contacts/index.html`:
- Адаптировать все пути (CSS/JS: `../`, изображения: `../`)
- Dropdown «Услуги» → новый список (T12.1), href = `../therapy/` и т.д.
- Footer: обновить ссылки.
- Кнопка «Записаться» → `data-open-booking`.
- Телефон → `+7 (923) 492-14-44`.
**Создать**: `contacts/index.html`.

---

## Порядок выполнения (рекомендуемый)

1. **T0.1–T0.3** — модалка записи (базовая инфраструктура)
2. **T3** — booking-form → модалка
3. **T1, T5** — удалить cta-1, cta-2
4. **T2** — promo (убрать media, обновить кнопки)
5. **T4** — steps (убрать, сохранить)
6. **T6** — faq первый item
7. **T7** — services + страницы терапия/ортопедия/хирургия/профилактика
8. **T8** — marquee убрать смайлы
9. **T16** — clean URLs (создать директории, перенести страницы)
10. **T9** — about page (перенос в about/index.html)
11. **T10** — promo page (promo/index.html)
12. **T11** — gallery page (gallery/index.html)
13. **T12** — dropdown + footer links (финальные ссылки)
14. **T13** — faq вопросы
15. **T14** — форма отзыва
16. **T15** — финальная синхронизация
