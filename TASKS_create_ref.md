# TASKS: Рефакторинг CSS — разбивка layout.css на секции

## Цель

Разбить `css/layout.css` (3418 строк) на атомарные файлы по секциям.  
HTML-файлы **не трогаем** — `layout.css` превращается в файл-хаб с `@import`.

---

## Структура после рефакторинга

```
css/
├── style.css           # без изменений
├── animations.css      # без изменений
├── loader.css          # без изменений
├── layout.css          # только @import ниже + .container
└── sections/
    ├── header.css      # строки 2300–3110 layout.css
    ├── hero.css        # строки 8–120
    ├── advantages.css  # строки 121–277  (advantages + marquee strip)
    ├── services.css    # строки 278–407
    ├── cta.css         # строки 408–472  (cta-1, cta-2, floating btn)
    ├── promo.css       # строки 473–660
    ├── about.css       # строки 661–836
    ├── booking.css     # строки 837–1111
    ├── steps.css       # строки 1112–1241
    ├── gallery.css     # строки 1242–1517
    ├── reviews.css     # строки 1518–1711
    ├── faq.css         # строки 1712–1850
    ├── contacts.css    # строки 1851–2299  (contacts + footer)
    └── pages.css       # строки 3111–3418  (inner pages)
```

---

## Шаги

### Шаг 1 — Создать папку `css/sections/`

- Просто создать директорию.

---

### Шаг 2 — Создать файлы в `css/sections/`

Для каждого файла: скопировать соответствующий диапазон строк из `css/layout.css`.  
Адаптивные `@media` правила, относящиеся к секции, **остаются в том же файле**.


| Файл             | Строки из layout.css | Содержит                                          |
| ---------------- | -------------------- | ------------------------------------------------- |
| `header.css`     | 2300–3110            | `.site-header`, nav, burger, dropdown, scrolled   |
| `hero.css`       | 8–120                | `.hero`, `.hero__content`, `.hero__image`         |
| `advantages.css` | 121–277              | `#advantages`, `.marquee-strip`                   |
| `services.css`   | 278–407              | `#services`, `.service-card`                      |
| `cta.css`        | 408–472              | `.section-cta`, `.floating-btn`, cookie notice    |
| `promo.css`      | 473–660              | `#promo`                                          |
| `about.css`      | 661–836              | `#about`, счётчики                                |
| `booking.css`    | 837–1111             | `#booking-form`                                   |
| `steps.css`      | 1112–1241            | `#steps`, `.step-card`                            |
| `gallery.css`    | 1242–1517            | `#gallery`, lightbox                              |
| `reviews.css`    | 1518–1711            | `#reviews`, карусель                              |
| `faq.css`        | 1712–1850            | `#faq`, аккордеон                                 |
| `contacts.css`   | 1851–2299            | `#contacts`, `footer`                             |
| `pages.css`      | 3111–3418            | `.page-hero`, `.page-cta`, `.service-detail-card` |


---

### Шаг 3 — Переписать `css/layout.css` как хаб

**Читать:** `css/layout.css` (строки 1–7, структура `.container`)  
**Редактировать:** `css/layout.css`

Итоговое содержимое:

```css
/* Shared layout */
.container {
  width: min(100% - 32px, 1180px);
  margin: 0 auto;
}

@import "sections/header.css";
@import "sections/hero.css";
@import "sections/advantages.css";
@import "sections/services.css";
@import "sections/cta.css";
@import "sections/promo.css";
@import "sections/about.css";
@import "sections/booking.css";
@import "sections/steps.css";
@import "sections/gallery.css";
@import "sections/reviews.css";
@import "sections/faq.css";
@import "sections/contacts.css";
@import "sections/pages.css";
```

> **Примечание:** `@import` должны идти **после** правил (`.container`), иначе браузер  
> выдаст предупреждение. Либо вынести `.container` в `style.css` и сделать `layout.css`  
> чисто импортным файлом. Рекомендуется второй вариант.

---

### Шаг 4 — Обновить `stack.mdc`

**Редактировать:** `.cursor/rules/stack.mdc`  
Обновить раздел «Структура файлов» под новую архитектуру.

---

## Проверка

После рефакторинга убедиться:

- `index.html` открывается без визуальных изменений
- `pages/*.html` открываются без визуальных изменений
- В DevTools нет 404 на CSS файлы
- Адаптив работает на 320px, 768px, 1200px

---

## Файлы для чтения при генерации кода


| Задача                 | Читать                            |
| ---------------------- | --------------------------------- |
| Создать header.css     | `css/layout.css` строки 2300–3110 |
| Создать hero.css       | `css/layout.css` строки 8–120     |
| Создать advantages.css | `css/layout.css` строки 121–277   |
| Создать services.css   | `css/layout.css` строки 278–407   |
| Создать cta.css        | `css/layout.css` строки 408–472   |
| Создать promo.css      | `css/layout.css` строки 473–660   |
| Создать about.css      | `css/layout.css` строки 661–836   |
| Создать booking.css    | `css/layout.css` строки 837–1111  |
| Создать steps.css      | `css/layout.css` строки 1112–1241 |
| Создать gallery.css    | `css/layout.css` строки 1242–1517 |
| Создать reviews.css    | `css/layout.css` строки 1518–1711 |
| Создать faq.css        | `css/layout.css` строки 1712–1850 |
| Создать contacts.css   | `css/layout.css` строки 1851–2299 |
| Создать pages.css      | `css/layout.css` строки 3111–3418 |
| Обновить layout.css    | `css/layout.css` строки 1–7       |


