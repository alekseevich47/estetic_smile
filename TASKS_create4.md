# TASKS_create4: Page Loader — SVG каллиграфическая анимация логотипа

## Концепция

Оверлей на всю страницу (фон `#4a4a4a`, серый) с SVG-надписью «Estetic Smile» в каллиграфическом стиле.
Надпись рисуется белым штрихом через `stroke-dashoffset` анимацию — эффект пера в реальном времени, слева направо.
После текста появляется декоративный орнамент (завиток). Финал — fade-out оверлея.

Показывается при каждой загрузке/переходе между страницами (полная анимация с нуля).

---

## Исходные данные

- **SVG-пути готовы**: `images/temp/text.txt` содержит корректный SVG 395.996×82.52 с каллиграфическим текстом.
- Проблема: весь текст — **один `<path>`**, буквы в `d`-атрибуте идут не в порядке слева направо.
- Решение: разбить единый `d`-атрибут на отдельные `<path>` по буквам, отсортировать по X.

---

## Файлы

### Читать (контекст):
- `index.html` — структура `<head>` и `<body>` (куда вставлять лоадер)
- `pages/services.html` / `pages/gallery.html` / `pages/contacts.html` / `pages/about.html` — то же
- `css/style.css` — CSS-переменные, паттерны
- `js/main.js` — паттерн инициализации модулей
- `images/temp/text.txt` — исходный SVG с path-данными

### Создать:
- `images/logo-loader.svg` — финальный SVG с разбитыми `<path>` по буквам + орнамент
- `css/loader.css` — стили оверлея и CSS-анимации
- `js/loader.js` — модуль управления лоадером

### Редактировать:
- `index.html` — добавить `<div id="page-loader">`, подключить `loader.css` и `loader.js`
- `pages/services.html`, `pages/gallery.html`, `pages/contacts.html`, `pages/about.html` — то же
- `js/main.js` — вызов `initLoader()` первым перед остальными `init*()`

---

## Шаги

### Шаг 1 — Подготовка SVG (`images/logo-loader.svg`)

**Источник**: `images/temp/text.txt`

**Задача — разбить единый `<path>` на отдельные пути по буквам:**

1. Исходный `d`-атрибут содержит несколько подпутей, разделённых `M ... Z` / `M ... M`.
   Каждая подпуть начинается с `M x y ...`.
2. Разбить `d` на массив подпутей по стартовой `M`-команде.
3. Определить X-координату каждой подпути (первое число после `M`).
4. Сгруппировать подпути в буквы:
   - Буквы с внутренними контурами (e, s, c, ...) имеют 2+ подпути с близкими X.
   - Группировка: подпути с разницей X ≤ 15–20px относятся к одной букве.
5. Отсортировать группы по X слева направо → это порядок анимации.
6. Каждую группу записать как `<path id="l-N" d="..."/>` (N = порядковый номер слева направо).
7. Добавить `<path id="ornament" d="..."/>` — простой декоративный завиток под текстом
   (горизонтальная волнистая линия ≈ как в logo.png; нарисовать вручную в SVG-координатах viewBox).

**Итог SVG:**
```xml
<svg viewBox="0 0 420 110" xmlns="http://www.w3.org/2000/svg">
  <!-- буквы E, s, t, e, t, i, c, S, m, i, l, e — отдельными <path> -->
  <path id="l-1"  fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" d="..."/>
  ...
  <path id="l-12" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" d="..."/>
  <!-- орнамент -->
  <path id="ornament" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" d="..."/>
</svg>
```

> Атрибут `pathLength="100"` на каждый `<path>` — упрощает CSS: не нужно знать реальную длину пути.

---

### Шаг 2 — CSS оверлей (`css/loader.css`)

**Оверлей:**
```css
#page-loader {
  position: fixed; inset: 0; z-index: 9999;
  background: #4a4a4a;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}
#page-loader.hidden {
  opacity: 0; visibility: hidden; pointer-events: none;
}
#page-loader svg { width: min(420px, 85vw); }
```

**Анимация штриха (базовый keyframe — одинаковый для всех путей):**
```css
@keyframes draw-stroke {
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 0; }
}
```

**Начальное состояние всех путей:**
```css
#page-loader path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
}
```

**Поочерёдный запуск через `animation-delay`:**
- Длительность одной буквы: ~0.18–0.25s (зависит от сложности).
- Каждая следующая буква стартует с задержкой = сумма длительностей предыдущих.
- `l-1` → `animation: draw-stroke 0.3s ease forwards; delay: 0s`
- `l-2` → `delay: 0.25s`
- ...
- `ornament` → запускается после последней буквы + 0.1s паузы.
- Общая длина анимации ≈ 3.2–3.8s.

---

### Шаг 3 — JS модуль (`js/loader.js`)

```js
export function initLoader() { ... }
```

**Логика:**

1. **Перезапуск анимации** (нужен при каждом показе):
   ```js
   function restartAnimation() {
     const paths = document.querySelectorAll('#page-loader path');
     paths.forEach(p => { p.style.animation = 'none'; });
     // reflow
     void document.getElementById('page-loader').offsetWidth;
     paths.forEach(p => { p.style.animation = ''; });
   }
   ```

2. **Скрытие после загрузки страницы:**
   ```js
   const ANIM_DURATION = 3800; // ms — должно совпадать с суммой CSS delays + длительностей
   restartAnimation();
   document.addEventListener('DOMContentLoaded', () => {
     setTimeout(() => loader.classList.add('hidden'), ANIM_DURATION);
   });
   ```

3. **Перехват межстраничных переходов:**
   ```js
   document.addEventListener('click', e => {
     const a = e.target.closest('a[href]');
     if (!a) return;
     const href = a.getAttribute('href');
     // пропустить: якоря, внешние, target=_blank, tel:, mailto:
     if (!href || href.startsWith('#') || href.startsWith('http') ||
         a.target === '_blank' || /^(tel|mailto):/.test(href)) return;
     e.preventDefault();
     loader.classList.remove('hidden');
     restartAnimation();
     setTimeout(() => { location.href = href; }, ANIM_DURATION);
   });
   ```

---

### Шаг 4 — HTML (`index.html` и `pages/*.html`)

В `<head>` (после остальных CSS):
```html
<link rel="stylesheet" href="css/loader.css">          <!-- index.html -->
<link rel="stylesheet" href="../css/loader.css">       <!-- pages/*.html -->
```

В начало `<body>` (первый дочерний элемент) — **inline SVG** (не `<img>`):
```html
<div id="page-loader" aria-hidden="true">
  <!-- содержимое logo-loader.svg вставляется напрямую -->
  <svg viewBox="0 0 420 110" ...> ... </svg>
</div>
```

> Inline SVG обязателен: `stroke-dashoffset` в CSS работает только на SVG-элементах в DOM.

Подключить `loader.js` в `<head>` с `defer` (или в конце `<body>`):
```html
<script src="js/loader.js" type="module" defer></script>  <!-- index.html -->
<script src="../js/loader.js" type="module" defer></script> <!-- pages/*.html -->
```

---

### Шаг 5 — Подключить в `js/main.js`

```js
import { initLoader } from './loader.js';

document.addEventListener('DOMContentLoaded', () => {
  initLoader(); // ← первым
  initHeader();
  // ...остальные init*()
});
```

---

## Зависимости между шагами

```
Шаг 1 (SVG: разбить пути, добавить орнамент)
  └─→ Шаг 2 (CSS: задержки под количество путей)
  └─→ Шаг 4 (HTML: вставить inline SVG на все страницы)

Шаг 3 (JS: таймер ANIM_DURATION = итог CSS)
Шаг 5 (main.js) — после Шага 3
```

---

## Зафиксированные решения

| Вопрос | Решение |
|---|---|
| Источник SVG | `images/temp/text.txt` (готовые пути) |
| Порядок анимации | Разбить на `<path>` по буквам, отсортировать по X |
| Орнамент | Да, отдельный `<path id="ornament">` после текста |
| Переходы | Полная анимация с нуля (перезапуск через reflow) |
| Скрытие лоадера | `DOMContentLoaded` + ожидание длины анимации |
| Цвет надписи | `stroke="white"` |
| Фон оверлея | `#4a4a4a` |
