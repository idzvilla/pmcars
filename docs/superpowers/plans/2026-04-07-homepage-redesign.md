# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переработать главную страницу по новой эмоциональной арке: выгода → доверие → кейсы → процесс → безопасность → цена → отзывы → FAQ → CTA.

**Architecture:** Большинство секций живёт прямо в `src/app/page.tsx` как инлайн-JSX. Создаём два новых компонента (`TrustBarSection`, `ReviewsSection`), обновляем `CasesSection.tsx`, всё остальное правим в `page.tsx`. Порядок секций и тексты меняются согласно спеке.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS v3, TypeScript, Lucide React

---

## File Map

| Файл | Действие | Что меняется |
|------|----------|--------------|
| `src/app/page.tsx` | Modify | Hero (новый H1, badge, подзаголовок), Steps (заголовки клиент-ориентированные), Advantages → «Прозрачность на каждом этапе» (новые тексты), Tariffs (BYN явно, Popular badge, разные CTA, корп «от X BYN»), FAQ (новый порядок + 2 новых вопроса), CTA (новый текст), новый порядок секций |
| `src/components/sections/CasesSection.tsx` | Modify | Добавить поле `deliveryDays` и `review` в каждый кейс, показать срок и цитату |
| `src/components/sections/TrustBarSection.tsx` | Create | Полоса с 4 цифрами доверия сразу под hero |
| `src/components/sections/ReviewsSection.tsx` | Create | 3–5 отзывов клиентов с именем, авто, цитатой |

---

## Task 1: TrustBarSection — полоса доверия под hero

**Files:**
- Create: `src/components/sections/TrustBarSection.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// src/components/sections/TrustBarSection.tsx
const stats = [
  { value: '200+', label: 'авто доставлено' },
  { value: '2–3 мес', label: 'средний срок' },
  { value: '8 лет', label: 'на рынке' },
  { value: '4.9 ★', label: 'средняя оценка' },
]

export default function TrustBarSection() {
  return (
    <div className="bg-dark-bg border-b border-white/[0.06]">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-5 text-center first:pl-0 last:pr-0">
              <p className="font-muller font-bold text-2xl text-primary mb-0.5">{s.value}</p>
              <p className="font-montserrat text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Проверить сборку**

```bash
cd /Users/test/Desktop/Cars && npm run build 2>&1 | tail -20
```

Ожидается: компилируется без ошибок.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/TrustBarSection.tsx
git commit -m "feat: add TrustBarSection with 4 trust stats"
```

---

## Task 2: ReviewsSection — отзывы клиентов

**Files:**
- Create: `src/components/sections/ReviewsSection.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// src/components/sections/ReviewsSection.tsx
const reviews = [
  {
    name: 'Алексей',
    car: 'BMW X3 2021',
    text: 'От покупки до ключей — 67 дней. Ни одного скрытого платежа. Всё как договорились.',
  },
  {
    name: 'Дмитрий',
    car: 'Toyota Camry SE 2022',
    text: 'Всё прозрачно, как и обещали. Смета совпала с итогом до рубля.',
  },
  {
    name: 'Сергей',
    car: 'Kia Sorento 2021',
    text: 'Брал через стандартный тариф. Менеджер был на связи весь путь — не нужно было самому ничего отслеживать.',
  },
]

export default function ReviewsSection() {
  return (
    <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
      <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
        Что говорят клиенты
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {reviews.map((r) => (
          <div key={r.name} className="bg-light-bg rounded-2xl p-6 border border-gray-100 flex flex-col gap-4">
            <p className="font-montserrat text-sm text-body leading-relaxed flex-1">
              «{r.text}»
            </p>
            <div>
              <p className="font-muller font-bold text-sm text-body">{r.name}</p>
              <p className="font-montserrat text-xs text-muted">{r.car}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Проверить сборку**

```bash
cd /Users/test/Desktop/Cars && npm run build 2>&1 | tail -20
```

Ожидается: без ошибок.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ReviewsSection.tsx
git commit -m "feat: add ReviewsSection with 3 placeholder reviews"
```

---

## Task 3: CasesSection — добавить срок доставки и цитату

**Files:**
- Modify: `src/components/sections/CasesSection.tsx`

- [ ] **Step 1: Обновить данные и разметку**

Заменить весь файл `src/components/sections/CasesSection.tsx`:

```tsx
// src/components/sections/CasesSection.tsx
import { Check } from 'lucide-react'

const CASES = [
  {
    car: 'Honda Accord 2020',
    auction: 'Copart · Texas',
    auctionPrice: '$8,200',
    totalPrice: '$16,500',
    deliveryDays: 68,
    work: ['Передний бампер', 'Покраска капота', 'Растаможка'],
    review: null,
  },
  {
    car: 'Toyota Camry 2019',
    auction: 'IAAI · Florida',
    auctionPrice: '$7,400',
    totalPrice: '$15,800',
    deliveryDays: 71,
    work: ['Замена лобового стекла', 'Подушки безопасности', 'Растаможка'],
    review: 'Всё как обещали — без сюрпризов.',
  },
  {
    car: 'Kia Sorento 2021',
    auction: 'Copart · Georgia',
    auctionPrice: '$11,000',
    totalPrice: '$20,200',
    deliveryDays: 74,
    work: ['Боковая дверь', 'Покраска порога', 'Растаможка'],
    review: null,
  },
]

export default function CasesSection() {
  return (
    <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
      <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
        Недавно доставили
      </h2>
      <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
        Реальные авто с ценами. Данные обновляются по мере новых пригонов.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {CASES.map((c) => (
          <div
            key={c.car}
            className="bg-light-bg rounded-2xl p-6 border border-gray-100 flex flex-col"
          >
            <h3 className="font-muller font-bold text-lg text-body mb-1">{c.car}</h3>
            <p className="font-montserrat text-xs text-muted mb-4">{c.auction}</p>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-montserrat text-xs text-muted mb-0.5">Аукцион</p>
                <p className="font-muller font-bold text-base text-body">{c.auctionPrice}</p>
              </div>
              <span className="text-muted/30 font-muller font-bold">→</span>
              <div className="text-right">
                <p className="font-montserrat text-xs text-muted mb-0.5">Под ключ</p>
                <p className="font-muller font-bold text-base text-primary">{c.totalPrice}</p>
              </div>
            </div>
            <p className="font-montserrat text-xs text-muted mb-3">
              Доставка: <span className="text-body font-semibold">{c.deliveryDays} дней</span>
            </p>
            <ul className="flex flex-col gap-1 mb-4 flex-1">
              {c.work.map((w) => (
                <li key={w} className="flex items-start gap-2 font-montserrat text-xs text-muted">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
            {c.review && (
              <p className="font-montserrat text-xs text-muted italic mb-3">«{c.review}»</p>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-montserrat font-semibold text-primary">
              <Check size={12} strokeWidth={2.5} />
              Передан клиенту
            </span>
          </div>
        ))}
      </div>
      <div className="bg-light-bg rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="font-montserrat text-sm text-muted">
          Хотите такой же результат? Рассчитаем стоимость под ваш бюджет за 1 час.
        </p>
        <a
          href="https://t.me/plusminus_cars"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-5 py-2 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary-dark transition-colors flex-shrink-0"
        >
          Написать в Telegram
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Проверить сборку**

```bash
cd /Users/test/Desktop/Cars && npm run build 2>&1 | tail -20
```

Ожидается: без ошибок.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/CasesSection.tsx
git commit -m "feat: update CasesSection with delivery days and optional review quote"
```

---

## Task 4: page.tsx — обновить Hero

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Обновить Hero секцию**

Найти блок `{/* Hero */}` в `src/app/page.tsx` и заменить его полностью:

```tsx
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-dark-bg via-[#0f1f2e] to-dark-bg">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />
        <div className="container py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              200+ авто доставлено · Работаем с 2017 года
            </p>
            <h1 className="font-muller font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Авто из&nbsp;США дешевле на&nbsp;30–50%, чем на&nbsp;рынке в&nbsp;Беларуси
            </h1>
            <p className="text-white/60 font-montserrat text-lg mb-8 leading-relaxed">
              Подберём на Copart или IAAI, доставим морем, растаможим. Получите ключи в Минске через 2–3 месяца. Договор и фиксированная цена — с первого дня.
            </p>
            <div className="flex flex-wrap gap-4 mb-14">
              <Button href="/info/kalkulyator-rashod" size="lg">
                Рассчитать стоимость моего авто
              </Button>
              <Button href="https://t.me/plusminus_cars" variant="ghost" size="lg" external>
                Написать в Telegram
              </Button>
            </div>
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Добавить импорт TrustBarSection**

В начало файла добавить строку после существующих импортов из `sections/`:

```tsx
import TrustBarSection from '@/components/sections/TrustBarSection'
```

- [ ] **Step 3: Добавить TrustBarSection после Hero**

После закрывающего тега `</section>` (конец Hero) и до `<div className="py-16 md:py-24">` добавить:

```tsx
      <TrustBarSection />
```

- [ ] **Step 4: Проверить сборку**

```bash
cd /Users/test/Desktop/Cars && npm run build 2>&1 | tail -20
```

Ожидается: без ошибок.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update hero headline to benefit-first, add TrustBarSection"
```

---

## Task 5: page.tsx — обновить Steps и Advantages

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Заменить массив `steps`**

Найти `const steps = [` и заменить весь массив:

```tsx
const steps = [
  {
    title: 'Опишите что хотите — получите подборку за день',
    text: 'Бюджет, марка, пожелания. Найдём подходящие лоты и разберём каждый: повреждения, история, реальная стоимость.',
  },
  {
    title: 'Вы выбираете — мы выигрываем торги',
    text: 'Подписываем договор, вносите депозит. Торгуемся на Copart или IAAI от вашего имени.',
  },
  {
    title: 'Следите за доставкой в реальном времени',
    text: 'Забираем авто с площадки → контейнер → море (30–45 дней). Трекинг и обновления статуса.',
  },
  {
    title: 'Получаете ключи в Минске',
    text: 'Таможня, ЭПТС, все документы — на нас. Вы забираете готовое авто.',
  },
]
```

- [ ] **Step 2: Обновить заголовок секции Steps**

Найти:
```tsx
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Как это работает
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            От вашего звонка до ключей в Минске — четыре шага.
          </p>
```

Заменить на:
```tsx
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            От звонка до ключей — 4 шага и 2–3 месяца
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Вы занимаетесь своими делами — мы везём.
          </p>
```

- [ ] **Step 3: Заменить массив `advantages`**

Найти `const advantages = [` и заменить весь массив:

```tsx
const advantages = [
  {
    icon: ShieldCheck,
    title: 'Договор до первого платежа',
    text: 'Сумма фиксируется в договоре до того, как вы переведёте хоть рубль. Если что-то идёт не по плану — у вас есть юридическая защита.',
  },
  {
    icon: FileText,
    title: 'Видите каждый рубль в смете',
    text: 'Аукцион, доставка по США, морская перевозка, таможня, наши услуги — всё расписано. Итоговая сумма не меняется.',
  },
  {
    icon: Star,
    title: '8 лет только на Copart и IAAI',
    text: 'Не разбрасываемся на Корею и Европу. Знаем стратегии торгов, подводные камни аукционов, реальное состояние лотов по фото.',
  },
  {
    icon: Users,
    title: 'Один человек от старта до ключей',
    text: 'Ваш менеджер знает всю историю — не нужно ничего объяснять дважды.',
  },
]
```

- [ ] **Step 4: Обновить заголовок секции Advantages**

Найти:
```tsx
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Почему работают с нами
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Работаем только с США — знаем Copart и IAAI изнутри.
          </p>
```

Заменить на:
```tsx
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Прозрачность на каждом этапе
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Никаких «не знаем, позвоните позже». Всё фиксируем, всё объясняем.
          </p>
```

- [ ] **Step 5: Проверить сборку**

```bash
cd /Users/test/Desktop/Cars && npm run build 2>&1 | tail -20
```

Ожидается: без ошибок.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: rewrite steps and advantages sections to client-first language"
```

---

## Task 6: page.tsx — обновить тарифы

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Заменить массив `tariffs`**

Найти `const tariffs = [` и заменить весь массив:

```tsx
const tariffs = [
  {
    title: 'Экспресс',
    price: '300 BYN',
    priceNote: null,
    badge: null,
    highlighted: false,
    cta: 'Начать с Экспресс',
    ctaHref: 'https://t.me/plusminus_cars',
    ctaExternal: true,
    features: [
      'Вы присылаете номер лота и ставку',
      'Проведение аукциона',
      'Организация доставки',
      'Отчёт CarFax бесплатно',
    ],
  },
  {
    title: 'Стандартный',
    price: '600 BYN',
    priceNote: null,
    badge: 'Популярный выбор',
    highlighted: true,
    cta: 'Выбрать Стандартный',
    ctaHref: 'https://t.me/plusminus_cars',
    ctaExternal: true,
    features: [
      'Подбор авто на аукционе',
      'Консультация по лоту: повреждения, история',
      'Проведение аукциона',
      'Организация доставки',
      'Отчёт CarFax бесплатно',
    ],
  },
  {
    title: 'Корпоративный',
    price: 'от 900 BYN',
    priceNote: 'для ИП и юр. лиц, обсуждаем объём',
    badge: null,
    highlighted: false,
    cta: 'Обсудить условия',
    ctaHref: 'https://t.me/plusminus_cars',
    ctaExternal: true,
    features: [
      'Доступ к брокерскому аккаунту',
      'Сопровождение при покупке',
      'Сопровождение в доставке',
      'Условия обсуждаются индивидуально',
    ],
  },
]
```

- [ ] **Step 2: Обновить разметку тарифов**

Найти весь блок `{tariffs.map((t) => (` и заменить его:

```tsx
            {tariffs.map((t) => (
              <div
                key={t.title}
                className={`bg-light-bg rounded-2xl p-6 border flex flex-col relative ${
                  t.highlighted ? 'border-primary' : 'border-gray-100'
                }`}
              >
                {t.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center px-3 py-1 rounded-full bg-primary text-white font-montserrat font-bold text-xs">
                    {t.badge}
                  </span>
                )}
                <h3 className="font-muller font-bold text-lg text-body mb-1">{t.title}</h3>
                <p className="text-2xl font-muller font-bold text-primary mb-1">{t.price}</p>
                {t.priceNote
                  ? <p className="font-montserrat text-xs text-muted mb-4">{t.priceNote}</p>
                  : <div className="mb-4" />
                }
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-montserrat text-sm text-muted">
                      <Check size={14} strokeWidth={2.5} className="text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  href={t.ctaHref}
                  variant={t.highlighted ? 'primary' : 'secondary'}
                  className="w-full justify-center"
                  external={t.ctaExternal}
                >
                  {t.cta}
                </Button>
              </div>
            ))}
```

- [ ] **Step 3: Обновить заголовок секции тарифов**

Найти:
```tsx
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Стоимость услуг
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Фиксированная цена за нашу работу. Всё остальное — по фактическим затратам, без накруток.
          </p>
```

Заменить на:
```tsx
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Выберите свой формат
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Фиксированная цена за нашу работу. Всё остальное — по фактическим затратам, без накруток.
          </p>
```

- [ ] **Step 4: Проверить сборку**

```bash
cd /Users/test/Desktop/Cars && npm run build 2>&1 | tail -20
```

Ожидается: без ошибок.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update tariffs — BYN explicit, Popular badge, per-plan CTAs, corporate from-price"
```

---

## Task 7: page.tsx — обновить FAQ и добавить ReviewsSection

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Добавить импорт ReviewsSection**

В блок импортов добавить:

```tsx
import ReviewsSection from '@/components/sections/ReviewsSection'
```

- [ ] **Step 2: Заменить массив `faqItems`**

Найти `const faqItems = [` и заменить весь массив (новый порядок: сначала страхи, потом остальное):

```tsx
const faqItems = [
  {
    question: 'А если авто окажется хуже, чем на фото?',
    answer: 'Мы проверяем каждый лот по истории (CarFax), фото и описанию аукциона. Если видим риск — говорим прямо и предлагаем другой вариант. После покупки делаем фотофиксацию состояния.',
  },
  {
    question: 'Как защищены мои деньги?',
    answer: 'Договор подписывается до первого платежа. Все суммы зафиксированы. Оплата идёт по инвойсам через банковский перевод — у вас полная финансовая прозрачность.',
  },
  {
    question: 'Какой срок доставки авто из США?',
    answer: 'В среднем 2–3 месяца: 1–2 недели на покупку и отправку, 30–45 дней морем, 2–3 недели на таможню и оформление.',
  },
  {
    question: 'Что включено в итоговую стоимость авто?',
    answer: 'Аукционный сбор, доставка по США до порта, морская перевозка, доставка из порта в РБ, растаможка и таможенные платежи, услуги декларанта.',
  },
  {
    question: 'Как происходит оплата и почему есть комиссия 4–5%?',
    answer: 'Оплата по инвойсу через банковский перевод. В связи с санкциями переводы идут через компании-посредники — это стандарт рынка, не наша накрутка. Комиссия 4–5% плюс комиссия банка РБ: 20–100 BYN и 80–85 EUR за оформление документов.',
  },
  {
    question: 'Можно ли отследить где находится мой автомобиль?',
    answer: 'Да. После покупки предоставляем трекинг-данные и регулярно обновляем статус. Также есть раздел «Отслеживание авто» на сайте.',
  },
  {
    question: 'Сколько стоит услуга?',
    answer: 'Тариф «Экспресс» — 300 BYN (вы присылаете лот, мы проводим аукцион и организуем доставку). Тариф «Стандартный» — 600 BYN (включает подбор, консультацию по лоту, оценку повреждений). Корпоративным клиентам — от 900 BYN, обсуждаем объём.',
  },
]
```

- [ ] **Step 3: Добавить ReviewsSection перед FAQ**

Найти блок `{/* Частые вопросы */}` и добавить перед ним:

```tsx
        <ReviewsSection />
```

- [ ] **Step 4: Обновить финальный CTA**

Найти:
```tsx
        {/* CTA */}
        <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
          <div className="max-w-xl">
            <h3 className="font-muller font-bold text-2xl text-white mb-3">
              Готовы начать?
            </h3>
            <p className="font-montserrat text-white/60 text-base mb-8 leading-relaxed">
              Оставьте заявку — свяжемся в течение часа и рассчитаем стоимость под ваш бюджет.
            </p>
```

Заменить на:
```tsx
        {/* CTA */}
        <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
          <div className="max-w-xl">
            <h3 className="font-muller font-bold text-2xl text-white mb-3">
              Узнайте, сколько будет стоить ваше авто
            </h3>
            <p className="font-montserrat text-white/60 text-base mb-3 leading-relaxed">
              Напишите нам — рассчитаем полную стоимость под ваш бюджет за 1 час.
            </p>
            <p className="font-montserrat text-white/40 text-sm mb-8">
              Бесплатно, без обязательств. Уже помогли 200+ клиентам.
            </p>
```

- [ ] **Step 5: Проверить сборку и тесты**

```bash
cd /Users/test/Desktop/Cars && npm run build 2>&1 | tail -20 && npm test 2>&1 | tail -20
```

Ожидается: сборка без ошибок, тесты проходят.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add ReviewsSection, reorder FAQ by concern priority, update final CTA copy"
```

---

## Task 8: Обновить metadata главной страницы

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Обновить metadata**

Найти:
```tsx
export const metadata: Metadata = {
  title: 'Авто из США в Беларусь под ключ | pmcars.by',
  description: 'Импорт автомобилей из США в Беларусь под ключ. Подбор на Copart и IAAI, доставка, растаможка. Официальный договор, без скрытых комиссий.',
}
```

Заменить на:
```tsx
export const metadata: Metadata = {
  title: 'Авто из США в Беларусь дешевле на 30–50% | pmcars.by',
  description: 'Импортируем авто из США в Беларусь под ключ. Подбор на Copart и IAAI, доставка морем, растаможка. 200+ авто, 8 лет на рынке. Договор и фиксированная цена с первого дня.',
}
```

- [ ] **Step 2: Финальная проверка сборки и тестов**

```bash
cd /Users/test/Desktop/Cars && npm run build 2>&1 | tail -30 && npm test 2>&1 | tail -20
```

Ожидается: сборка успешна, все тесты зелёные.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update homepage metadata with benefit-first title and richer description"
```

---

## Порядок секций в итоге

После всех задач `page.tsx` должен рендерить секции в таком порядке:

1. **Hero** — «Авто из США дешевле на 30–50%» + badge с цифрами
2. **TrustBarSection** — полоса: 200+ авто · 2–3 мес · 8 лет · 4.9 ★
3. *(Обёртка `<div className="py-16 md:py-24">` начинается)*
4. **Steps** — «От звонка до ключей — 4 шага»
5. **Advantages** — «Прозрачность на каждом этапе»
6. **CasesSection** — «Недавно доставили»
7. **Tariffs** — «Выберите свой формат»
8. **Calculator CTA** — блок со ссылкой на калькулятор (без изменений)
9. **ReviewsSection** — «Что говорят клиенты»
10. **FAQ** — «Частые вопросы» (новый порядок)
11. **Final CTA** — «Узнайте, сколько будет стоить ваше авто»
