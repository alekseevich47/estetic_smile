# TASKS_create3_rep — Исправление marquee-strip

## Файлы для чтения перед реализацией

| Файл | Строки |
|---|---|
| `index.html` | 148–240 |
| `css/layout.css` | 204–282 |
| `css/animations.css` | 135–228 |

## Файлы для редактирования

| Файл | Что менять |
|---|---|
| `index.html` | тексты айтемов + добавить наборы дублей (до ×4) |
| `css/layout.css` | убрать hover-pause, убрать `padding-inline` с трека |
| `css/animations.css` | добавить squash на смайл --smile |

---

## Шаги

### Шаг 1 — Устранить рывок (`css/layout.css`)

**Причина:** `padding-inline: 16px` на `.marquee-strip__track` входит в расчёт `width: max-content`, из-за чего `translateX(-50%)` не совпадает ровно с границей набора.

**Действие:** удалить строку `padding-inline: 16px` из `.marquee-strip__track`.
Добавить горизонтальный отступ иначе: через `padding: 14px 16px` на `.marquee-strip` (уже есть `overflow: hidden` — padding не повлияет на анимацию).

### Шаг 2 — Убрать паузу при hover (`css/layout.css`)

Удалить блок:
```css
.marquee-strip:hover .marquee-strip__track {
  animation-play-state: paused;
}
```

### Шаг 3 — Увеличить тексты и наборы дублей (`index.html`)

**Новые тексты** (достаточно длинные, ~30–40 символов каждый):

| Класс | Текст |
|---|---|
| `--wink` | `Без боли и страха — вы расслабитесь` |
| `--smile` | `Результат за 1 визит — красивая улыбка` |
| `--heart` | `Команда с душой — заботимся о каждом` |
| `--cool` | `Комфорт на каждом шаге лечения` |

**Количество наборов:** заменить 2 набора (оригинал + 1 дубль) на 4 набора (оригинал + 3 дубля `aria-hidden="true"`).
Это гарантирует заполнение экрана при любом разрешении без пустоты.

Тексты обновить и в оригинале, и во всех дублях.

### Шаг 4 — Squash-анимация смайла (`css/animations.css`)

**Задача:** при улыбке весь смайл расплющивается (squash): шире по X, ниже по Y.

Добавить привязку анимации на `.smiley` (весь SVG-элемент):
```css
.marquee-item--smile .smiley {
  animation: smiley-squash 3s ease-in-out infinite;
}
```

Новый keyframe:
```
@keyframes smiley-squash {
  0%, 100% { transform: scaleX(1) scaleY(1); }
  45%       { transform: scaleX(1.18) scaleY(0.80); }
  55%       { transform: scaleX(1.18) scaleY(0.80); }
  70%       { transform: scaleX(1) scaleY(1); }
}
```

Существующий `smiley-smile` на `.marquee-item--smile .smiley__mouth` — **оставить** (рот тоже растягивается). Оба эффекта работают одновременно.

Добавить в `@media (prefers-reduced-motion: reduce)`:
```css
.marquee-item--smile .smiley { animation: none; }
```

---

## Архитектурные решения

- **Рывок fix**: `translateX(-50%)` работает корректно только если `width` трека = ровно 2× ширине одного набора. Любой `padding-inline` на треке ломает это соотношение. Отступы — только через внешний контейнер.
- **4 набора вместо 2**: при широком экране или крупном шрифте 2 набора могут не покрывать экран. 4 набора — надёжный запас для любого устройства.
- **Squash на `.smiley`**: анимируется весь SVG-элемент (не `smiley__face`), потому что деформация должна захватить и глаза, и рот — выглядит естественнее.
- **`transform-box: fill-box` + `transform-origin: center`** уже прописаны на `.smiley__eye`, `.smiley__mouth` в animations.css — для `.smiley` (SVG-тег) это не нужно, браузер деформирует его в родительской системе координат.
