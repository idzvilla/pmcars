# pmcars.by — Корпоративный сайт

## Проект
Многостраничный сайт компании по импорту авто из США в Беларусь под ключ.

## Стек
- **Framework:** Next.js 14 (App Router)
- **Styles:** Tailwind CSS v3
- **Language:** TypeScript
- **Fonts:** Muller (заголовки), Montserrat (тело) — local fonts в /public/fonts/
- **Icons:** Lucide React
- **Tests:** Jest + React Testing Library

## Структура
- `src/app/` — страницы (App Router)
- `src/components/layout/` — Header, Footer, MobileMenu
- `src/components/ui/` — Button, Accordion
- `src/components/sections/` — секции главной страницы
- `src/lib/calculator.ts` — логика таможенного калькулятора (pure functions, fully tested)
- `__tests__/` — тесты

## Брендинг и дизайн-токены
- Основной цвет: `#00ACB8` → Tailwind: `primary`
- Тёмный фон: `#0d1117` → Tailwind: `dark-bg`
- Тёмная карточка: `#111827` → Tailwind: `dark-card`
- Текст основной: `#333333` → Tailwind: `body`
- Текст вторичный: `#888888` → Tailwind: `muted`
- Светлый фон: `#f9f9f9` → Tailwind: `light-bg`
- Шрифт заголовков: Muller → `font-muller`
- Шрифт тела: Montserrat → `font-montserrat`
- Логотип: `/public/logo.svg` (белый wordmark)

## Важные детали
- **Замени перед запуском:** телефон (`+375XXXXXXXXX`), Telegram-ник (`pmcars`), адрес офиса, реквизиты ИП в оферте, ID YouTube-видео в VideoReviewsSection, фото команды в public/team/
- Таможенный калькулятор берёт курс EUR с API НБРБ: `https://api.nbrb.by/exrates/rates/451`
- Трекинг авто — заглушка, бэкенд добавляется позже
- Контактная форма в v1 ведёт в Telegram (нет email-бэкенда)
- Хедер высота ~88px, `main` имеет `pt-[88px]`

## Команды
```bash
npm run dev      # Запуск dev-сервера
npm run build    # Production сборка
npm test         # Запуск тестов
```

## Чеклист перед запуском
- [ ] Заменить `+375XXXXXXXXX` на реальный номер телефона
- [ ] Заменить `pmcars` в Telegram ссылках на реальный Telegram
- [ ] Добавить реальные фото команды в `public/team/`
- [ ] Заменить YouTube ID в `VideoReviewsSection.tsx`
- [ ] Заполнить реквизиты ИП в `/oferta`
- [ ] Добавить адрес офиса в `/contacts`
- [ ] Обновить цифры (количество авто, лет на рынке) в StatsSection
- [ ] Настроить домен и деплой на Vercel
