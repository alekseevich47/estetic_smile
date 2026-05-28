# TASKS_create.md — Пошаговый план создания сайта Estetic Smile

> Референс: REF_1.md  
> Стек: чистый HTML5 / CSS3 / Vanilla JS  
> Акцентный цвет: синий `#4A7FC1` (вместо оранжевого)

---

## ШАГ 0 — Подготовка ресурсов (изображения)

Положить фото в папку `images/` вручную до начала вёрстки:

```
images/
├── logo.png                     # Логотип клиники (PNG с прозрачностью, ~200×60px)
├── hero.jpg                     # Hero: врач или улыбка пациента (≥1920×1080)
├── about.jpg                    # О клинике: фото зала / команды (≥1200×800)
├── promo.jpg                    # Акционная секция: фото (≥800×600)
├── form-collage.jpg             # Коллаж рядом с формой записи (≥800×900)
├── services/
│   ├── implant.jpg              # Имплантация (4:3, ≥600×450)
│   ├── whitening.jpg            # Отбеливание (4:3)
│   ├── braces.jpg               # Брекеты (4:3)
│   ├── veneers.jpg              # Виниры (4:3)
│   ├── caries.jpg               # Лечение кариеса (4:3)
│   └── prosthetics.jpg          # Протезирование (4:3)
├── steps/
│   ├── step-1.jpg               # Консультация (4:3)
│   ├── step-2.jpg               # Диагностика (4:3)
│   ├── step-3.jpg               # Лечение (4:3)
│   └── step-4.jpg               # Результат / улыбка (4:3)
└── gallery/
    ├── before-1.jpg             # До (1:1, ≥600×600)
    ├── after-1.jpg              # После (1:1)
    ├── before-2.jpg
    ├── after-2.jpg
    ├── before-3.jpg
    ├── after-3.jpg
    ├── before-4.jpg
    ├── after-4.jpg
    ├── before-5.jpg
    ├── after-5.jpg
    ├── before-6.jpg
    └── after-6.jpg
```

---

## ШАГ 1 — Структура проекта

Создать файлы и папки:

```
estetic_smile/
├── index.html
├── pages/
│   ├── services.html
│   ├── gallery.html
│   ├── contacts.html
│   └── about.html
├── css/
│   ├── style.css        # Переменные, сброс, базовые компоненты
│   ├── layout.css       # Header, Hero, секции, Footer
│   └── animations.css   # Scroll-triggered, hover, transitions
├── js/
│   ├── main.js          # Инициализация всех модулей
│   ├── header.js        # Sticky header, бургер-меню
│   ├── gallery.js       # Lightbox, сетка галереи
│   ├── slider.js        # Карусель отзывов
│   ├── accordion.js     # FAQ аккордеон
│   ├── form.js          # Валидация, маска телефона, отправка
│   ├── animations.js    # IntersectionObserver, счётчики
│   └── cookie.js        # Cookie-уведомление
└── images/              # (ШАГ 0)
```

**Читать при генерации:** только создаваемые файлы.

---

## ШАГ 2 — CSS-переменные и базовый сброс

**Файл:** `css/style.css`  
**Создать секцию `:root` с переменными:**

```
--color-accent: #4A7FC1
--color-accent-hover: #3A6EAF
--color-dark: #2C2C2C
--color-white: #FFFFFF
--color-bg-light: #F5F5F5
--color-text-gray: #666666
--color-text-muted: #999999
--color-accent-shadow: rgba(74, 127, 193, 0.4)
--border-radius-pill: 30px
--border-radius-card: 15px
--transition: 0.3s ease
--section-padding: 80px 0
```

Подключить шрифт Inter (Google Fonts).  
CSS-сброс: `*, box-sizing: border-box`, убрать дефолтные margin/padding.

---

## ШАГ 3 — HTML-каркас `index.html`

**Файл:** `index.html`  
Семантическая структура:

```html
<head> — meta, og-теги, schema LocalBusiness, подключение CSS
<body>
  <div id="preloader">
  <header id="header">          <!-- sticky -->
  <main>
    <section id="hero">
    <section id="advantages">
    <section id="services">
    <section id="cta-1">
    <section id="promo">
    <section id="about">
    <section id="booking-form">
    <section id="steps">
    <section id="cta-2">
    <section id="gallery">
    <section id="reviews">
    <section id="faq">
    <section id="contacts">
  </main>
  <footer id="footer">
  <button id="floating-btn">   <!-- fixed, записаться -->
  <div id="cookie-notice">
  <div id="lightbox">
```

Подключить все JS-файлы через `<script defer src="js/...">` в конце `<body>`.

---

## ШАГ 4 — Header

**Файл:** `css/layout.css` (секция header)  
**Файл:** `js/header.js`

Структура:
- Логотип (PNG) + текст «Estetic Smile»
- Навигация: Услуги (dropdown: 6 услуг) | Галерея | Акции | О нас | Контакты
- Иконки соцсетей: ВКонтакте, WhatsApp
- Кнопка «Записаться» (pill, акцентный синий)
- Телефон (кликабельный)

Параметры CSS:
- `position: sticky; top: 0; z-index: 1000`
- `background: #2C2C2C; height: 75px`
- `.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.3); }`

JS (`header.js`):
- `IntersectionObserver` или `scroll` → добавить класс `.scrolled`
- Бургер: toggle класс `.menu-open` на `<body>`
- Анимация бургер → крестик через CSS `transform`
- Dropdown для «Услуги» — click/hover

---

## ШАГ 5 — Hero-секция

**Файл:** `css/layout.css` (секция #hero)

Split-screen 50/50:
- Левая: тёмный фон `#2C2C2C`, H1 «Красивая улыбка — ваш главный актив», подзаголовок, 2 кнопки
- Правая: `images/hero.jpg`, `object-fit: cover`, 100vh

Кнопки:
- Primary: синий `#4A7FC1` + белый текст + иконка →
- Secondary: прозрачный + белая обводка

Адаптив: на mobile — flex-column, фото уходит вниз/фоном.

---

## ШАГ 6 — Секция преимуществ (4 карточки)

**Файл:** `css/layout.css` (секция #advantages)

Фон: `#F5F5F5`. Сетка 4 колонки (desktop) / 2 (tablet) / 1 (mobile).

4 карточки:
1. Иконка щита → «Безболезненное лечение» — современная анестезия
2. Иконка звезды → «15 лет опыта» — специалисты высшей категории
3. Иконка сертификата → «Гарантия на работы» — до 5 лет на все процедуры
4. Иконка приборов → «Современное оборудование» — цифровая диагностика

Иконки SVG inline, квадрат с акцентным синим фоном.

---

## ШАГ 7 — Секция услуг (карточки)

**Файл:** `css/layout.css` (секция #services)

Фон: белый. Тег-лейбл «Наши услуги» (pill, синий). H2 с волнистым подчёркиванием.  
Сетка 3 колонки (desktop) / 2 (tablet) / 1 (mobile). Gap: 30px.

6 карточек:
1. Имплантация — `services/implant.jpg` — бейдж «от 25 000 ₽»
2. Отбеливание — `services/whitening.jpg` — бейдж «1 визит»
3. Брекеты — `services/braces.jpg` — бейдж «от 35 000 ₽»
4. Виниры — `services/veneers.jpg` — бейдж «6 шт. за визит»
5. Лечение кариеса — `services/caries.jpg` — бейдж «от 2 500 ₽»
6. Протезирование — `services/prosthetics.jpg` — бейдж «гарантия 5 лет»

Hover: `translateY(-5px)` + shadow. Кнопка «Подробнее» (синяя, pill).

---

## ШАГ 8 — CTA-полоса #1

**Файл:** `css/layout.css` (секция #cta-1)

Фон: `#2C2C2C`. Центр. Padding 60px.  
H2: «Не откладывайте здоровье зубов»  
Подзаголовок: «Запишитесь сейчас — первая консультация бесплатно»  
Кнопка: синяя, pill.

---

## ШАГ 9 — Акционная секция

**Файл:** `css/layout.css` (секция #promo)

Фон: `#4A7FC1` (акцентный синий).  
Split-screen: текст слева + коллаж `promo.jpg` справа (слегка повёрнутые фото, rotate: ±3deg).  
Текст: «Акция: Отбеливание + консультация за 3 900 ₽». Дедлайн. 2 кнопки (белая + обводка белая).

---

## ШАГ 10 — Секция «О клинике»

**Файл:** `css/layout.css` (секция #about)

Фон: белый. Split-screen: фото слева (`about.jpg`) / текст + 3 мини-иконки справа.  
Текст: история клиники, ценности, цифры (анимированные счётчики):
- «500+» довольных пациентов
- «15» лет на рынке
- «12» специалистов

---

## ШАГ 11 — Форма записи

**Файл:** `css/layout.css` (секция #booking-form)  
**Файл:** `js/form.js`

Фон: `#2C2C2C`. Split-screen: форма слева / коллаж `form-collage.jpg` справа.

Форма:
- Поле «Имя» (text)
- Поле «Телефон» (маска `+7 (___) ___-__-__`)
- Select «Услуга» (6 вариантов)
- Чекбокс согласия с политикой
- Кнопка «Записаться» (синяя, full-width)
- Или: кнопки «ВКонтакте» / «WhatsApp»

JS (`form.js`): маска телефона (Inputmask или нативная), валидация, состояние загрузки (спиннер), уведомление об успехе.  
Focus: `border-color: #4A7FC1; box-shadow: 0 0 0 3px rgba(74,127,193,0.15)`.

---

## ШАГ 12 — Этапы лечения (4 шага)

**Файл:** `css/layout.css` (секция #steps)

Фон: `#F5F5F5`. Сетка 4 колонки (desktop) / 2 (tablet) / 1 (mobile).

Карточки:
1. «ШАГ №1» — Консультация — `steps/step-1.jpg`
2. «ШАГ №2» — Диагностика — `steps/step-2.jpg`
3. «ШАГ №3» — Лечение — `steps/step-3.jpg`
4. «ШАГ №4» — Результат — `steps/step-4.jpg`

Бейдж «ШАГ №X»: обводка + pill, синий текст. CTA-кнопка только в карточке 1.

---

## ШАГ 13 — CTA-полоса #2

Аналогично ШАГ 8. Текст: «Готовы к идеальной улыбке? Запишитесь сегодня».

---

## ШАГ 14 — Галерея «До/После»

**Файл:** `css/layout.css` (секция #gallery)  
**Файл:** `js/gallery.js`

Фон: `#2C2C2C`. Сетка 4 колонки (desktop) / 3 (tablet) / 2 (mobile). `aspect-ratio: 1`. Gap: 15px.  
12 фото (`gallery/before-1.jpg`… `after-6.jpg`).  
Hover: `scale(1.05)` + тёмный overlay + иконка zoom.

Lightbox (`gallery.js`):
- Overlay `rgba(0,0,0,0.92)`
- Стрелки навигации, счётчик «3 / 12»
- Закрытие: кнопка ✕, клик вне, Escape
- Свайп на мобильных

---

## ШАГ 15 — Карусель отзывов

**Файл:** `css/layout.css` (секция #reviews)  
**Файл:** `js/slider.js`

Фон: белый. Лейбл «Отзывы пациентов». Desktop: 3 карточки / mobile: 1.

5 отзывов (придумать: имя, текст, 5 звёзд ★★★★★):
- Мария К. — «После имплантации прошло 2 года — результат великолепный»
- Андрей Н. — «Боялся стоматологов всю жизнь, здесь всё безболезненно»
- и т.д.

Навигация: стрелки (синие) + dots. Autoplay 5s. Touch-swipe.

---

## ШАГ 16 — FAQ аккордеон

**Файл:** `css/layout.css` (секция #faq)  
**Файл:** `js/accordion.js`

Фон: белый. 6–8 вопросов:
- Больно ли ставить имплант?
- Сколько стоит первая консультация?
- Как записаться на приём?
- Есть ли рассрочка?
- Как долго идёт лечение брекетами?
- Делаете ли вы отбеливание за один визит?
- Есть ли детский приём?
- Какую анестезию применяете?

Анимация: `max-height 0→500px`, `0.4s ease-in-out`. Стрелка rotate 180deg.

---

## ШАГ 17 — Контакты + Карта

**Файл:** `css/layout.css` (секция #contacts)

Фон: `#2C2C2C`. Split-screen: карта Яндекс (iframe) слева / контакты справа.

Контакты:
- Телефон: `+7 (38449) X-XX-XX` (ссылка `tel:`)
- Адрес: г. Тайга, ул. …
- Режим работы: Пн–Пт 9:00–20:00, Сб 10:00–17:00
- Иконки: ВКонтакте, WhatsApp

---

## ШАГ 18 — Footer

**Файл:** `css/layout.css` (секция footer)

Фон: `#2C2C2C`. 3 колонки (desktop) / 1 (mobile):
1. Логотип + краткое описание + соцсети
2. Услуги (список-ссылки)
3. Документы: Политика конфиденциальности, Оферта

Нижняя полоса: телефон | © 2024 Estetic Smile. Все права защищены.  
Ссылки: белые, hover → синие.

---

## ШАГ 19 — Анимации

**Файл:** `css/animations.css`  
**Файл:** `js/animations.js`

- Все секции/карточки: `opacity: 0; translateY(30px)` → `opacity: 1; translateY(0)` при входе в viewport (`IntersectionObserver`)
- Stagger для карточек: `animation-delay: 0.1s` на каждую
- Анимированные счётчики (секция #about): 0 → N за 1.5s, ease-out
- Sticky floating кнопка: появляется после скролла 300px

---

## ШАГ 20 — Вспомогательные элементы

**Файл:** `js/cookie.js`

- Cookie-уведомление (fixed, снизу): кнопка «Принять» → скрыть + сохранить в `localStorage`
- Sticky floating-кнопка «Записаться»: `position: fixed; right: 30px; bottom: 30px; border-radius: 50%` — синяя, иконка телефона

---

## ШАГ 21 — Внутренние страницы

**Файлы:** `pages/services.html`, `pages/gallery.html`, `pages/contacts.html`, `pages/about.html`

Каждая страница:
- Хлебные крошки под header
- Уникальный H1
- Переиспользуемые компоненты (header/footer — копируются или include через JS)

---

## ШАГ 22 — SEO и мета

**Файл:** `index.html` (секция `<head>`)

- `<title>` уникальный
- `<meta name="description">`
- Open Graph теги
- Schema.org `MedicalBusiness` (JSON-LD)
- Alt-текст у всех `<img>`
- `loading="lazy"` на все фото ниже fold
- `font-display: swap`

---

## ШАГ 23 — Финальная проверка

- Проверить адаптивность: 320px, 768px, 1024px, 1440px
- Проверить `tabindex` и навигацию с клавиатуры
- Проверить работу форм (валидация, состояния)
- Проверить lightbox (стрелки, ESC, свайп)
- Проверить плавность анимаций
- Открыть через `Live Server` или `python -m http.server`
