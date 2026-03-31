# Multi-Auction VIN Lookup Design

**Дата:** 2026-04-01
**Статус:** Approved

## Цель

Расширить VIN-поиск в калькуляторе расходов: искать параллельно на Copart, IAAI и BidCars, возвращать первый найденный результат и показывать источник пользователю. Поддержка завершённых лотов — ключевое требование.

## Архитектура

### Новый API Route: `src/app/api/vin-lookup/route.ts`

`GET /api/vin-lookup?vin=XXXXX`

Запускает три поиска параллельно через `Promise.allSettled`. Возвращает первый успешный результат по приоритету: **Copart → IAAI → BidCars**.

Существующий `/api/copart-vin/route.ts` **остаётся нетронутым** (используется в тестах, не ломаем).

Страница калькулятора переключается с `/api/copart-vin` на `/api/vin-lookup`.

### Общий тип ответа

```typescript
interface VinLookupResult {
  year: number
  engineLiters: number
  fuelType: 'gas' | 'diesel' | 'hybrid' | 'electric'
  priceUSD: number
  location: string
  lotNumber: number | string
  source: 'copart' | 'iaai' | 'bidcars'
}
```

Ошибки: `{ error: 'invalid_vin' | 'not_found' | 'unavailable' }`

### Вспомогательный модуль: `src/lib/vin-lookup.ts`

Содержит переиспользуемые pure-функции:
- `mapFuelType(raw: string): FuelType`
- `parseEngineLiters(raw: string | number | null | undefined): number`
- `isValidVin(vin: string): boolean`

Эти функции сейчас дублированы в `/api/copart-vin/route.ts` — выносим в shared lib. `/api/copart-vin` импортирует их оттуда (минимальный рефактор).

## Источники данных

### Copart

Переиспользуем существующую логику из `/api/copart-vin`:

1. `POST https://www.copart.com/public/lots/search-results`
   Body: `{"query":{"bool":{"must":[{"term":{"vn":"<VIN>"}}]}},"size":1,"sort":[]}`
2. `GET https://www.copart.com/public/lot/<lotId>/detail`

Поля: `lot.y` (year), `lot.egn` (engine cc), `lot.ft` (fuel), `lot.lbv` (bid), `lot.yn` (location), `lot.ln` (lotNumber)

### IAAI

1. `GET https://www.iaai.com/Search/GetSearchResults?SearchType=1&VIN=<VIN>`
   Возвращает JSON с массивом лотов. Берём первый.
2. Из результата извлекаем: `Year`, `EngineSize` (строка типа "2.0L"), `FuelType`, `CurrentBid`, `LocationName`, `StockNumber`

Заголовки: `User-Agent`, `Accept: application/json`, `Referer: https://www.iaai.com`

### BidCars

1. `POST https://bidcars.com/api/search`
   Body: `{"vin":"<VIN>","page":1,"limit":1}`
2. Из результата извлекаем: `year`, `engine` (строка типа "2.0"), `fuel_type`, `price`, `location`, `lot_id`

Заголовки: `User-Agent`, `Content-Type: application/json`, `Referer: https://bidcars.com`

> **Примечание:** Точные имена полей IAAI и BidCars нужно верифицировать при реальных запросах в dev. В тестах используем моки — при расхождении обновляем route и тесты вместе.

## UX изменения

Успешное сообщение показывает источник:
> ✓ Данные загружены с IAAI — проверьте и при необходимости скорректируйте поля ниже

Также устанавливается `auction` в соответствии с источником: `'copart'`, `'iaai'`, или `'bidcars'`.

Ошибка если ни один не нашёл:
> VIN не найден на Copart, IAAI и BidCars

Ошибка если все недоступны (сетевые ошибки):
> Аукционы временно недоступны

## Файлы

| Файл | Действие | Ответственность |
|---|---|---|
| `src/lib/vin-lookup.ts` | **Создать** | Shared pure-функции: mapFuelType, parseEngineLiters, isValidVin |
| `src/app/api/vin-lookup/route.ts` | **Создать** | Параллельный поиск на Copart + IAAI + BidCars |
| `src/app/api/copart-vin/route.ts` | **Изменить минимально** | Импортировать shared функции из `src/lib/vin-lookup.ts` |
| `src/app/info/kalkulyator-rashod/page.tsx` | **Изменить** | Использовать `/api/vin-lookup` вместо `/api/copart-vin`, показывать source в success-сообщении, устанавливать auction из source |
| `__tests__/vin-lookup-lib.test.ts` | **Создать** | Unit-тесты для shared функций |
| `__tests__/vin-lookup-route.test.ts` | **Создать** | Unit-тесты для нового route (fetch замокан) |
| `__tests__/copart-vin-block.test.tsx` | **Изменить** | Обновить URL с `/api/copart-vin` на `/api/vin-lookup`, добавить `source` в моки |

## Что не входит в scope

- Manheim (закрытый дилерский аукцион, требует авторизации)
- Показ нескольких результатов одновременно (берём первый по приоритету)
- Кэширование результатов на сервере
- Сохранение истории поиска
