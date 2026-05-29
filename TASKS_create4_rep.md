# TASKS_create4_rep: Исправление лоадера — 3 проблемы

## Проблемы и причины

| # | Симптом | Причина |
|---|---|---|
| 1 | Белые точки до начала рисования | `stroke-linecap: round` + `pathLength="100"` создаёт видимый наконечник при `dashoffset = dasharray`. Нужна реальная длина через `getTotalLength()`. |
| 2 | E и S отображаются сразу, без рисования | Эти буквы — `<path>` с несколькими суб-путями (M…Z M…Z…). При `pathLength="100"` паттерн dash перезапускается на каждом суб-пути → первый суб-путь имеет нулевой offset и мгновенно виден. |
| 3 | Лоадер на внутренних страницах | Нужно убрать полностью. |

---

## Файлы

### Читать (контекст):
- `js/loader.js` — текущая реализация (таймер, перезапуск, перехват кликов)
- `css/loader.css` — текущие стили и анимации
- `index.html` — структура: где подключены loader.css / loader.js, где `#page-loader` div
- `pages/services.html` — как представитель внутренних страниц

### Редактировать:
- `js/loader.js` — замена `pathLength`-подхода на `getTotalLength()`
- `css/loader.css` — убрать `stroke-dasharray`/`stroke-dashoffset` из CSS (перенести в JS)
- `pages/services.html`, `pages/gallery.html`, `pages/contacts.html`, `pages/about.html` — удалить loader

---

## Шаги

### Шаг 1 — Исправить инициализацию путей в `js/loader.js`

**Заменить подход `pathLength="100"` на динамический расчёт реальных длин.**

В функции `restartAnimation()` (или аналоге):

```js
function initPaths() {
  const paths = document.querySelectorAll('#page-loader path');
  paths.forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len + 1; // +1 убирает точку linecap
  });
}
```

- Вызывать `initPaths()` один раз при загрузке (до старта анимации).
- При перезапуске анимации (`restartAnimation()`) — сбросить `strokeDashoffset = len + 1`, затем запустить CSS-анимации.
- Удалить атрибут `pathLength="100"` из всех `<path>` в SVG (`images/logo-loader.svg` / inline SVG в `index.html`).

### Шаг 2 — Исправить CSS-анимацию в `css/loader.css`

**Убрать из CSS:**
```css
/* УДАЛИТЬ — теперь устанавливается через JS */
#page-loader path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
}
```

**Изменить keyframe** — анимировать от `var(--path-len)` до 0, где переменная задаётся JS:
```css
@keyframes draw-stroke {
  to { stroke-dashoffset: 0; }
}
```
> `from` убрать — браузер возьмёт текущее значение `strokeDashoffset`, установленное JS.

**Добавить `animation-fill-mode: both`** на все пути → гарантирует, что пути остаются невидимыми до своей задержки:
```css
/* применяется через JS при запуске, не через общий селектор */
```
На практике: JS устанавливает `animation` через `style.animation` с нужными `delay` + `fill-mode: both`.

### Шаг 3 — Удалить лоадер с внутренних страниц

В каждом из `pages/services.html`, `pages/gallery.html`, `pages/contacts.html`, `pages/about.html`:
1. Удалить `<link rel="stylesheet" href="../css/loader.css">`.
2. Удалить `<script src="../js/loader.js" ...>` (или `import`).
3. Удалить `<div id="page-loader">...</div>`.

В `js/loader.js`:
- Убрать/отключить перехват `click` на ссылки, ведущие на внутренние страницы.
  ИЛИ — обернуть весь `initLoader()` в проверку:
  ```js
  if (!document.getElementById('page-loader')) return;
  ```
  Тогда код безопасно работает только там, где есть лоадер.

---

## Порядок выполнения

```
Шаг 1 (js/loader.js: getTotalLength)
  └─→ Шаг 2 (css/loader.css: убрать CSS-dasharray, обновить keyframe)
Шаг 3 (pages/*.html: удалить лоадер) — независимо
```
