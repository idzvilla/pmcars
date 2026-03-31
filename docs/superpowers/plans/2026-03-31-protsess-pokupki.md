# Страница «Процесс покупки» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить страницу `/protsess` с 6 секциями, sticky-сайдбаром справа и пунктом «Процесс покупки» в навигации.

**Architecture:** Server Component `page.tsx` экспортирует `metadata` и рендерит Client Component `ProtsessPageClient.tsx`, который управляет IntersectionObserver для подсветки активной секции в правом сайдбаре. Сайдбар виден только на xl+, на мобильном скрыт.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, Lucide React, IntersectionObserver API

---

## Файловая карта

| Действие | Файл | Назначение |
|---|---|---|
| Create | `src/app/protsess/page.tsx` | Server Component, metadata, рендерит client |
| Create | `src/app/protsess/ProtsessPageClient.tsx` | Client Component, всё содержимое + IntersectionObserver |
| Modify | `src/components/ui/Accordion.tsx` | Расширить `answer` до `React.ReactNode` |
| Modify | `src/components/layout/Header.tsx` | +пункт «Процесс покупки» в десктопной навигации |
| Modify | `src/components/layout/MobileMenu.tsx` | +пункт «Процесс покупки» в мобильном меню |
| Create | `__tests__/protsess.test.tsx` | Smoke-тест: все секции рендерятся |

---

## Task 1: Extend Accordion to accept ReactNode answer

Текущий `Accordion` принимает `answer: string`. Секция 6 («Полезная информация») нуждается в списках внутри аккордеона. Меняем тип до `React.ReactNode` — обратно совместимо.

**Files:**
- Modify: `src/components/ui/Accordion.tsx`

- [ ] **Step 1: Обновить интерфейс и рендер**

Открой `src/components/ui/Accordion.tsx` и замени полностью:

```tsx
// src/components/ui/Accordion.tsx
'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  question: string
  answer: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-gray-200">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center py-4 px-0 text-left font-montserrat font-bold text-body hover:text-primary transition-colors"
            aria-expanded={openIndex === i}
          >
            <span>{item.question}</span>
            <ChevronDown
              size={18}
              className={`flex-shrink-0 ml-4 text-primary transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            style={{
              maxHeight: openIndex === i ? '40rem' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}
            aria-hidden={openIndex !== i}
          >
            <div className="text-muted font-montserrat text-sm leading-relaxed pb-4">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Проверить что сборка не сломана**

```bash
npm run build 2>&1 | tail -20
```

Ожидаемый результат: `✓ Compiled successfully` (или warnings, но не errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Accordion.tsx
git commit -m "feat: accordion answer accepts ReactNode"
```

---

## Task 2: Update navigation — Header and MobileMenu

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/MobileMenu.tsx`

- [ ] **Step 1: Добавить пункт в десктопную навигацию (Header.tsx)**

В файле `src/components/layout/Header.tsx` найди блок после `<li>` с `href="/dostavka"` и добавь новый `<li>` сразу после него:

```tsx
// НАЙТИ (строка ~127):
                      <li>
                        <Link href="/dostavka" className="text-white/80 hover:text-primary transition-colors whitespace-nowrap">
                          Доставка
                        </Link>
                      </li>
// ДОБАВИТЬ ПОСЛЕ:
                      <li>
                        <Link href="/protsess" className="text-white/80 hover:text-primary transition-colors whitespace-nowrap">
                          Процесс покупки
                        </Link>
                      </li>
```

- [ ] **Step 2: Добавить пункт в мобильное меню (MobileMenu.tsx)**

В файле `src/components/layout/MobileMenu.tsx` найди массив `navItems` и добавь элемент после `{ label: 'Доставка из США', href: '/dostavka' }`:

```ts
const navItems: NavItem[] = [
  { label: 'Услуги', href: '/uslugi' },
  { label: 'Доставка из США', href: '/dostavka' },
  { label: 'Процесс покупки', href: '/protsess' },  // ← добавить
  {
    label: 'Информация',
    children: [
      // ...existing
    ],
  },
  { label: 'FAQ', href: '/faq' },
  { label: 'Контакты', href: '/contacts' },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/MobileMenu.tsx
git commit -m "feat: add Процесс покупки nav item"
```

---

## Task 3: Page skeleton — layout, sidebar, IntersectionObserver

Создаём два файла: server wrapper с metadata и client component со скелетом layout.

**Files:**
- Create: `src/app/protsess/page.tsx`
- Create: `src/app/protsess/ProtsessPageClient.tsx`
- Create: `__tests__/protsess.test.tsx`

- [ ] **Step 1: Написать falling smoke-тест**

```tsx
// __tests__/protsess.test.tsx
import { render, screen } from '@testing-library/react'
import ProtsessPageClient from '@/app/protsess/ProtsessPageClient'

// Mock IntersectionObserver (отсутствует в jsdom)
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver
})

describe('ProtsessPageClient', () => {
  it('renders all 6 section headings', () => {
    render(<ProtsessPageClient />)
    // 'Процесс покупки' appears in both h1 and section h2, so use getAllByText
    expect(screen.getAllByText('Процесс покупки').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Как мы работаем')).toBeInTheDocument()
    expect(screen.getByText('Оплата и договор')).toBeInTheDocument()
    expect(screen.getByText('Доставка и растаможка')).toBeInTheDocument()
    expect(screen.getByText('Получение авто в РБ')).toBeInTheDocument()
    expect(screen.getByText('Полезная информация')).toBeInTheDocument()
  })

  it('renders sidebar navigation links', () => {
    render(<ProtsessPageClient />)
    const links = screen.getAllByRole('link', { name: /Как мы работаем/i })
    expect(links.length).toBeGreaterThanOrEqual(1)
  })
})
```

- [ ] **Step 2: Запустить тест — убедиться что падает**

```bash
npx jest protsess --no-coverage 2>&1 | tail -20
```

Ожидаемый результат: `FAIL — Cannot find module '@/app/protsess/ProtsessPageClient'`

- [ ] **Step 3: Создать server component page.tsx**

```tsx
// src/app/protsess/page.tsx
import type { Metadata } from 'next'
import ProtsessPageClient from './ProtsessPageClient'

export const metadata: Metadata = {
  title: 'Процесс покупки авто из США | pmcars.by',
  description: 'Полный процесс покупки автомобиля из США в Беларусь: от заявки и подбора до таможни и получения. Прозрачно, пошагово, без скрытых платежей.',
}

export default function ProtsessPage() {
  return <ProtsessPageClient />
}
```

- [ ] **Step 4: Создать client component — скелет с layout и IntersectionObserver**

```tsx
// src/app/protsess/ProtsessPageClient.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const SECTIONS = [
  { id: 'kak-my-rabotaem', label: 'Как мы работаем' },
  { id: 'protsess', label: 'Процесс покупки' },
  { id: 'oplata', label: 'Оплата и договор' },
  { id: 'dostavka', label: 'Доставка и растаможка' },
  { id: 'poluchenie', label: 'Получение авто в РБ' },
  { id: 'info', label: 'Полезная информация' },
]

export default function ProtsessPageClient() {
  const [activeSection, setActiveSection] = useState('kak-my-rabotaem')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 xl:px-6">
        {/* Page header */}
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Процесс покупки
        </h1>
        <p className="text-muted font-montserrat text-lg max-w-2xl mb-14 md:mb-16">
          Понятный процесс покупки авто из США — от заявки до ключей. На каждом этапе вы
          понимаете, что происходит с вашим автомобилем и за что вы платите.
        </p>

        {/* Two-column layout */}
        <div className="flex gap-16 items-start">

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sections will be added here in subsequent tasks */}
          </div>

          {/* Right sidebar — desktop only */}
          <aside className="hidden xl:block w-[160px] flex-shrink-0 sticky top-24">
            <p className="text-xs uppercase tracking-widest text-muted/40 font-montserrat mb-3">
              На странице
            </p>
            <nav className="flex flex-col">
              {SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`py-[5px] pl-2 text-xs font-montserrat leading-snug transition-colors border-l-[1.5px] ${
                    activeSection === id
                      ? 'text-primary font-semibold border-primary'
                      : 'text-muted/50 border-transparent hover:text-muted'
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>

        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Запустить тест — убедиться что проходит**

```bash
npx jest protsess --no-coverage 2>&1 | tail -20
```

Ожидаемый результат: `FAIL` — тест ищет заголовки секций, которых ещё нет. Это нормально, они появятся в следующих задачах.

> Примечание: тест станет зелёным после Task 8 когда все секции будут добавлены.

- [ ] **Step 6: Commit**

```bash
git add src/app/protsess/page.tsx src/app/protsess/ProtsessPageClient.tsx __tests__/protsess.test.tsx
git commit -m "feat: protsess page skeleton with layout and IntersectionObserver"
```

---

## Task 4: Section 1 — Как мы работаем

**Files:**
- Modify: `src/app/protsess/ProtsessPageClient.tsx`

- [ ] **Step 1: Добавить секцию в main content**

В `ProtsessPageClient.tsx` найди комментарий `{/* Sections will be added here */}` и замени его на:

```tsx
            {/* ── Section 1: Как мы работаем ── */}
            <section
              id="kak-my-rabotaem"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-6">
                Как мы работаем
              </h2>
              <div className="font-montserrat text-base text-muted leading-relaxed space-y-4 max-w-2xl mb-8">
                <p>
                  Подбираем автомобили, за которые нам не будет стыдно. Не работаем по
                  принципу «лишь бы купить дешевле». Если видим, что авто не стоит брать —
                  мы прямо об этом говорим и не настаиваем на покупке.
                </p>
                <p>
                  Для нас важно не просто провести сделку, а чтобы вы остались довольны
                  результатом. Мы уверены, что движемся в правильном направлении, если вы
                  рекомендуете нас своим знакомым.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contacts"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Подобрать автомобиль под ваш бюджет
                </Link>
                <a
                  href="https://t.me/pmcars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl border border-gray-200 text-body font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Получить честную консультацию
                </a>
              </div>
            </section>

            {/* Sections 2–6 will be added here */}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/protsess/ProtsessPageClient.tsx
git commit -m "feat: protsess section 1 — как мы работаем"
```

---

## Task 5: Section 2 — Процесс покупки (8-step timeline)

Вертикальный timeline — такой же паттерн как на `/dostavka` (круг с номером + линия-коннектор).

**Files:**
- Modify: `src/app/protsess/ProtsessPageClient.tsx`

- [ ] **Step 1: Добавить данные шагов над компонентом**

В `ProtsessPageClient.tsx` добавь перед `export default function` массив с шагами:

```tsx
const PURCHASE_STEPS = [
  {
    title: 'Заявка и консультация',
    text: 'Вы оставляете заявку или связываетесь с нами удобным способом. Мы уточняем бюджет, обсуждаем какой автомобиль нужен, объясняем как проходит покупка и делаем предварительный расчёт. Уже на этом этапе вы понимаете: сколько примерно будет стоить авто «под ключ» и какие есть варианты.',
    bullets: null,
  },
  {
    title: 'Подбор автомобиля',
    text: 'Подбираем реальные лоты с аукционов США (Copart, IAAI, Manheim). Вы получаете:',
    bullets: [
      'подбор под ваш бюджет',
      'фото и описание авто',
      'отчёт CARFAX / история',
      'анализ повреждений',
      'прогноз стоимости ремонта',
    ],
  },
  {
    title: 'Согласование и расчёт',
    text: 'Перед покупкой вы точно знаете: финальную стоимость авто при согласованной ставке, расходы на доставку, таможенные платежи и ориентировочную стоимость ремонта. Никаких «доплат по ходу».',
    bullets: null,
  },
  {
    title: 'Участие в торгах',
    text: 'Наша задача — купить автомобиль, который будет выгоден и оправдает вложения. Согласовываем максимальную ставку, участвуем в онлайн-торгах, не превышаем ваш бюджет. Вы можете присутствовать онлайн, в офисе или доверить процесс нам. Если авто не выиграли — подбираем другие варианты, вы ничего не теряете.',
    bullets: null,
  },
  {
    title: 'Оплата и оформление',
    text: 'После покупки вы получаете скриншот из кабинета аукциона и официальный инвойс. В инвойсе указана итоговая сумма: стоимость автомобиля + аукционный сбор. Оплата производится через банк по SWIFT-переводу — мы объясняем как правильно заполнить платёж и подсказываем банки.',
    bullets: null,
  },
  {
    title: 'Доставка из США',
    text: 'Организовываем логистику: доставка по США до порта, погрузка в контейнер, отправка в Европу, доставка в Беларусь. Вы можете отслеживать авто на каждом этапе — мы сообщаем статусы и сроки.',
    bullets: null,
  },
  {
    title: 'Таможенное оформление',
    text: 'Помогаем пройти растаможку в Беларуси: подготовка документов, расчёт платежей, сопровождение процесса.',
    bullets: null,
  },
  {
    title: 'Получение автомобиля',
    text: 'Вы получаете авто в Беларуси (Гомель или другой город). Проверяете автомобиль, оформляете документы. На каждом этапе вы знали: где находится ваш автомобиль, сколько уже потрачено и что будет дальше.',
    bullets: null,
  },
]
```

- [ ] **Step 2: Добавить секцию timeline в JSX**

Найди комментарий `{/* Sections 2–6 will be added here */}` и замени на:

```tsx
            {/* ── Section 2: Процесс покупки ── */}
            <section
              id="protsess"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Процесс покупки
              </h2>
              <p className="font-montserrat text-base text-muted mb-10 max-w-xl">
                Процесс выстроен так, чтобы вы на каждом этапе понимали, что происходит с
                вашим автомобилем и за что вы платите.
              </p>
              <div className="flex flex-col">
                {PURCHASE_STEPS.map((step, i) => (
                  <div key={step.title} className="flex gap-5 items-start">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-muller font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      {i < PURCHASE_STEPS.length - 1 && (
                        <div className="w-[2px] flex-1 min-h-[2rem] bg-primary/20 mt-1 mb-1" />
                      )}
                    </div>
                    <div className={i < PURCHASE_STEPS.length - 1 ? 'pb-6' : ''}>
                      <h3 className="font-muller font-bold text-lg text-body mb-1 pt-1">
                        {step.title}
                      </h3>
                      <p className="font-montserrat text-sm text-muted leading-relaxed">
                        {step.text}
                      </p>
                      {step.bullets && (
                        <ul className="mt-2 flex flex-col gap-1">
                          {step.bullets.map((b) => (
                            <li
                              key={b}
                              className="font-montserrat text-sm text-muted flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sections 3–6 will be added here */}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/protsess/ProtsessPageClient.tsx
git commit -m "feat: protsess section 2 — 8-step purchase timeline"
```

---

## Task 6: Section 3 — Оплата и договор

**Files:**
- Modify: `src/app/protsess/ProtsessPageClient.tsx`

- [ ] **Step 1: Добавить данные этапов**

В `ProtsessPageClient.tsx` добавь перед `export default function`:

```tsx
const PAYMENT_STAGES = [
  {
    num: 1,
    title: 'Договор и предоплата',
    text: 'После согласования условий подписывается договор и вносится предоплата за услуги компании.',
  },
  {
    num: 2,
    title: 'Оплата автомобиля',
    text: 'После выигрыша на аукционе вы оплачиваете стоимость лота, аукционные сборы и почтовые услуги. Оплата официальная с подтверждением всех операций.',
  },
  {
    num: 3,
    title: 'Доставка',
    text: 'Оплачивается логистика: доставка по США, морская доставка, доставка в Беларусь по прибытию в порт назначения.',
  },
  {
    num: 4,
    title: 'Таможенные платежи',
    text: 'Оплата производится при оформлении авто в Республике Беларусь.',
  },
]
```

- [ ] **Step 2: Добавить секцию в JSX**

Найди `{/* Sections 3–6 will be added here */}` и замени на:

```tsx
            {/* ── Section 3: Оплата и договор ── */}
            <section
              id="oplata"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Оплата и договор
              </h2>
              <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
                Перед началом сотрудничества мы заключаем договор. Вы понимаете, за что
                платите и какие у вас есть гарантии.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {PAYMENT_STAGES.map((stage) => (
                  <div
                    key={stage.num}
                    className="bg-light-bg rounded-2xl p-6 border border-gray-100"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-muller font-bold text-xs mb-3">
                      {stage.num}
                    </span>
                    <h3 className="font-muller font-bold text-lg text-body mb-2">
                      {stage.title}
                    </h3>
                    <p className="font-montserrat text-sm text-muted leading-relaxed">
                      {stage.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
                <div className="max-w-xl">
                  <h3 className="font-muller font-bold text-2xl text-white mb-3">
                    Не обещаем «самые дешёвые авто»
                  </h3>
                  <p className="font-montserrat text-white/50 text-base mb-8 leading-relaxed">
                    Работаем так, чтобы вы рекомендовали нас своим знакомым.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/contacts"
                      className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                      Оставить заявку
                    </Link>
                    <a
                      href="https://t.me/pmcars"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3.5 rounded-xl border border-white/20 text-white font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                    >
                      Написать в Telegram
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Sections 4–6 will be added here */}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/protsess/ProtsessPageClient.tsx
git commit -m "feat: protsess section 3 — оплата и договор"
```

---

## Task 7: Section 4 — Доставка и растаможка

**Files:**
- Modify: `src/app/protsess/ProtsessPageClient.tsx`

- [ ] **Step 1: Добавить данные этапов доставки**

В `ProtsessPageClient.tsx` добавь перед `export default function`:

```tsx
const DELIVERY_STAGES = [
  {
    title: 'Доставка по США до порта',
    days: '3–10 дней',
    text: 'После покупки автомобиль отправляется с аукциона в порт. Срок зависит от расстояния до порта. На этом этапе уже формируется часть стоимости доставки.',
  },
  {
    title: 'Подготовка и погрузка',
    days: null,
    text: 'Автомобиль проходит оформление документов, готовится к отправке и загружается в контейнер. Вы получаете информацию о дате отправки.',
  },
  {
    title: 'Морская доставка',
    days: '4–6 недель',
    text: 'Автомобиль отправляется морем в Европу. Сроки зависят от загрузки портов, маршрута и сезона. После отправки вы можете отслеживать контейнер.',
  },
  {
    title: 'Доставка в Беларусь',
    days: null,
    text: 'После прибытия в транзитный порт авто выгружается, проходит транзит и доставляется в Беларусь. Мы сопровождаем процесс до момента прибытия.',
  },
  {
    title: 'Передача на таможню',
    days: null,
    text: 'Автомобиль передаётся для оформления в РБ. Подготавливаем документы, сопровождаем процесс, помогаем пройти таможню.',
  },
]
```

- [ ] **Step 2: Добавить секцию в JSX**

Найди `{/* Sections 4–6 will be added here */}` и замени на:

```tsx
            {/* ── Section 4: Доставка и растаможка ── */}
            <section
              id="dostavka"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Доставка и растаможка
              </h2>
              <p className="font-montserrat text-base text-muted mb-3 max-w-xl">
                Организуем доставку авто из США в Гомель и по всей Беларуси: от аукциона до
                получения автомобиля без лишних сложностей.
              </p>
              <p className="font-montserrat text-sm text-primary font-semibold mb-8">
                В среднем доставка занимает от 6 до 10 недель
              </p>
              <div className="flex flex-col mb-10">
                {DELIVERY_STAGES.map((stage, i) => (
                  <div key={stage.title} className="flex gap-5 items-start">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-muller font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      {i < DELIVERY_STAGES.length - 1 && (
                        <div className="w-[2px] flex-1 min-h-[2rem] bg-primary/20 mt-1 mb-1" />
                      )}
                    </div>
                    <div className={i < DELIVERY_STAGES.length - 1 ? 'pb-6' : ''}>
                      <div className="flex flex-wrap items-center gap-3 mb-1 pt-1">
                        <h3 className="font-muller font-bold text-lg text-body">
                          {stage.title}
                        </h3>
                        {stage.days && (
                          <span className="text-xs font-montserrat text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                            {stage.days}
                          </span>
                        )}
                      </div>
                      <p className="font-montserrat text-sm text-muted leading-relaxed">
                        {stage.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-light-bg rounded-2xl p-6 border border-gray-100 mb-10">
                <h3 className="font-muller font-bold text-base text-body mb-2">
                  Вы всегда знаете где ваш автомобиль
                </h3>
                <p className="font-montserrat text-sm text-muted leading-relaxed">
                  Во время доставки вы можете отслеживать статус авто, получать обновления и
                  задавать вопросы. Выбираем надёжных перевозчиков, контролируем этапы,
                  информируем без задержек.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/info/kalkulyator-rashod"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Рассчитать стоимость доставки
                </Link>
                <a
                  href="https://t.me/pmcars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl border border-gray-200 text-body font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Получить консультацию по срокам
                </a>
              </div>
            </section>

            {/* Sections 5–6 will be added here */}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/protsess/ProtsessPageClient.tsx
git commit -m "feat: protsess section 4 — доставка и растаможка"
```

---

## Task 8: Section 5 — Получение авто в РБ

**Files:**
- Modify: `src/app/protsess/ProtsessPageClient.tsx`

- [ ] **Step 1: Добавить секцию в JSX**

Найди `{/* Sections 5–6 will be added here */}` и замени на:

```tsx
            {/* ── Section 5: Получение авто в РБ ── */}
            <section
              id="poluchenie"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Получение авто в РБ
              </h2>
              <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
                Все автомобили доставляются на СВХ (склад временного хранения) в Гомеле или
                Минске. Именно здесь автомобиль выгружается, проходит таможенное оформление и
                передаётся вам.
              </p>
              <div className="bg-light-bg rounded-2xl p-6 border border-gray-100 mb-8 max-w-xl">
                <p className="font-montserrat text-sm text-muted leading-relaxed">
                  Вы не остаётесь один на этапе получения автомобиля. Мы сопровождаем и
                  подсказываем до момента, пока вы не заберёте авто.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/info/kalkulyator-rashod"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Рассчитать стоимость авто под ключ
                </Link>
                <a
                  href="https://t.me/pmcars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl border border-gray-200 text-body font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Получить консультацию
                </a>
              </div>
            </section>

            {/* Section 6 will be added here */}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/protsess/ProtsessPageClient.tsx
git commit -m "feat: protsess section 5 — получение авто в РБ"
```

---

## Task 9: Section 6 — Полезная информация (accordion)

Используем компонент `Accordion` из `src/components/ui/Accordion.tsx` (уже расширен в Task 1).

**Files:**
- Modify: `src/app/protsess/ProtsessPageClient.tsx`

- [ ] **Step 1: Добавить импорт Accordion**

В начало файла `ProtsessPageClient.tsx`, после остальных импортов:

```tsx
import Accordion from '@/components/ui/Accordion'
```

- [ ] **Step 2: Добавить данные аккордеона**

В `ProtsessPageClient.tsx` добавь перед `export default function`:

```tsx
const INFO_ITEMS = [
  {
    question: 'С чего начинается покупка',
    answer: (
      <p>
        Первый шаг — понять что именно вы ищете: конкретная модель или лот, автомобиль под
        определённый бюджет, авто для себя или для перепродажи. Мы помогаем определить
        оптимальный вариант и объясняем на что реально можно рассчитывать. Оптимальный
        возраст авто — до 5 лет, минимальный бюджет «под ключ» — от $13 000.
      </p>
    ),
  },
  {
    question: 'Из чего складывается итоговая стоимость',
    answer: (
      <>
        <p className="mb-2">Цена автомобиля из США — это не только стоимость на аукционе. В итог входят:</p>
        <ul className="flex flex-col gap-1">
          {[
            'стоимость лота',
            'комиссия аукциона',
            'доставка по США',
            'морская доставка',
            'доставка в Беларусь',
            'таможенные платежи',
            'утильсбор, оформление, хранение',
            'ремонт',
            'услуги компании',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-2">Мы сразу считаем полную стоимость, чтобы не было «доплат по ходу».</p>
      </>
    ),
  },
  {
    question: 'Как строится маршрут доставки',
    answer: (
      <>
        <p className="mb-3">Маршрут зависит от объёма двигателя автомобиля:</p>
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-body">До 1.5 литра</span>
            <p className="mt-0.5">Контейнер доставляется в порт Клайпеда (Литва), затем авто перегружается на автовоз и доставляется на СВХ в Гомель или Минск.</p>
          </div>
          <div>
            <span className="font-semibold text-body">Более 1.5 литра</span>
            <p className="mt-0.5">Автомобиль направляется через порт Поти (Грузия), далее перегружается на автовоз и доставляется в Гомель или Минск.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    question: 'Льготная растаможка — 140 указ',
    answer: (
      <>
        <p className="mb-2">
          В Беларуси есть возможность снизить таможенные платежи на 50%. Льготой может
          воспользоваться категория граждан РБ, имеющая инвалидность 1–2 группы, а также
          многодетные семьи.
        </p>
        <ul className="flex flex-col gap-1 mb-2">
          {[
            'Требуется подтверждающий документ',
            'Воспользоваться можно 1 раз в год',
            'Ограничений на дальнейшую продажу нет',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted/70">
          Использование на постоянной основе в коммерческих целях может повлечь вопросы со
          стороны контролирующих органов.
        </p>
      </>
    ),
  },
  {
    question: 'Реальные риски при покупке без опыта',
    answer: (
      <>
        <p className="mb-2">Без опыта можно столкнуться с ситуациями:</p>
        <ul className="flex flex-col gap-1 mb-3">
          {[
            'авто невозможно растаможить в РБ',
            'автомобиль нельзя вывезти из США',
            'серьёзные скрытые повреждения',
            'участие в сильных ДТП или наводнениях',
            'скрученный пробег',
            'завышенная цена',
            'ошибки в расчёте таможни',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          Мы проверяем историю авто (CARFAX), анализируем повреждения, оцениваем
          целесообразность покупки и отсекаем проблемные варианты.
        </p>
      </>
    ),
  },
]
```

- [ ] **Step 3: Добавить секцию в JSX**

Найди `{/* Section 6 will be added here */}` и замени на:

```tsx
            {/* ── Section 6: Полезная информация ── */}
            <section id="info" className="pb-14 md:pb-16">
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Полезная информация
              </h2>
              <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
                Коротко и по делу — чтобы вы понимали как всё устроено и не сталкивались с
                неприятными сюрпризами.
              </p>
              <div className="mb-10">
                <Accordion items={INFO_ITEMS} />
              </div>
              <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
                <div className="max-w-xl">
                  <h3 className="font-muller font-bold text-2xl text-white mb-3">
                    Остались вопросы?
                  </h3>
                  <p className="font-montserrat text-white/50 text-base mb-8 leading-relaxed">
                    Расскажем подробнее, поможем рассчитать стоимость под ваш бюджет и
                    подберём подходящий вариант.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/contacts"
                      className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                      Получить консультацию
                    </Link>
                    <Link
                      href="/info/kalkulyator-rashod"
                      className="inline-flex items-center px-6 py-3.5 rounded-xl border border-white/20 text-white font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                    >
                      Рассчитать стоимость
                    </Link>
                  </div>
                </div>
              </div>
            </section>
```

- [ ] **Step 4: Запустить тест — должен пройти**

```bash
npx jest protsess --no-coverage 2>&1 | tail -20
```

Ожидаемый результат: `PASS __tests__/protsess.test.tsx`

- [ ] **Step 5: Проверить сборку**

```bash
npm run build 2>&1 | tail -20
```

Ожидаемый результат: `✓ Compiled successfully`

- [ ] **Step 6: Commit**

```bash
git add src/app/protsess/ProtsessPageClient.tsx
git commit -m "feat: protsess section 6 — полезная информация (accordion)"
```

---

## Task 10: Final verification

- [ ] **Step 1: Запустить все тесты**

```bash
npm test -- --no-coverage 2>&1 | tail -30
```

Ожидаемый результат: все тесты проходят, нет регрессий.

- [ ] **Step 2: Проверить production build**

```bash
npm run build 2>&1 | grep -E "(error|Error|✓|✗|Route)" | head -30
```

Ожидаемый результат: `✓ /protsess` присутствует в списке роутов, нет ошибок.

- [ ] **Step 3: Визуальная проверка в dev-режиме**

```bash
npm run dev
```

Проверить:
- [ ] Пункт «Процесс покупки» появился в десктопном меню между «Доставка» и «Информация»
- [ ] Пункт «Процесс покупки» появился в мобильном меню
- [ ] Страница `/protsess` открывается
- [ ] Все 6 секций отображаются
- [ ] Правый сайдбар виден на xl-экране
- [ ] При скролле активный пункт сайдбара меняется
- [ ] На мобильном сайдбар скрыт
- [ ] Клик по ссылке в сайдбаре скроллит к нужной секции

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: /protsess page — процесс покупки авто из США"
```
