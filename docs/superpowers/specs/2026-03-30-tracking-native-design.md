# Нативный трекинг авто — Дизайн-спецификация

**Дата:** 2026-03-30
**Статус:** Утверждён

## Контекст

Текущая страница `/tracking` — заглушка с отключённой формой и сообщением "Функция в разработке". Цель: сделать полноценный трекинг авто по VIN, который показывает данные с Atlantic Express Corp (AEC) в нативном дизайне сайта pmcars.by.

Источник данных: `https://client.atlanticexpresscorp.com/order/{VIN}/track`
Авторизация: не требуется, страница публичная.

## Архитектура

### Файлы

| Файл | Назначение |
|------|-----------|
| `src/app/api/track/route.ts` | Next.js API Route — fetch + парсинг AEC, возвращает JSON |
| `src/lib/tracking.ts` | TypeScript-типы + логика парсинга HTML через cheerio |
| `src/app/tracking/page.tsx` | `"use client"` — VIN-форма, вызов API, отображение результата |
| `src/components/tracking/TrackingResult.tsx` | Контейнер результата — рендерит все блоки данных |
| `src/components/tracking/TrackingTimeline.tsx` | Горизонтальный прогресс-бар этапов доставки |
| `src/components/tracking/TrackingPhotos.tsx` | Сетка фото-категорий + лайтбокс |

### Зависимость

```
page.tsx → GET /api/track?vin={VIN} → route.ts → cheerio парсит AEC HTML
                                                ↓
                                          TrackingData JSON
                                                ↓
                              TrackingResult → Timeline + Cards + Photos
```

### Новая зависимость

- `cheerio` — серверная библиотека для парсинга HTML (`npm install cheerio`)

## Типы данных

```typescript
// src/lib/tracking.ts

interface TrackingStage {
  name: string        // "New", "Received", "Sail", "Arrive"
  date: string | null // "11/14/2025" или null если не наступил
  isActive: boolean
  hiddenCount?: number // +3 промежуточных шага
}

interface TrackingPhotos {
  category: string   // "Auction", "Pick up", "Received", etc.
  count: number
  thumbnailUrl: string | null
  imageUrls: string[]
}

interface TrackingData {
  commodity: {
    vin: string
    vehicle: string  // "TESLA • MODEL Y • 2024"
    lotNo: string
    insurance: string
  }
  stages: TrackingStage[]
  saleOrigin: {
    origin: string
  }
  delivery: {
    branch: string
    truckingRequired: boolean
  }
  shipping: {
    destination: string
    line: string
    vessel: string
    containerNo: string
    trackingUrl: string | null
  }
  inspection: {
    keys: string
    color: string
    condition: string  // "NEW" | "USED"
    damage: string     // "YES" | "NO"
  }
  photos: TrackingPhotos[]
}

type TrackingResult =
  | { success: true; data: TrackingData }
  | { success: false; error: 'not_found' | 'unavailable' | 'parse_error' }
```

## API Route

**`GET /api/track?vin={VIN}`**

1. Валидирует VIN: 17 символов, латиница + цифры, без I/O/Q
2. Делает `fetch('https://client.atlanticexpresscorp.com/order/{VIN}/track')`
3. Если статус 404 — возвращает `{ success: false, error: 'not_found' }`
4. Парсит HTML через cheerio
5. Если парсинг упал — возвращает `{ success: false, error: 'parse_error' }`
6. Возвращает `{ success: true, data: TrackingData }`

Кеширование: `revalidate: 300` (5 минут) через Next.js fetch cache.

## UI — страница трекинга

### Форма (всегда вверху)

- Поле VIN с валидацией (17 символов, нет I/O/Q)
- Кнопка "Отследить" в `primary`
- Состояния: idle → loading (спиннер) → result / error
- Шрифты и цвета: `font-montserrat`, `border-primary` на фокусе

### Результат — блоки (показываются под формой)

**1. Hero-карточка** (`bg-dark-bg`, rounded-2xl)
- Слева: VIN + название авто (Tesla Model Y 2024)
- Справа: текущий статус (последний активный этап) с бейджем в `primary`

**2. Timeline** (`TrackingTimeline`)
- Горизонтальная линия с узлами этапов
- Активные этапы: заполнены `primary`, неактивные: серые
- Под каждым узлом: название этапа + дата
- Промежуточные шаги (+3) показываются как коллапс

**3. Информационные карточки** (3 колонки на desktop, 1 на mobile)
- `bg-light-bg`, `rounded-2xl`, `p-6`
- Заголовок карточки: `font-muller font-bold`
- Строки: label в `text-muted` + value в `text-body`
- Карточки: Commodity, Shipping, Inspection + Sale Origin + Delivery

**4. Фото** (`TrackingPhotos`)
- Сетка категорий 2×3 (или адаптивно)
- Карточка категории: превью-картинка (или placeholder) + название + количество
- Клик → лайтбокс: большое фото + стрелки навигации + миниатюры сбоку
- Изображения грузятся напрямую с CDN AEC

### Ошибки

| Состояние | Сообщение |
|-----------|-----------|
| `not_found` | "Авто с этим VIN не найдено в системе" + кнопки Telegram/WhatsApp |
| `unavailable` | "Сервис временно недоступен, попробуйте позже" + кнопки связи |
| `parse_error` | То же что unavailable |
| Невалидный VIN | Инлайн-ошибка под полем до отправки запроса |

## Фолбэк при недоступности AEC

Если AEC недоступен или вернул неожиданную структуру HTML, пользователь видит сообщение с предложением написать менеджеру. Блок с Telegram/WhatsApp кнопками уже есть в текущей странице — переиспользуем его.

## Риски

- **AEC меняет HTML** — парсер перестаёт работать. Митигация: парсинг изолирован в `tracking.ts`, ошибки обрабатываются gracefully.
- **Hotlinking фото** — CDN AEC может запрещать прямые ссылки. Если возникнет, решаем проксированием через `/api/photo?url=...`.
- **Rate limiting** — AEC может ограничивать запросы. Митигация: кеш 5 минут на уровне Next.js.

## Что не входит в скоуп

- Проксирование изображений (добавим только если CDN заблокирует)
- История поисков / сохранение VIN
- Авторизация пользователей
- Push-уведомления об изменении статуса
