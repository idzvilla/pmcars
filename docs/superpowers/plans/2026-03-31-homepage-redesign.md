# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Редизайн главной страницы: новый порядок секций, новые тексты, новая структура тарифов (Экспресс/Стандартный/Корпоративный), визуальный язык калькулятора.

**Architecture:** Только UI-изменения в существующих компонентах. Удалить 4 неиспользуемых секции, обновить 7 остальных. Никакой новой логики. Порядок: сначала обновить page.tsx и удалить файлы, затем переписать каждую секцию.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS v3, TypeScript, Lucide React

---

## File Map

| Действие | Файл |
|----------|------|
| Modify | `src/app/page.tsx` |
| Delete | `src/components/sections/StatsSection.tsx` |
| Delete | `src/components/sections/PartnersSection.tsx` |
| Delete | `src/components/sections/VideoReviewsSection.tsx` |
| Delete | `src/components/sections/ServicesSection.tsx` |
| Modify | `src/components/sections/HeroSection.tsx` |
| Modify | `src/components/sections/TariffsSection.tsx` |
| Modify | `src/components/sections/AdvantagesSection.tsx` |
| Modify | `src/components/sections/HowItWorksSection.tsx` |
| Modify | `src/components/sections/TeamSection.tsx` |
| Modify | `src/components/sections/FaqSection.tsx` |
| Modify | `src/components/sections/CtaSection.tsx` |

---

### Task 1: Обновить page.tsx — новый порядок секций, удалить лишние импорты

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Заменить содержимое файла:**

```tsx
// src/app/page.tsx
import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import TariffsSection from '@/components/sections/TariffsSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import TeamSection from '@/components/sections/TeamSection'
import FaqSection from '@/components/sections/FaqSection'
import CtaSection from '@/components/sections/CtaSection'

export const metadata: Metadata = {
  title: 'Авто из США в Беларусь под ключ | pmcars.by',
  description: 'Импорт автомобилей из США в Беларусь под ключ. Подбор на Copart и IAAI, доставка, растаможка. Официальный договор, без скрытых комиссий.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TariffsSection />
      <AdvantagesSection />
      <HowItWorksSection />
      <TeamSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
```

- [ ] **Запустить сборку чтобы убедиться что нет ошибок импорта:**

```bash
npm run build 2>&1 | tail -20
```

Ожидаемо: ошибки про отсутствующие файлы (StatsSection и т.д.) — это нормально, удалим на следующем шаге.

- [ ] **Commit:**

```bash
git add src/app/page.tsx
git commit -m "refactor: simplify homepage section order, remove unused imports"
```

---

### Task 2: Удалить неиспользуемые секции

**Files:**
- Delete: `src/components/sections/StatsSection.tsx`
- Delete: `src/components/sections/PartnersSection.tsx`
- Delete: `src/components/sections/VideoReviewsSection.tsx`
- Delete: `src/components/sections/ServicesSection.tsx`

- [ ] **Удалить файлы:**

```bash
rm src/components/sections/StatsSection.tsx
rm src/components/sections/PartnersSection.tsx
rm src/components/sections/VideoReviewsSection.tsx
rm src/components/sections/ServicesSection.tsx
```

- [ ] **Проверить сборку:**

```bash
npm run build 2>&1 | tail -20
```

Ожидаемо: чистая сборка без ошибок.

- [ ] **Commit:**

```bash
git add -A
git commit -m "refactor: remove Stats, Partners, VideoReviews, Services sections"
```

---

### Task 3: HeroSection — новые тексты и CTA

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

- [ ] **Заменить содержимое файла:**

```tsx
// src/components/sections/HeroSection.tsx
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-dark-bg via-[#0f1f2e] to-dark-bg min-h-[600px] flex items-center">
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/40" />
      <div className="container py-20">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
            Авто из США • Беларусь
          </p>
          <h1 className="font-muller font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Пригоняем авто из&nbsp;США под&nbsp;ключ
          </h1>
          <p className="text-white/60 font-montserrat text-lg mb-8 leading-relaxed">
            Copart и IAAI — подбор, доставка, растаможка.
            Официальный договор, фиксированная стоимость услуг.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/info/kalkulyator-rashod" size="lg">
              Рассчитать стоимость
            </Button>
            <a
              href="https://t.me/pmcars"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded border-2 border-white/20 text-white font-montserrat font-bold text-lg hover:border-primary hover:text-primary transition-colors"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Проверить в браузере:** `npm run dev` → открыть localhost:3000, убедиться что Hero выглядит корректно.

- [ ] **Commit:**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: update hero copy and CTA to Telegram"
```

---

### Task 4: TariffsSection — Экспресс / Стандартный / Корпоративный

**Files:**
- Modify: `src/components/sections/TariffsSection.tsx`

- [ ] **Заменить содержимое файла:**

```tsx
// src/components/sections/TariffsSection.tsx
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'
import Link from 'next/link'

const tariffs = [
  {
    title: 'Экспресс',
    price: '300 руб',
    priceNote: null,
    features: [
      'Без консультаций сотрудников: вы присылаете номер лота и ставку по нему',
      'Проведение аукциона',
      'Организация доставки',
      'Отчёт CarFax бесплатно',
    ],
    highlighted: false,
  },
  {
    title: 'Стандартный',
    price: '600 руб',
    priceNote: null,
    features: [
      'Подбор авто (лотов)',
      'Консультация по найденному лоту: оценка степени проникновения удара, проверка истории',
      'Проведение аукциона',
      'Организация доставки',
      'Отчёт CarFax бесплатно',
    ],
    highlighted: true,
  },
  {
    title: 'Корпоративный',
    price: 'Индивидуально',
    priceNote: 'для ИП и юр. лиц',
    features: [
      'Доступ к брокерскому аккаунту',
      'Сопровождение при покупке',
      'Сопровождение в доставке',
      'Условия обсуждаются индивидуально',
    ],
    highlighted: false,
  },
]

export default function TariffsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-4">
          Стоимость услуг
        </h2>
        <p className="text-muted font-montserrat text-center mb-12 max-w-xl mx-auto">
          Фиксированная цена за нашу работу. Всё остальное — по фактическим затратам, без накруток.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tariffs.map((t) => (
            <div
              key={t.title}
              className={`rounded-2xl p-8 flex flex-col border-2 transition-all ${
                t.highlighted
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-gray-100 bg-light-bg'
              }`}
            >
              <h3 className="font-muller font-bold text-xl text-body mb-2">{t.title}</h3>
              <p className="text-3xl font-muller font-bold text-primary mb-1">{t.price}</p>
              {t.priceNote && (
                <p className="font-montserrat text-xs text-muted mb-4">{t.priceNote}</p>
              )}
              {!t.priceNote && <div className="mb-4" />}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-montserrat text-sm text-muted">
                    <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button href="/contacts" variant={t.highlighted ? 'primary' : 'outline'} className="w-full">
                Оставить заявку
              </Button>
            </div>
          ))}
        </div>
        <p className="text-center font-montserrat text-sm text-muted mt-8">
          Хотите узнать полную стоимость авто включая доставку и таможню?{' '}
          <Link href="/info/kalkulyator-rashod" className="text-primary hover:underline font-bold">
            Калькулятор расходов →
          </Link>
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Проверить в браузере:** секция тарифов выглядит корректно, 3 карточки, средняя выделена.

- [ ] **Commit:**

```bash
git add src/components/sections/TariffsSection.tsx
git commit -m "feat: update tariffs to Express/Standard/Corporate structure"
```

---

### Task 5: AdvantagesSection — новые тексты, новый заголовок

**Files:**
- Modify: `src/components/sections/AdvantagesSection.tsx`

- [ ] **Заменить содержимое файла:**

```tsx
// src/components/sections/AdvantagesSection.tsx
import { ShieldCheck, FileText, Star, Wrench, Users, Clock } from 'lucide-react'

const advantages = [
  {
    icon: ShieldCheck,
    title: 'Официальный договор',
    text: 'Каждая сделка закреплена договором. Ваши деньги защищены юридически с первого платежа.',
  },
  {
    icon: FileText,
    title: 'Никаких скрытых комиссий',
    text: 'Показываем все расходы до старта. Платите ровно то, что в смете — ни рублём больше.',
  },
  {
    icon: Star,
    title: 'Только США',
    text: 'Не распыляемся на Корею и Европу. Знаем Copart и IAAI изнутри — это даёт реальное преимущество при торгах.',
  },
  {
    icon: Wrench,
    title: 'Оцениваем лоты честно',
    text: 'Скажем если авто битое сильнее чем кажется. Лучше отговорить, чем потом объяснять.',
  },
  {
    icon: Users,
    title: 'Один менеджер от и до',
    text: 'Не передаём между отделами. Один человек ведёт вас от подбора до ключей в руках.',
  },
  {
    icon: Clock,
    title: 'Сроки — не обещания',
    text: 'Средний срок доставки 2–3 месяца. Обновляем статус на каждом этапе.',
  },
]

export default function AdvantagesSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-12">
          Почему работают с нами
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((a) => (
            <div key={a.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <a.icon size={32} className="text-primary mb-4" />
              <h3 className="font-muller font-bold text-lg text-body mb-2">{a.title}</h3>
              <p className="font-montserrat text-sm text-muted leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:**

```bash
git add src/components/sections/AdvantagesSection.tsx
git commit -m "feat: update advantages copy and heading"
```

---

### Task 6: HowItWorksSection — новые тексты шагов

**Files:**
- Modify: `src/components/sections/HowItWorksSection.tsx`

- [ ] **Заменить содержимое файла:**

```tsx
// src/components/sections/HowItWorksSection.tsx
const steps = [
  {
    num: '01',
    title: 'Рассказываете что хотите',
    text: 'Бюджет, марка, пожелания по состоянию. Мы находим подходящие лоты и присылаем подборку с разбором каждого.',
  },
  {
    num: '02',
    title: 'Выбираете — мы торгуемся',
    text: 'Вы одобряете лот, подписываем договор, вносите депозит. Участвуем в торгах от вашего имени.',
  },
  {
    num: '03',
    title: 'Авто едет морем',
    text: 'Забираем с площадки, грузим в контейнер, отправляем. Держим в курсе где авто прямо сейчас.',
  },
  {
    num: '04',
    title: 'Забираете в Минске',
    text: 'Встречаем в порту, оформляем таможню, получаем ЭПТС. Передаём ключи.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-12">
          Как это работает
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-14 -right-6 h-[1px] bg-primary/15" />
              )}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <span className="font-muller font-bold text-5xl text-primary/20 mb-3 leading-none">{s.num}</span>
                <h3 className="font-muller font-bold text-lg text-body mb-2">{s.title}</h3>
                <p className="font-montserrat text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:**

```bash
git add src/components/sections/HowItWorksSection.tsx
git commit -m "feat: update how-it-works step copy"
```

---

### Task 7: TeamSection — тёмный фон, новый подзаголовок, Telegram-кнопки

**Files:**
- Modify: `src/components/sections/TeamSection.tsx`

- [ ] **Заменить содержимое файла:**

```tsx
// src/components/sections/TeamSection.tsx
const team = [
  { name: 'Имя Фамилия', role: 'Основатель / Подбор авто', tg: 'pmcars' },
  { name: 'Имя Фамилия', role: 'Логистика и доставка', tg: 'pmcars' },
  { name: 'Имя Фамилия', role: 'Таможенное оформление', tg: 'pmcars' },
]

export default function TeamSection() {
  return (
    <section className="bg-dark-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-white text-center mb-4">
          Команда
        </h2>
        <p className="text-white/60 font-montserrat text-center mb-12 max-w-xl mx-auto">
          Живые люди, не колл-центр. Каждый менеджер ведёт клиента сам от начала до конца.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {team.map((p) => (
            <div key={p.role} className="text-center">
              <div className="w-32 h-32 rounded-2xl bg-dark-card mx-auto mb-4 overflow-hidden flex items-center justify-center text-white/20 text-4xl">
                👤
              </div>
              <h3 className="font-muller font-bold text-lg text-white mb-1">{p.name}</h3>
              <p className="font-montserrat text-sm text-primary mb-4">{p.role}</p>
              <a
                href={`https://t.me/${p.tg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded border border-white/20 text-white/70 font-montserrat text-sm hover:border-primary hover:text-primary transition-colors"
              >
                Написать в Telegram
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:**

```bash
git add src/components/sections/TeamSection.tsx
git commit -m "feat: team section dark bg, subtitle, telegram links"
```

---

### Task 8: FaqSection — обновить ответ про стоимость под новые тарифы

**Files:**
- Modify: `src/components/sections/FaqSection.tsx`

- [ ] **Заменить содержимое файла:**

```tsx
// src/components/sections/FaqSection.tsx
import Accordion, { type AccordionItem } from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'

const faqItems: AccordionItem[] = [
  {
    question: 'Сколько стоит услуга по доставке авто из США?',
    answer: 'Тариф «Экспресс» — 300 руб (вы присылаете готовый лот, мы проводим аукцион и организуем доставку). Тариф «Стандартный» — 600 руб (включает подбор авто, консультацию по лоту, оценку повреждений). Корпоративным клиентам — индивидуально.',
  },
  {
    question: 'Какой срок доставки авто из США?',
    answer: 'В среднем 2–3 месяца: 1–2 недели на покупку и отправку, 30–45 дней морем, 2–3 недели на таможню и оформление.',
  },
  {
    question: 'Как происходит оплата?',
    answer: 'Оплата по инвойсу через банковский перевод. В связи с санкциями переводы идут через компании-посредники, комиссия 4–5%. Плюс комиссия банка РБ: 20–100 BYN и 80–85 EUR за оформление документов.',
  },
  {
    question: 'Что включено в итоговую стоимость авто?',
    answer: 'Аукционный сбор, доставка по США до порта, морская перевозка, доставка из порта в РБ, растаможка и таможенные платежи, услуги декларанта.',
  },
  {
    question: 'Можно ли отследить где находится мой автомобиль?',
    answer: 'Да. После покупки мы предоставляем трекинг-данные и регулярно обновляем статус доставки. Также вы можете воспользоваться разделом «Отслеживание авто» на нашем сайте.',
  },
]

export default function FaqSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-12">
          Частые вопросы
        </h2>
        <div className="max-w-3xl mx-auto mb-8">
          <Accordion items={faqItems} />
        </div>
        <div className="text-center">
          <Button href="/faq" variant="outline">Все вопросы и ответы</Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:**

```bash
git add src/components/sections/FaqSection.tsx
git commit -m "feat: update faq tariff answer to match new pricing"
```

---

### Task 9: CtaSection — bg-primary, одна кнопка Telegram

**Files:**
- Modify: `src/components/sections/CtaSection.tsx`

- [ ] **Заменить содержимое файла:**

```tsx
// src/components/sections/CtaSection.tsx
export default function CtaSection() {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="container text-center">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-white mb-4">
          Готовы начать?
        </h2>
        <p className="text-white/80 font-montserrat mb-10 max-w-lg mx-auto">
          Оставьте заявку — свяжемся в течение часа
        </p>
        <a
          href="https://t.me/pmcars"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-10 py-4 rounded bg-white text-primary font-montserrat font-bold text-lg hover:bg-white/90 transition-colors"
        >
          Написать в Telegram
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Финальная проверка:** `npm run build` — чистая сборка без ошибок и предупреждений.

- [ ] **Commit:**

```bash
git add src/components/sections/CtaSection.tsx
git commit -m "feat: cta section primary bg, single telegram cta"
```

---

## Чеклист после реализации

- [ ] `npm run build` проходит без ошибок
- [ ] `npm test` — все тесты зелёные
- [ ] Hero: тег + заголовок + подзаголовок + 2 CTA отображаются корректно
- [ ] Tariffs: 3 карточки, средняя выделена border-primary, ссылка на калькулятор внизу
- [ ] Advantages: 6 карточек с новыми текстами, заголовок «Почему работают с нами»
- [ ] HowItWorks: 4 шага с новыми текстами, номера 01–04 декоративные
- [ ] Team: тёмный фон, Telegram-кнопки на каждой карточке
- [ ] FAQ: первый ответ содержит новые цены (300/600 руб)
- [ ] CTA: бирюзовый фон, белая кнопка Telegram
- [ ] Удалённые секции не импортируются нигде
