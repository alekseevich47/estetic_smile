# TASKS_create2 — Hero Slideshow (автоматическая смена 4 фото)

## Что нужно сделать вручную (самостоятельно)

- [ ] Добавить 3 новых фотографии в `images/`:
  - `images/hero-2.jpg`
  - `images/hero-3.jpg`
  - `images/hero-4.jpg`
  - Требования: те же пропорции и стиль, что у `images/hero.jpg` (портретный/квадратный кадр, стоматологическая тематика)

---

## Файлы для чтения при генерации кода

| Файл | Зачем |
|---|---|
| `index.html` строки 123–141 | текущая разметка `#hero` |
| `css/layout.css` строки 9–93 | стили `.hero__media` и `.hero__media img` |
| `css/animations.css` | проверить, нет ли конфликтующих transition |
| `js/main.js` | точка входа, чтобы добавить вызов `initHeroSlideshow()` |

---

## Файлы для редактирования

| Файл | Что изменить |
|---|---|
| `index.html` | заменить одиночный `<img>` на `<div class="hero__slideshow">` с 4 слайдами |
| `css/layout.css` | добавить стили `.hero__slideshow`, `.hero__slide`, `.hero__slide.is-active` и CSS-переход `opacity` |
| `js/main.js` | импортировать и вызвать `initHeroSlideshow()` |
| `js/slider.js` | добавить функцию `initHeroSlideshow()` (таймер, смена `is-active`) |

> Новый отдельный файл создавать не нужно — логика вписывается в существующий `slider.js`.

---

## Пошаговый план

### Шаг 1 — HTML (`index.html`, строки 138–140)
Заменить:
```html
<div class="hero__media">
  <img src="images/hero.jpg" alt="...">
</div>
```
На:
```html
<div class="hero__media">
  <div class="hero__slideshow" aria-hidden="true">
    <img class="hero__slide is-active" src="images/hero.jpg"   alt="Стоматология Estetic Smile — фото 1">
    <img class="hero__slide"           src="images/hero-2.jpg" alt="Стоматология Estetic Smile — фото 2">
    <img class="hero__slide"           src="images/hero-3.jpg" alt="Стоматология Estetic Smile — фото 3">
    <img class="hero__slide"           src="images/hero-4.jpg" alt="Стоматология Estetic Smile — фото 4">
  </div>
</div>
```

### Шаг 2 — CSS (`css/layout.css`, после блока `.hero__media img`)
Добавить правила:
- `.hero__slideshow` — `position: relative; width: 100%; height: 100%;`
- `.hero__slide` — `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 1s ease;`
- `.hero__slide.is-active` — `opacity: 1;`
- Убрать/адаптировать старое правило `.hero__media img` (оно больше не адресует слайды напрямую)

### Шаг 3 — JS (`js/slider.js`)
Добавить экспортируемую функцию `initHeroSlideshow()`:
- Найти все `.hero__slide`
- Хранить `currentIndex = 0`
- `setInterval` каждые **4000 мс**: убрать `is-active` у текущего, добавить следующему (по кругу)
- Остановить таймер, если секция не видима (`document.hidden`), восстановить при `visibilitychange`

### Шаг 4 — JS (`js/main.js`)
Добавить вызов `initHeroSlideshow()` в блок `DOMContentLoaded` (рядом с остальными `init*()`).

---

## Ограничения / договорённости

- Управление пользователем (стрелки, точки) — **не реализуется**
- Preload первого слайда — браузер делает сам (`is-active` → `opacity: 1` сразу)
- Остальные 3 картинки — `loading="lazy"` не ставить, чтобы смена была мгновенной
