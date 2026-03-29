# pmcars.by Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Многостраничный корпоративный сайт pmcars.by — импорт авто из США в Беларусь.

**Architecture:** Next.js 14 App Router + TypeScript + Tailwind CSS. Статический сайт без CMS и бэкенда (кроме формы контактов через mailto/telegram). Таможенный калькулятор работает полностью на фронте.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v3, next/font/local (Muller + Montserrat), Lucide React (иконки), Jest + React Testing Library.

---

## Файловая структура

```
/Users/test/Desktop/Cars/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout: Header + Footer
│   │   ├── page.tsx                    # Главная (11 секций)
│   │   ├── globals.css
│   │   ├── uslugi/page.tsx
│   │   ├── dostavka/page.tsx
│   │   ├── tracking/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── oferta/page.tsx
│   │   ├── contacts/page.tsx
│   │   └── info/
│   │       ├── kalkulyator/page.tsx
│   │       ├── epts/page.tsx
│   │       ├── dkp/page.tsx
│   │       └── snyatie/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Accordion.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── TariffsSection.tsx
│   │       ├── StatsSection.tsx
│   │       ├── AdvantagesSection.tsx
│   │       ├── PartnersSection.tsx
│   │       ├── HowItWorksSection.tsx
│   │       ├── ServicesSection.tsx
│   │       ├── TeamSection.tsx
│   │       ├── VideoReviewsSection.tsx
│   │       ├── FaqSection.tsx
│   │       └── CtaSection.tsx
│   └── lib/
│       └── calculator.ts               # Чистые функции расчёта пошлины
├── __tests__/
│   └── calculator.test.ts
├── public/
│   ├── logo.svg                        # уже есть
│   └── fonts/
│       ├── Muller-Regular.ttf
│       ├── Muller-Bold.ttf
│       ├── MullerLight.ttf
│       ├── MullerMedium.ttf
│       ├── Montserrat-Regular.ttf
│       └── Montserrat-Bold.ttf
├── tailwind.config.ts
├── next.config.ts
├── jest.config.ts
├── jest.setup.ts
└── claude.md
```

---

## PHASE 1: Фундамент

### Task 1: Next.js проект + зависимости

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`

- [ ] **Step 1: Инициализировать проект**

```bash
cd /Users/test/Desktop/Cars
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Ответить на вопросы: Yes на все предложенные опции.

- [ ] **Step 2: Установить дополнительные зависимости**

```bash
npm install lucide-react
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest @types/jest
```

- [ ] **Step 3: Создать jest.config.ts**

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

- [ ] **Step 4: Создать jest.setup.ts**

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Добавить тест-скрипт в package.json**

В `package.json` добавить в `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 6: Скопировать шрифты**

```bash
mkdir -p /Users/test/Desktop/Cars/public/fonts
cp /Users/test/Desktop/Cars/references/autogroup.by/autogroup.by/local/templates/autogroup/assets/font/Muller-Regular.ttf /Users/test/Desktop/Cars/public/fonts/
cp /Users/test/Desktop/Cars/references/autogroup.by/autogroup.by/local/templates/autogroup/assets/font/Muller-Bold.ttf /Users/test/Desktop/Cars/public/fonts/
cp /Users/test/Desktop/Cars/references/autogroup.by/autogroup.by/local/templates/autogroup/assets/font/MullerLight.ttf /Users/test/Desktop/Cars/public/fonts/
cp /Users/test/Desktop/Cars/references/autogroup.by/autogroup.by/local/templates/autogroup/assets/font/MullerMedium.ttf /Users/test/Desktop/Cars/public/fonts/
cp /Users/test/Desktop/Cars/references/autogroup.by/autogroup.by/local/templates/autogroup/assets/font/Montserrat-Regular.ttf /Users/test/Desktop/Cars/public/fonts/
cp /Users/test/Desktop/Cars/references/autogroup.by/autogroup.by/local/templates/autogroup/assets/font/Montserrat-Bold.ttf /Users/test/Desktop/Cars/public/fonts/
```

- [ ] **Step 7: Commit**

```bash
git init && git add -A && git commit -m "feat: init Next.js project with Tailwind and Jest"
```

---

### Task 2: Дизайн-токены (Tailwind + шрифты + globals)

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Обновить tailwind.config.ts**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00ACB8',
        'primary-dark': '#008f99',
        'dark-bg': '#0d1117',
        'dark-card': '#111827',
        'dark-card2': '#1a2332',
        'text-main': '#333333',
        'text-muted': '#888888',
        'light-bg': '#f9f9f9',
      },
      fontFamily: {
        muller: ['var(--font-muller)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      container: {
        center: true,
        padding: { DEFAULT: '1rem', lg: '2rem' },
        screens: { xl: '1280px' },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Обновить src/app/globals.css**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: 'Muller';
  src: url('/fonts/MullerLight.ttf') format('truetype');
  font-weight: 300;
  font-display: swap;
}
@font-face {
  font-family: 'Muller';
  src: url('/fonts/Muller-Regular.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Muller';
  src: url('/fonts/MullerMedium.ttf') format('truetype');
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: 'Muller';
  src: url('/fonts/Muller-Bold.ttf') format('truetype');
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/Montserrat-Regular.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/Montserrat-Bold.ttf') format('truetype');
  font-weight: 700;
  font-display: swap;
}

:root {
  --font-muller: 'Muller', sans-serif;
  --font-montserrat: 'Montserrat', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-montserrat);
  color: #333333;
  background: #ffffff;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-muller);
}

html { scroll-behavior: smooth; }
```

- [ ] **Step 3: Проверить что dev-сервер запускается**

```bash
npm run dev
```

Открыть http://localhost:3000 — должна открыться базовая страница Next.js.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add design tokens, fonts, tailwind config"
```

---

### Task 3: Компонент Header

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/MobileMenu.tsx`

- [ ] **Step 1: Создать MobileMenu.tsx**

```tsx
// src/components/layout/MobileMenu.tsx
'use client'
import { X } from 'lucide-react'
import Link from 'next/link'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { label: 'Услуги', href: '/uslugi' },
  { label: 'Доставка из США', href: '/dostavka' },
  {
    label: 'Информация',
    children: [
      { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
      { label: 'ЭПТС', href: '/info/epts' },
      { label: 'ДКП', href: '/info/dkp' },
      { label: 'Снятие с учёта', href: '/info/snyatie' },
    ],
  },
  { label: 'FAQ', href: '/faq' },
  { label: 'Контакты', href: '/contacts' },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-dark-bg flex flex-col">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-white p-2">
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-6 py-4">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block py-3 px-4 text-white text-lg font-montserrat border-b border-white/10 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <span className="block py-3 px-4 text-white/50 text-xs uppercase tracking-widest font-montserrat">
                    {item.label}
                  </span>
                  <ul>
                    {item.children?.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className="block py-2 px-6 text-white/80 font-montserrat hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
          <li>
            <Link
              href="/tracking"
              onClick={onClose}
              className="block py-3 px-4 text-center mt-4 bg-primary text-white font-montserrat font-bold rounded"
            >
              Отслеживание авто
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-6 border-t border-white/10">
        <a href="tel:+375XXXXXXXXX" className="block text-primary text-xl font-bold font-montserrat mb-3">
          +375 (XX) XXX-XX-XX
        </a>
        <div className="flex gap-4">
          <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary text-sm">TG</a>
          <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary text-sm">WA</a>
          <a href="viber://chat?number=+375XXXXXXXXX" className="text-white/70 hover:text-primary text-sm">Viber</a>
        </div>
      </div>
    </div>
  )
}
```

> **Замечание:** Заменить `+375XXXXXXXXX` и `https://t.me/pmcars` на реальные контакты.

- [ ] **Step 2: Создать Header.tsx**

```tsx
// src/components/layout/Header.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown } from 'lucide-react'
import MobileMenu from './MobileMenu'

const infoLinks = [
  { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
  { label: 'ЭПТС', href: '/info/epts' },
  { label: 'ДКП', href: '/info/dkp' },
  { label: 'Снятие с учёта', href: '/info/snyatie' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-shadow ${
          scrolled ? 'shadow-lg shadow-black/30' : ''
        }`}
      >
        {/* Топбар */}
        <div className="bg-[#0a0e15] border-b border-white/5">
          <div className="container flex items-center justify-between py-2 text-xs font-montserrat">
            <a href="tel:+375XXXXXXXXX" className="text-primary font-bold hover:text-primary-dark transition-colors">
              +375 (XX) XXX-XX-XX
            </a>
            <div className="hidden sm:flex items-center gap-4 text-white/60">
              <div className="flex gap-3">
                <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TG</a>
                <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WA</a>
                <a href="viber://chat?number=+375XXXXXXXXX" className="hover:text-primary transition-colors">Viber</a>
              </div>
              <span className="text-white/30">|</span>
              <span>10:00–20:00</span>
              <Link
                href="/tracking"
                className="bg-primary text-white px-3 py-1 rounded text-xs font-bold hover:bg-primary-dark transition-colors"
              >
                Отслеживание авто
              </Link>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <div className="bg-dark-bg">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.svg" alt="pmcars.by" width={140} height={33} priority />
            </Link>

            {/* Десктоп-навигация */}
            <nav className="hidden xl:flex items-center gap-6 font-montserrat text-sm">
              <Link href="/uslugi" className="text-white/80 hover:text-primary transition-colors">
                Услуги
              </Link>
              <Link href="/dostavka" className="text-white/80 hover:text-primary transition-colors">
                Доставка из США
              </Link>

              {/* Dropdown Информация */}
              <div
                className="relative"
                onMouseEnter={() => setInfoOpen(true)}
                onMouseLeave={() => setInfoOpen(false)}
              >
                <button className="flex items-center gap-1 text-white/80 hover:text-primary transition-colors">
                  Информация <ChevronDown size={14} className={`transition-transform ${infoOpen ? 'rotate-180' : ''}`} />
                </button>
                {infoOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-dark-card border border-white/10 rounded shadow-xl min-w-[220px]">
                    {infoLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2.5 text-white/70 hover:text-primary hover:bg-white/5 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/faq" className="text-white/80 hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link href="/contacts" className="text-white/80 hover:text-primary transition-colors">
                Контакты
              </Link>
            </nav>

            {/* Бургер (мобайл) */}
            <button
              className="xl:hidden text-white p-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
```

- [ ] **Step 3: Проверить визуально**

```bash
npm run dev
```

Открыть http://localhost:3000 — должен отображаться тёмный хедер с двумя строками и логотипом.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Header and MobileMenu components"
```

---

### Task 4: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Создать Footer.tsx**

```tsx
// src/components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'

const navColumns = [
  {
    title: 'Компания',
    links: [
      { label: 'Услуги', href: '/uslugi' },
      { label: 'Доставка из США', href: '/dostavka' },
      { label: 'Контакты', href: '/contacts' },
    ],
  },
  {
    title: 'Информация',
    links: [
      { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
      { label: 'ЭПТС', href: '/info/epts' },
      { label: 'ДКП', href: '/info/dkp' },
      { label: 'Снятие с учёта', href: '/info/snyatie' },
    ],
  },
  {
    title: 'Клиентам',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Отслеживание авто', href: '/tracking' },
      { label: 'Договор оферты', href: '/oferta' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#080d12] text-white/60 font-montserrat">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Лого + контакты */}
          <div>
            <Link href="/">
              <Image src="/logo.svg" alt="pmcars.by" width={120} height={28} className="mb-4" />
            </Link>
            <a href="tel:+375XXXXXXXXX" className="block text-primary font-bold text-base mb-2 hover:text-primary-dark">
              +375 (XX) XXX-XX-XX
            </a>
            <div className="flex gap-3 text-sm">
              <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TG</a>
              <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WA</a>
              <a href="viber://chat?number=+375XXXXXXXXX" className="hover:text-primary transition-colors">Viber</a>
            </div>
            <p className="text-xs mt-3 text-white/30">Минск, Беларусь</p>
          </div>

          {/* Навигация */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-muller">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/30">
          <span>© {new Date().getFullYear()} pmcars.by — Все права защищены</span>
          <div className="flex gap-4">
            <Link href="/oferta" className="hover:text-primary transition-colors">Договор оферты</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add Footer component"
```

---

### Task 5: Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Обновить layout.tsx**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Авто из США в Беларусь под ключ | pmcars.by',
    template: '%s | pmcars.by',
  },
  description: 'Импорт автомобилей из США в Беларусь под ключ. Подбор на аукционах Copart и IAAI, доставка, растаможка, официальный договор. Без скрытых комиссий.',
  metadataBase: new URL('https://pmcars.by'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main className="pt-[88px]">{/* 88px = высота хедера */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

> **Замечание:** `pt-[88px]` — примерная высота хедера (топбар ~36px + навигация ~52px). После разработки хедера уточнить реальную высоту и обновить.

- [ ] **Step 2: Проверить**

```bash
npm run dev
```

Открыть http://localhost:3000 — хедер и футер должны отображаться на каждой странице.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: root layout with Header and Footer"
```

---

## PHASE 2: UI-компоненты

### Task 6: Button + Accordion

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Accordion.tsx`

- [ ] **Step 1: Создать Button.tsx**

```tsx
// src/components/ui/Button.tsx
import { ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'outline'
  href?: string
  size?: 'sm' | 'md' | 'lg'
}

const base = 'inline-flex items-center justify-center font-montserrat font-bold rounded transition-colors'
const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
}
const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls} {...props}>{children}</button>
}
```

- [ ] **Step 2: Написать тест для Accordion перед реализацией**

```typescript
// __tests__/Accordion.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Accordion from '@/components/ui/Accordion'

const items = [
  { question: 'Сколько стоит доставка?', answer: 'От 990 BYN.' },
  { question: 'Какие сроки?', answer: '2–3 месяца.' },
]

test('renders all questions', () => {
  render(<Accordion items={items} />)
  expect(screen.getByText('Сколько стоит доставка?')).toBeInTheDocument()
  expect(screen.getByText('Какие сроки?')).toBeInTheDocument()
})

test('answer hidden by default', () => {
  render(<Accordion items={items} />)
  expect(screen.queryByText('От 990 BYN.')).not.toBeVisible()
})

test('clicking question shows answer', () => {
  render(<Accordion items={items} />)
  fireEvent.click(screen.getByText('Сколько стоит доставка?'))
  expect(screen.getByText('От 990 BYN.')).toBeVisible()
})

test('clicking open question closes it', () => {
  render(<Accordion items={items} />)
  fireEvent.click(screen.getByText('Сколько стоит доставка?'))
  fireEvent.click(screen.getByText('Сколько стоит доставка?'))
  expect(screen.queryByText('От 990 BYN.')).not.toBeVisible()
})
```

- [ ] **Step 3: Запустить тест — убедиться что падает**

```bash
npm test -- --testPathPattern=Accordion
```

Ожидаемо: FAIL — `Cannot find module '@/components/ui/Accordion'`

- [ ] **Step 4: Создать Accordion.tsx**

```tsx
// src/components/ui/Accordion.tsx
'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  question: string
  answer: string
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
            className="w-full flex justify-between items-center py-4 px-0 text-left font-montserrat font-bold text-text-main hover:text-primary transition-colors"
            aria-expanded={openIndex === i}
          >
            <span>{item.question}</span>
            <ChevronDown
              size={18}
              className={`flex-shrink-0 ml-4 text-primary transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-4' : 'max-h-0'}`}
            aria-hidden={openIndex !== i}
          >
            <p className="text-text-muted font-montserrat text-sm leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Запустить тест — убедиться что проходит**

```bash
npm test -- --testPathPattern=Accordion
```

Ожидаемо: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Button and Accordion UI components"
```

---

## PHASE 3: Таможенный калькулятор (логика)

### Task 7: Логика расчёта пошлины

**Files:**
- Create: `src/lib/calculator.ts`
- Create: `__tests__/calculator.test.ts`

- [ ] **Step 1: Написать тесты**

```typescript
// __tests__/calculator.test.ts
import {
  calculateDutyUnder3Years,
  calculateDuty3To5Years,
  calculateDutyOver5Years,
  calculateDutyMoto,
  calculateTotal,
  type CalculatorInput,
} from '@/lib/calculator'

describe('calculateDutyUnder3Years', () => {
  test('стоимость <= 8500, маленький объём (побеждает процент)', () => {
    // 5000 * 0.54 = 2700; 1200 * 2.5 = 3000 → max = 3000
    expect(calculateDutyUnder3Years(5000, 1200)).toBe(3000)
  })

  test('стоимость <= 8500, большой объём (побеждает объём)', () => {
    // 8000 * 0.54 = 4320; 2500 * 2.5 = 6250 → max = 6250
    expect(calculateDutyUnder3Years(8000, 2500)).toBe(6250)
  })

  test('стоимость > 8500 (ставка 48%)', () => {
    // 10000 * 0.48 = 4800; 1000 * 3.5 = 3500 → max = 4800
    expect(calculateDutyUnder3Years(10000, 1000)).toBe(4800)
  })

  test('стоимость > 169000 (макс ставка по объёму)', () => {
    // 200000 * 0.48 = 96000; 3500 * 20 = 70000 → max = 96000
    expect(calculateDutyUnder3Years(200000, 3500)).toBe(96000)
  })
})

describe('calculateDuty3To5Years', () => {
  test('объём <= 1000', () => expect(calculateDuty3To5Years(1000)).toBe(1500))
  test('объём <= 1500', () => expect(calculateDuty3To5Years(1500)).toBe(2550))
  test('объём <= 1800', () => expect(calculateDuty3To5Years(1800)).toBe(4500))
  test('объём <= 2300', () => expect(calculateDuty3To5Years(2000)).toBe(5400))
  test('объём <= 3000', () => expect(calculateDuty3To5Years(2500)).toBe(7500))
  test('объём > 3000',  () => expect(calculateDuty3To5Years(3500)).toBe(12600))
})

describe('calculateDutyOver5Years', () => {
  test('объём <= 1000', () => expect(calculateDutyOver5Years(1000)).toBe(3000))
  test('объём <= 1500', () => expect(calculateDutyOver5Years(1200)).toBe(3840))
  test('объём > 3000',  () => expect(calculateDutyOver5Years(4000)).toBe(22800))
})

describe('calculateDutyMoto', () => {
  test('объём <= 800', () => {
    // firstIndicator = 5000 * 0.15 = 750; second = (5000 + 750) * 0.2 = 1150; total = 1900
    expect(calculateDutyMoto(5000, 800)).toBe(1900)
  })
  test('объём > 800', () => {
    // firstIndicator = 5000 * 0.10 = 500; second = (5000 + 500) * 0.2 = 1100; total = 1600
    expect(calculateDutyMoto(5000, 1000)).toBe(1600)
  })
})

describe('calculateTotal', () => {
  test('электромобиль — пошлина 0', () => {
    const input: CalculatorInput = {
      carCost: 20000,
      engineVolume: 0,
      carType: 'auto',
      engineType: 'electric',
      carAge: 'under3',
      decree140: false,
      eurRate: 3.38,
    }
    const result = calculateTotal(input)
    expect(result.duty).toBe(0)
    expect(result.total).toBeGreaterThan(0) // сборы всё равно есть
  })

  test('указ 140 делит пошлину на 2', () => {
    const base: CalculatorInput = {
      carCost: 10000, engineVolume: 2000, carType: 'auto',
      engineType: 'ice', carAge: 'under3', decree140: false, eurRate: 3.38,
    }
    const with140: CalculatorInput = { ...base, decree140: true }
    const r1 = calculateTotal(base)
    const r2 = calculateTotal(with140)
    expect(r2.duty).toBeCloseTo(r1.duty / 2, 2)
  })

  test('итог = сумма всех компонентов', () => {
    const input: CalculatorInput = {
      carCost: 15000, engineVolume: 2000, carType: 'auto',
      engineType: 'ice', carAge: '3to5', decree140: false, eurRate: 3.38,
    }
    const r = calculateTotal(input)
    expect(r.total).toBeCloseTo(r.duty + r.customsFee + r.recyclingFee + r.eptsFee, 2)
  })
})
```

- [ ] **Step 2: Запустить — убедиться что падает**

```bash
npm test -- --testPathPattern=calculator
```

Ожидаемо: FAIL — `Cannot find module '@/lib/calculator'`

- [ ] **Step 3: Создать calculator.ts**

```typescript
// src/lib/calculator.ts

export interface CalculatorInput {
  carCost: number        // в EUR
  engineVolume: number   // в куб. см
  carType: 'auto' | 'moto'
  engineType: 'ice' | 'electric'
  carAge: 'under3' | '3to5' | 'over5'
  decree140: boolean
  eurRate: number        // курс BYN/EUR от НБРБ
}

export interface CalculatorResult {
  carCost: number
  duty: number
  customsFee: number
  recyclingFee: number
  eptsFee: number
  total: number
}

// Константы в BYN
const CUSTOMS_FEE_BYN = 120
const EPTS_FEE_BYN = 70
const RECYCLING_FEE_UNDER_3_BYN = 544
const RECYCLING_FEE_OVER_3_BYN = 1089

export function calculateDutyUnder3Years(carCost: number, engineVolume: number): number {
  const byPrice = carCost <= 8500 ? carCost * 0.54 : carCost * 0.48

  let byEngine: number
  if (carCost <= 8500)        byEngine = engineVolume * 2.5
  else if (carCost <= 16700)  byEngine = engineVolume * 3.5
  else if (carCost <= 42300)  byEngine = engineVolume * 5.5
  else if (carCost <= 84500)  byEngine = engineVolume * 7.5
  else if (carCost <= 169000) byEngine = engineVolume * 15
  else                        byEngine = engineVolume * 20

  return Math.max(byPrice, byEngine)
}

export function calculateDuty3To5Years(engineVolume: number): number {
  if (engineVolume <= 1000) return engineVolume * 1.5
  if (engineVolume <= 1500) return engineVolume * 1.7
  if (engineVolume <= 1800) return engineVolume * 2.5
  if (engineVolume <= 2300) return engineVolume * 2.7
  if (engineVolume <= 3000) return engineVolume * 3.0
  return engineVolume * 3.6
}

export function calculateDutyOver5Years(engineVolume: number): number {
  if (engineVolume <= 1000) return engineVolume * 3.0
  if (engineVolume <= 1500) return engineVolume * 3.2
  if (engineVolume <= 1800) return engineVolume * 3.5
  if (engineVolume <= 2300) return engineVolume * 4.8
  if (engineVolume <= 3000) return engineVolume * 5.0
  return engineVolume * 5.7
}

export function calculateDutyMoto(carCost: number, engineVolume: number): number {
  const first = engineVolume <= 800 ? carCost * 0.15 : carCost * 0.10
  const second = (carCost + first) * 0.2
  return first + second
}

export function calculateTotal(input: CalculatorInput): CalculatorResult {
  const { carCost, engineVolume, carType, engineType, carAge, decree140, eurRate } = input

  let duty = 0

  if (engineType !== 'electric') {
    if (carType === 'moto') {
      duty = calculateDutyMoto(carCost, engineVolume)
    } else {
      if (carAge === 'under3') duty = calculateDutyUnder3Years(carCost, engineVolume)
      else if (carAge === '3to5') duty = calculateDuty3To5Years(engineVolume)
      else duty = calculateDutyOver5Years(engineVolume)
    }
  }

  if (decree140) duty /= 2

  const bynToEur = 1 / eurRate
  const customsFee = CUSTOMS_FEE_BYN * bynToEur
  const eptsFee = EPTS_FEE_BYN * bynToEur
  const recyclingFee = carType === 'moto'
    ? 0
    : (carAge === 'under3' ? RECYCLING_FEE_UNDER_3_BYN : RECYCLING_FEE_OVER_3_BYN) * bynToEur

  const total = duty + customsFee + recyclingFee + eptsFee

  return { carCost, duty, customsFee, recyclingFee, eptsFee, total }
}
```

- [ ] **Step 4: Запустить тесты — убедиться что проходят**

```bash
npm test -- --testPathPattern=calculator
```

Ожидаемо: PASS (все тесты зелёные)

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: customs calculator pure logic with full test coverage"
```

---

## PHASE 4: Главная страница

### Task 8: Hero-секция

**Files:**
- Create: `src/components/sections/HeroSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Создать HeroSection.tsx**

```tsx
// src/components/sections/HeroSection.tsx
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-dark-bg via-[#0f1f2e] to-dark-bg min-h-[600px] flex items-center">
      {/* Декоративная линия снизу */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/40" />

      <div className="container py-20">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
            Авто из США в Беларусь
          </p>
          <h1 className="font-muller font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Пригоняем под&nbsp;ключ
          </h1>
          <p className="text-white/60 font-montserrat text-lg mb-8 leading-relaxed">
            Подбор на аукционах Copart и IAAI, доставка морем, растаможка и постановка на учёт.
            Официальный договор, без скрытых комиссий.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/info/kalkulyator" size="lg">
              Рассчитать стоимость
            </Button>
            <Button href="/contacts" variant="outline" size="lg">
              Получить консультацию
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Обновить src/app/page.tsx**

```tsx
// src/app/page.tsx
import HeroSection from '@/components/sections/HeroSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
    </>
  )
}
```

- [ ] **Step 3: Проверить визуально**

```bash
npm run dev
```

Открыть http://localhost:3000 — тёмный hero с заголовком и двумя кнопками.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: hero section"
```

---

### Task 9: TariffsSection + StatsSection + AdvantagesSection

**Files:**
- Create: `src/components/sections/TariffsSection.tsx`
- Create: `src/components/sections/StatsSection.tsx`
- Create: `src/components/sections/AdvantagesSection.tsx`

- [ ] **Step 1: Создать TariffsSection.tsx**

```tsx
// src/components/sections/TariffsSection.tsx
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'

const tariffs = [
  {
    title: 'Минск и область',
    price: '990 BYN',
    features: [
      'Подбор авто на аукционе',
      'Участие в торгах',
      'Доставка до Минска',
      'Помощь с документами',
    ],
    highlighted: false,
  },
  {
    title: 'Регионы Беларуси',
    price: '690 BYN',
    features: [
      'Подбор авто на аукционе',
      'Участие в торгах',
      'Доставка до г. Минска',
      'Помощь с документами',
    ],
    highlighted: true,
  },
  {
    title: 'Мото / квадроцикл',
    price: '495 BYN',
    features: [
      'Подбор мотоцикла / квадроцикла',
      'Участие в торгах',
      'Доставка до Минска',
      'Помощь с документами',
    ],
    highlighted: false,
  },
]

export default function TariffsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-text-main text-center mb-4">
          Стоимость услуги
        </h2>
        <p className="text-text-muted font-montserrat text-center mb-12 max-w-xl mx-auto">
          Фиксированная стоимость без скрытых платежей. Вы платите только за нашу работу — всё остальное по фактическим затратам.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tariffs.map((t) => (
            <div
              key={t.title}
              className={`rounded-xl p-8 flex flex-col border-2 transition-all ${
                t.highlighted
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-gray-100 bg-light-bg'
              }`}
            >
              {t.highlighted && (
                <span className="text-xs font-montserrat font-bold text-primary uppercase tracking-widest mb-3">
                  Популярный
                </span>
              )}
              <h3 className="font-muller font-bold text-xl text-text-main mb-2">{t.title}</h3>
              <p className="text-3xl font-muller font-bold text-primary mb-6">{t.price}</p>
              <ul className="flex flex-col gap-2 mb-8 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-montserrat text-sm text-text-muted">
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
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Создать StatsSection.tsx**

```tsx
// src/components/sections/StatsSection.tsx
const stats = [
  { value: '500+', label: 'авто доставлено' },
  { value: '5 лет', label: 'на рынке' },
  { value: '0', label: 'скрытых комиссий' },
  { value: '2–3 мес', label: 'средний срок доставки' },
]

export default function StatsSection() {
  return (
    <section className="bg-dark-bg py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-muller font-bold text-3xl md:text-4xl text-primary mb-1">{s.value}</p>
              <p className="font-montserrat text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Создать AdvantagesSection.tsx**

```tsx
// src/components/sections/AdvantagesSection.tsx
import { ShieldCheck, Users, FileText, Star, MapPin, Wrench } from 'lucide-react'

const advantages = [
  {
    icon: Star,
    title: 'Только США',
    text: 'Специализируемся исключительно на рынке США. Знаем аукционы Copart и IAAI изнутри.',
  },
  {
    icon: ShieldCheck,
    title: 'Официальный договор',
    text: 'Заключаем договор с каждым клиентом. Ваши деньги защищены юридически.',
  },
  {
    icon: FileText,
    title: 'Прозрачные расходы',
    text: 'Показываем все платежи заранее. Никаких скрытых комиссий — только фактические затраты.',
  },
  {
    icon: Wrench,
    title: 'Команда автомобилистов',
    text: 'Наши специалисты разбираются в автомобилях — поможем выбрать правильный лот.',
  },
  {
    icon: Users,
    title: 'Индивидуальный подход',
    text: 'Работаем на качество, а не на количество. Ведём вас на каждом этапе.',
  },
  {
    icon: MapPin,
    title: 'Работаем по всей РБ',
    text: 'Клиенты из всех регионов Беларуси. Специальные условия для регионов.',
  },
]

export default function AdvantagesSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-text-main text-center mb-12">
          Почему выбирают нас
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((a) => (
            <div key={a.title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <a.icon size={32} className="text-primary mb-4" />
              <h3 className="font-muller font-bold text-lg text-text-main mb-2">{a.title}</h3>
              <p className="font-montserrat text-sm text-text-muted leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Добавить секции на главную**

```tsx
// src/app/page.tsx
import HeroSection from '@/components/sections/HeroSection'
import TariffsSection from '@/components/sections/TariffsSection'
import StatsSection from '@/components/sections/StatsSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TariffsSection />
      <StatsSection />
      <AdvantagesSection />
    </>
  )
}
```

- [ ] **Step 5: Проверить визуально, commit**

```bash
npm run dev  # проверить http://localhost:3000
git add -A && git commit -m "feat: tariffs, stats, advantages sections"
```

---

### Task 10: PartnersSection + HowItWorksSection + ServicesSection

**Files:**
- Create: `src/components/sections/PartnersSection.tsx`
- Create: `src/components/sections/HowItWorksSection.tsx`
- Create: `src/components/sections/ServicesSection.tsx`

- [ ] **Step 1: Создать PartnersSection.tsx**

```tsx
// src/components/sections/PartnersSection.tsx
export default function PartnersSection() {
  return (
    <section className="bg-dark-bg py-12">
      <div className="container">
        <p className="text-center text-white/30 font-montserrat text-xs uppercase tracking-widest mb-8">
          Работаем напрямую с крупнейшими аукционами США
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/5 border border-white/10 rounded-xl px-10 py-5">
              <span className="font-muller font-bold text-white text-2xl tracking-widest">COPART</span>
            </div>
            <span className="text-white/30 text-xs font-montserrat">Крупнейший авто-аукцион США</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/5 border border-white/10 rounded-xl px-10 py-5">
              <span className="font-muller font-bold text-white text-2xl tracking-widest">IAAI</span>
            </div>
            <span className="text-white/30 text-xs font-montserrat">Insurance Auto Auctions</span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Создать HowItWorksSection.tsx**

```tsx
// src/components/sections/HowItWorksSection.tsx
const steps = [
  {
    num: '01',
    title: 'Подбор авто',
    text: 'Вы указываете бюджет и пожелания. Мы находим подходящие лоты на Copart и IAAI, проверяем историю и состояние.',
  },
  {
    num: '02',
    title: 'Покупка на аукционе',
    text: 'Участвуем в торгах от вашего имени. После победы оплачиваете лот и доставку по инвойсу через банк.',
  },
  {
    num: '03',
    title: 'Доставка морем',
    text: 'Авто забирается с площадки аукциона, грузится в порту и отправляется морским контейнером. Срок 30–45 дней.',
  },
  {
    num: '04',
    title: 'Растаможка и передача',
    text: 'Встречаем авто в порту, проводим таможенное оформление, получаем ЭПТС. Передаём вам ключи в Минске.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-text-main text-center mb-12">
          Как это работает
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {/* Соединительная линия (только не последний) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-[-50%] h-[2px] bg-primary/20" />
              )}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <span className="font-muller font-bold text-5xl text-primary/20 mb-3 leading-none">{s.num}</span>
                <h3 className="font-muller font-bold text-lg text-text-main mb-2">{s.title}</h3>
                <p className="font-montserrat text-sm text-text-muted leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Создать ServicesSection.tsx**

```tsx
// src/components/sections/ServicesSection.tsx
import Button from '@/components/ui/Button'
import { Search, Ship, FileCheck, Car } from 'lucide-react'

const services = [
  {
    icon: Search,
    title: 'Подбор на аукционе',
    text: 'Ищем подходящий лот по вашим критериям. Проверяем историю, пробег, повреждения.',
  },
  {
    icon: Ship,
    title: 'Доставка из США',
    text: 'Организуем полную логистику: склад в США, морской контейнер, доставка в Беларусь.',
  },
  {
    icon: FileCheck,
    title: 'Растаможка под ключ',
    text: 'Таможенное оформление, уплата пошлин, получение ЭПТС и постановка на учёт.',
  },
  {
    icon: Car,
    title: 'Подбор для перепродажи',
    text: 'Помогаем оптовым клиентам — специальные условия при регулярных заказах.',
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-text-main text-center mb-4">
          Наши услуги
        </h2>
        <p className="text-text-muted font-montserrat text-center mb-12 max-w-xl mx-auto">
          Берём на себя весь процесс — от поиска авто до передачи ключей
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-xl p-6 shadow-sm flex gap-4">
              <s.icon size={28} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-muller font-bold text-lg text-text-main mb-1">{s.title}</h3>
                <p className="font-montserrat text-sm text-text-muted leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button href="/uslugi" variant="outline" size="lg">Все услуги</Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Добавить на главную**

```tsx
// src/app/page.tsx — обновить
import HeroSection from '@/components/sections/HeroSection'
import TariffsSection from '@/components/sections/TariffsSection'
import StatsSection from '@/components/sections/StatsSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import PartnersSection from '@/components/sections/PartnersSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ServicesSection from '@/components/sections/ServicesSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TariffsSection />
      <StatsSection />
      <AdvantagesSection />
      <PartnersSection />
      <HowItWorksSection />
      <ServicesSection />
    </>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: partners, how-it-works, services sections"
```

---

### Task 11: TeamSection + VideoReviewsSection + FaqSection + CtaSection

**Files:**
- Create: `src/components/sections/TeamSection.tsx`
- Create: `src/components/sections/VideoReviewsSection.tsx`
- Create: `src/components/sections/FaqSection.tsx`
- Create: `src/components/sections/CtaSection.tsx`

- [ ] **Step 1: Создать TeamSection.tsx**

```tsx
// src/components/sections/TeamSection.tsx
// Замените фото на реальные (поместить в public/team/)
const team = [
  { name: 'Имя Фамилия', role: 'Основатель / Подбор авто', photo: '/team/person1.jpg' },
  { name: 'Имя Фамилия', role: 'Логистика и доставка', photo: '/team/person2.jpg' },
  { name: 'Имя Фамилия', role: 'Таможенное оформление', photo: '/team/person3.jpg' },
]

export default function TeamSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-text-main text-center mb-4">
          Наша команда
        </h2>
        <p className="text-text-muted font-montserrat text-center mb-12 max-w-xl mx-auto">
          Люди, которые разбираются в автомобилях
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {team.map((p) => (
            <div key={p.name} className="text-center">
              <div className="w-32 h-32 rounded-full bg-light-bg mx-auto mb-4 overflow-hidden border-4 border-primary/20">
                {/* Заменить на реальное фото: <Image src={p.photo} alt={p.name} width={128} height={128} className="object-cover" /> */}
                <div className="w-full h-full flex items-center justify-center text-text-muted text-4xl">👤</div>
              </div>
              <h3 className="font-muller font-bold text-lg text-text-main">{p.name}</h3>
              <p className="font-montserrat text-sm text-text-muted">{p.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

> **После получения фото:** заменить заглушки на `<Image>` с реальными фото из `public/team/`.

- [ ] **Step 2: Создать VideoReviewsSection.tsx**

```tsx
// src/components/sections/VideoReviewsSection.tsx
'use client'
import { useState } from 'react'
import { Play } from 'lucide-react'

// Заменить videoIds на реальные ID YouTube-видео с отзывами
const videos = [
  { id: 'YOUTUBE_ID_1', title: 'Отзыв клиента — Ford Mustang' },
  { id: 'YOUTUBE_ID_2', title: 'Отзыв клиента — Chevrolet Tahoe' },
  { id: 'YOUTUBE_ID_3', title: 'Отзыв клиента — BMW X5' },
  { id: 'YOUTUBE_ID_4', title: 'Отзыв клиента — Toyota Camry' },
]

function VideoCard({ video }: { video: typeof videos[0] }) {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`

  if (playing) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={video.title}
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full aspect-video rounded-xl overflow-hidden group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumb} alt={video.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play size={20} className="text-white ml-1" fill="white" />
        </div>
      </div>
      <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-montserrat text-left line-clamp-1">
        {video.title}
      </p>
    </button>
  )
}

export default function VideoReviewsSection() {
  return (
    <section className="bg-dark-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-white text-center mb-4">
          Что говорят наши клиенты
        </h2>
        <p className="text-white/40 font-montserrat text-center mb-12">
          Видеоотзывы реальных покупателей
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      </div>
    </section>
  )
}
```

> **Заменить** `YOUTUBE_ID_1..4` на реальные ID видео-отзывов с YouTube.

- [ ] **Step 3: Создать FaqSection.tsx**

```tsx
// src/components/sections/FaqSection.tsx
import Accordion, { AccordionItem } from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'

const faqItems: AccordionItem[] = [
  {
    question: 'Сколько стоит услуга по доставке авто из США?',
    answer: 'Для жителей Минска и области — 990 BYN. Для регионов Беларуси — 690 BYN. Мотоциклы и квадроциклы — 495 BYN независимо от региона.',
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
    answer: 'Да. После покупки мы предоставляем трекинг-данные и регулярно обновляем статус доставки. Также вы можете воспользоваться разделом "Отслеживание авто" на нашем сайте.',
  },
]

export default function FaqSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-text-main text-center mb-12">
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

- [ ] **Step 4: Создать CtaSection.tsx**

```tsx
// src/components/sections/CtaSection.tsx
import Button from '@/components/ui/Button'

export default function CtaSection() {
  return (
    <section className="bg-dark-bg py-16 md:py-24">
      <div className="container text-center">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-white mb-4">
          Готовы начать?
        </h2>
        <p className="text-white/50 font-montserrat mb-10 max-w-lg mx-auto">
          Оставьте заявку — мы свяжемся в течение часа и расскажем всё о вашем будущем автомобиле
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/contacts" size="lg">Оставить заявку</Button>
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
    </section>
  )
}
```

- [ ] **Step 5: Собрать главную полностью**

```tsx
// src/app/page.tsx — финальная версия
import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import TariffsSection from '@/components/sections/TariffsSection'
import StatsSection from '@/components/sections/StatsSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import PartnersSection from '@/components/sections/PartnersSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ServicesSection from '@/components/sections/ServicesSection'
import TeamSection from '@/components/sections/TeamSection'
import VideoReviewsSection from '@/components/sections/VideoReviewsSection'
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
      <StatsSection />
      <AdvantagesSection />
      <PartnersSection />
      <HowItWorksSection />
      <ServicesSection />
      <TeamSection />
      <VideoReviewsSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
```

- [ ] **Step 6: Проверить что всё рендерится**

```bash
npm run dev
```

Прокрутить http://localhost:3000 — все 11 секций должны отображаться.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: complete homepage with all 11 sections"
```

---

## PHASE 5: Внутренние страницы

### Task 12: Страница Услуги (/uslugi)

**Files:**
- Create: `src/app/uslugi/page.tsx`

- [ ] **Step 1: Создать страницу**

```tsx
// src/app/uslugi/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import { Search, Ship, FileCheck, Car, Calculator, ClipboardList } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Услуги по доставке авто из США',
  description: 'Полный спектр услуг по импорту автомобилей из США в Беларусь: подбор, доставка, растаможка, оформление документов.',
}

const services = [
  {
    icon: Search,
    title: 'Подбор авто на аукционе',
    text: 'Анализируем тысячи лотов на Copart и IAAI. Проверяем историю по CarFax, оцениваем реальное состояние авто по фото, находим лучшее соотношение цены и состояния под ваш бюджет.',
  },
  {
    icon: Car,
    title: 'Участие в торгах',
    text: 'Участвуем в аукционных торгах от вашего имени. Устанавливаем правильный лимит ставки с учётом всех последующих расходов, чтобы итоговая стоимость не вышла за ваш бюджет.',
  },
  {
    icon: Ship,
    title: 'Доставка из США',
    text: 'Организуем полную цепочку логистики: забираем авто с площадки аукциона, доставляем на склад, грузим в морской контейнер, сопровождаем до порта назначения и до Минска.',
  },
  {
    icon: FileCheck,
    title: 'Растаможка под ключ',
    text: 'Берём на себя все таможенные формальности: подготовку документов, уплату пошлин и сборов, получение ЭПТС. Вы не тратите время на бюрократию.',
  },
  {
    icon: ClipboardList,
    title: 'Помощь с документами',
    text: 'Помогаем с ДКП, снятием с учёта, постановкой на учёт в ГАИ. Консультируем по всем вопросам оформления.',
  },
  {
    icon: Calculator,
    title: 'Расчёт стоимости',
    text: 'Бесплатно рассчитаем полную стоимость любого лота: цена + аукционный сбор + доставка + растаможка. Никаких сюрпризов.',
  },
]

export default function UslugiPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-text-main mb-4">Наши услуги</h1>
        <p className="text-text-muted font-montserrat text-lg mb-12 max-w-2xl">
          Берём на себя весь процесс — от поиска авто на аукционе до передачи ключей в Минске
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {services.map((s) => (
            <div key={s.title} className="bg-light-bg rounded-xl p-8 flex gap-5">
              <s.icon size={32} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-muller font-bold text-xl text-text-main mb-2">{s.title}</h2>
                <p className="font-montserrat text-sm text-text-muted leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-dark-bg rounded-2xl p-10 text-center">
          <h2 className="font-muller font-bold text-2xl text-white mb-3">Нужна консультация?</h2>
          <p className="text-white/50 font-montserrat mb-6">Ответим на все вопросы и рассчитаем стоимость вашего авто</p>
          <Button href="/contacts" size="lg">Получить консультацию</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: services page"
```

---

### Task 13: Страница Доставка из США (/dostavka)

**Files:**
- Create: `src/app/dostavka/page.tsx`

- [ ] **Step 1: Создать страницу**

```tsx
// src/app/dostavka/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import { Check, X } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Доставка авто из США в Беларусь',
  description: 'Полная информация о доставке авто из США: аукционы Copart и IAAI, маршрут, сроки, стоимость, типы документов.',
}

const stages = [
  { title: 'Покупка на аукционе', days: '3–7 дней', text: 'Выигрываем лот, оплачиваем аукционный сбор и забираем авто с площадки.' },
  { title: 'Доставка до порта (США)', days: '7–14 дней', text: 'Транспортировка авто до портового склада. Чаще всего — Хьюстон, Балтимор, Нью-Джерси.' },
  { title: 'Морская перевозка', days: '30–45 дней', text: 'Погрузка в контейнер и отправка судном. Порты назначения: Бремерхафен (Германия) или Клайпеда (Литва).' },
  { title: 'Доставка в Беларусь', days: '5–10 дней', text: 'Автовоз или собственный ход из порта до Минска.' },
  { title: 'Таможенное оформление', days: '3–7 дней', text: 'Декларирование, уплата пошлин, получение ЭПТС.' },
]

const docTypes = [
  {
    title: 'Clean Title',
    status: 'good',
    text: 'Чистый титул — авто не имеет страховых случаев. Самый предпочтительный вариант для регистрации в РБ.',
  },
  {
    title: 'Rebuilt Title',
    status: 'ok',
    text: 'Восстановленный титул — авто было повреждено и официально восстановлено. Допускается к регистрации в РБ.',
  },
  {
    title: 'Salvage Title',
    status: 'warn',
    text: 'Страховой тотал — авто признано не подлежащим восстановлению страховой компанией. Требует дополнительных документов при растаможке.',
  },
]

const included = [
  'Аукционный сбор (Copart / IAAI)',
  'Доставка по США до порта',
  'Морская перевозка до Европы',
  'Доставка из порта в Минск',
  'Услуги таможенного декларанта',
  'Таможенные пошлины и сборы',
  'Получение ЭПТС',
]

const notIncluded = [
  'Стоимость самого автомобиля',
  'Комиссия банка при переводе (20–100 BYN)',
  'Оформление документов (80–85 EUR)',
  'Страхование груза (опционально)',
]

export default function DostavkaPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-text-main mb-4">
          Доставка из США
        </h1>
        <p className="text-text-muted font-montserrat text-lg mb-16 max-w-2xl">
          Работаем с аукционами Copart и IAAI. Организуем полную логистику от аукционной площадки до вашего гаража.
        </p>

        {/* Маршрут */}
        <h2 className="font-muller font-bold text-2xl text-text-main mb-6">Маршрут и сроки</h2>
        <div className="flex flex-col gap-4 mb-16">
          {stages.map((s, i) => (
            <div key={s.title} className="flex gap-5 items-start">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-muller font-bold text-sm">
                  {i + 1}
                </div>
                {i < stages.length - 1 && <div className="w-[2px] h-8 bg-primary/20 mt-1" />}
              </div>
              <div className="pb-4">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="font-muller font-bold text-lg text-text-main">{s.title}</h3>
                  <span className="text-xs font-montserrat text-primary bg-primary/10 px-2 py-0.5 rounded">{s.days}</span>
                </div>
                <p className="font-montserrat text-sm text-text-muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Типы документов */}
        <h2 className="font-muller font-bold text-2xl text-text-main mb-6">Типы документов (Title)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {docTypes.map((d) => (
            <div key={d.title} className={`rounded-xl p-6 border-2 ${
              d.status === 'good' ? 'border-green-200 bg-green-50'
              : d.status === 'ok' ? 'border-primary/30 bg-primary/5'
              : 'border-yellow-200 bg-yellow-50'
            }`}>
              <h3 className="font-muller font-bold text-lg text-text-main mb-2">{d.title}</h3>
              <p className="font-montserrat text-sm text-text-muted">{d.text}</p>
            </div>
          ))}
        </div>

        {/* Что включено */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-light-bg rounded-xl p-6">
            <h2 className="font-muller font-bold text-xl text-text-main mb-4">Входит в стоимость</h2>
            <ul className="flex flex-col gap-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2 font-montserrat text-sm text-text-muted">
                  <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-light-bg rounded-xl p-6">
            <h2 className="font-muller font-bold text-xl text-text-main mb-4">Оплачивается отдельно</h2>
            <ul className="flex flex-col gap-2">
              {notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2 font-montserrat text-sm text-text-muted">
                  <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Button href="/info/kalkulyator" size="lg" className="mr-4">Рассчитать стоимость</Button>
          <Button href="/contacts" variant="outline" size="lg">Задать вопрос</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: delivery page"
```

---

### Task 14: FAQ страница + Оферта + Контакты + Трекинг

**Files:**
- Create: `src/app/faq/page.tsx`
- Create: `src/app/oferta/page.tsx`
- Create: `src/app/contacts/page.tsx`
- Create: `src/app/tracking/page.tsx`

- [ ] **Step 1: FAQ страница**

```tsx
// src/app/faq/page.tsx
import type { Metadata } from 'next'
import Accordion, { AccordionItem } from '@/components/ui/Accordion'

export const metadata: Metadata = {
  title: 'Вопросы и ответы',
  description: 'Ответы на частые вопросы о покупке и доставке авто из США в Беларусь: стоимость, сроки, оплата, документы.',
}

const faqByCategory: { category: string; items: AccordionItem[] }[] = [
  {
    category: 'Стоимость и оплата',
    items: [
      { question: 'Сколько стоит услуга?', answer: 'Для Минска и области — 990 BYN. Для регионов — 690 BYN. Мотоциклы и квадроциклы — 495 BYN.' },
      { question: 'Как оплатить автомобиль из США?', answer: 'Оплата по инвойсу через банковский перевод. Стоимость лота и сбор аукциона — на следующий день после выигрыша. Доставка — в течение 3 дней после покупки.' },
      { question: 'Какие дополнительные комиссии при оплате?', answer: 'В связи с санкциями переводы идут через посредников: комиссия 4–5%. Плюс комиссия банка РБ 20–100 BYN и 80–85 EUR за оформление документов.' },
      { question: 'Нужен ли обеспечительный платёж?', answer: 'Да, для лотов с планируемой ставкой от 10 000 у.е. — обеспечительный платёж от 1 200 BYN.' },
    ],
  },
  {
    category: 'Сроки доставки',
    items: [
      { question: 'Сколько времени занимает доставка?', answer: 'В среднем 2–3 месяца: покупка и отправка 1–2 недели, морем 30–45 дней, таможня 1–2 недели.' },
      { question: 'Можно ли ускорить доставку?', answer: 'Скорость морской перевозки фиксирована. Можно выбрать ближайший доступный рейс, что сократит ожидание у порта на 1–2 недели.' },
    ],
  },
  {
    category: 'Аукционы и выбор авто',
    items: [
      { question: 'Какие аукционы вы используете?', answer: 'Работаем с Copart и IAAI — двумя крупнейшими авто-аукционами США.' },
      { question: 'Как проверить состояние авто?', answer: 'Смотрим фото от аукциона, проверяем историю по CarFax/AutoCheck, при необходимости заказываем независимый осмотр на месте.' },
      { question: 'Какой тип документов лучше всего?', answer: 'Предпочтительнее Clean Title. Rebuilt Title также допустим. Salvage Title требует дополнительных документов при растаможке, но не является препятствием.' },
    ],
  },
  {
    category: 'Документы и растаможка',
    items: [
      { question: 'Что входит в растаможку?', answer: 'Таможенная пошлина, утилизационный сбор, таможенный сбор (120 BYN), ЭПТС (70 BYN). Рассчитать можно в нашем таможенном калькуляторе.' },
      { question: 'Что такое ЭПТС?', answer: 'Электронный паспорт транспортного средства — обязательный документ для регистрации авто в РБ. Оформляется при таможенном оформлении.' },
      { question: 'Можно ли воспользоваться льготой по Указу №140?', answer: 'Да, если вы имеете право на льготу — таможенная пошлина уменьшается вдвое. Уточните у нашего менеджера.' },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-text-main mb-4">
          Вопросы и ответы
        </h1>
        <p className="text-text-muted font-montserrat text-lg mb-12">
          Отвечаем на самые частые вопросы о покупке и доставке авто из США
        </p>
        {faqByCategory.map((cat) => (
          <div key={cat.category} className="mb-10">
            <h2 className="font-muller font-bold text-xl text-primary mb-4 pb-2 border-b border-primary/20">
              {cat.category}
            </h2>
            <Accordion items={cat.items} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Страница Оферты**

```tsx
// src/app/oferta/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Публичный договор оферты',
  description: 'Публичный договор оферты pmcars.by на оказание услуг по подбору и организации доставки автомобилей из США.',
}

export default function OfertaPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="font-muller font-bold text-4xl text-text-main mb-2">
          Публичный договор оферты
        </h1>
        <p className="text-text-muted font-montserrat text-sm mb-10">
          Редакция от 01.01.2025
        </p>
        <div className="prose prose-sm max-w-none font-montserrat text-text-muted leading-relaxed space-y-6">
          <section id="s1">
            <h2 className="font-muller font-bold text-xl text-text-main mb-2">1. Общие положения</h2>
            <p>Настоящий договор является публичной офертой ИП [Название ИП] (далее — Исполнитель) и содержит все существенные условия договора на оказание услуг по подбору и организации доставки транспортных средств из США в Республику Беларусь.</p>
            <p>Акцептом настоящей оферты является оплата Заказчиком счёта (инвойса), выставленного Исполнителем.</p>
          </section>
          <section id="s2">
            <h2 className="font-muller font-bold text-xl text-text-main mb-2">2. Предмет договора</h2>
            <p>Исполнитель оказывает услуги по подбору транспортного средства на аукционах США (Copart, IAAI), организации его покупки и доставки в Республику Беларусь, а также содействию в таможенном оформлении.</p>
          </section>
          <section id="s3">
            <h2 className="font-muller font-bold text-xl text-text-main mb-2">3. Стоимость и порядок оплаты</h2>
            <p>Стоимость услуг Исполнителя: для г. Минска и Минской области — 990 BYN; для иных регионов Республики Беларусь — 690 BYN; для мотоциклов и квадроциклов — 495 BYN.</p>
            <p>Оплата производится в следующем порядке: стоимость лота и аукционный сбор — не позднее следующего рабочего дня после выигрыша торгов; расходы на доставку — в течение 3 рабочих дней после покупки.</p>
          </section>
          <section id="s4">
            <h2 className="font-muller font-bold text-xl text-text-main mb-2">4. Права и обязанности сторон</h2>
            <p>Исполнитель обязуется: добросовестно представлять интересы Заказчика на аукционе; информировать Заказчика о ходе исполнения договора; обеспечить сохранность транспортного средства при транспортировке.</p>
            <p>Заказчик обязуется: своевременно производить оплату согласно выставленным инвойсам; предоставлять достоверные сведения о себе; самостоятельно нести расходы по уплате таможенных платежей.</p>
          </section>
          <section id="s5">
            <h2 className="font-muller font-bold text-xl text-text-main mb-2">5. Ответственность сторон</h2>
            <p>Исполнитель не несёт ответственности за задержки, вызванные действиями третьих лиц (аукционов, транспортных компаний, таможенных органов), а также форс-мажорными обстоятельствами.</p>
          </section>
          <section id="s6">
            <h2 className="font-muller font-bold text-xl text-text-main mb-2">6. Конфиденциальность</h2>
            <p>Стороны обязуются не разглашать конфиденциальную информацию, полученную в рамках настоящего договора, третьим лицам без письменного согласия другой стороны.</p>
          </section>
          <section id="s7">
            <h2 className="font-muller font-bold text-xl text-text-main mb-2">7. Реквизиты исполнителя</h2>
            <p>[Заполнить реквизиты ИП: наименование, УНП, адрес, банковские реквизиты]</p>
          </section>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Страница Контакты**

```tsx
// src/app/contacts/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с pmcars.by — импорт авто из США в Беларусь. Телефон, Telegram, WhatsApp, адрес в Минске.',
}

export default function ContactsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-text-main mb-12">Контакты</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Контактная информация */}
          <div>
            <div className="space-y-6 mb-10">
              <div>
                <p className="text-xs font-montserrat text-text-muted uppercase tracking-widest mb-1">Телефон</p>
                <a href="tel:+375XXXXXXXXX" className="font-muller font-bold text-2xl text-primary hover:text-primary-dark">
                  +375 (XX) XXX-XX-XX
                </a>
              </div>
              <div>
                <p className="text-xs font-montserrat text-text-muted uppercase tracking-widest mb-2">Мессенджеры</p>
                <div className="flex gap-3">
                  <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer"
                     className="px-5 py-2 bg-[#2AABEE] text-white rounded font-montserrat font-bold text-sm hover:opacity-90">
                    Telegram
                  </a>
                  <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer"
                     className="px-5 py-2 bg-[#25D366] text-white rounded font-montserrat font-bold text-sm hover:opacity-90">
                    WhatsApp
                  </a>
                  <a href="viber://chat?number=+375XXXXXXXXX"
                     className="px-5 py-2 bg-[#7360F2] text-white rounded font-montserrat font-bold text-sm hover:opacity-90">
                    Viber
                  </a>
                </div>
              </div>
              <div>
                <p className="text-xs font-montserrat text-text-muted uppercase tracking-widest mb-1">Адрес</p>
                <p className="font-montserrat text-text-main">[Адрес офиса в Минске]</p>
              </div>
              <div>
                <p className="text-xs font-montserrat text-text-muted uppercase tracking-widest mb-1">Режим работы</p>
                <p className="font-montserrat text-text-main">10:00 – 20:00, без выходных</p>
              </div>
            </div>
          </div>

          {/* Форма */}
          <div className="bg-light-bg rounded-2xl p-8">
            <h2 className="font-muller font-bold text-2xl text-text-main mb-6">Оставить заявку</h2>
            <form
              action={`https://t.me/pmcars`}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                // Для v1: просто открываем telegram
                window.open('https://t.me/pmcars', '_blank')
              }}
            >
              <div>
                <label className="block font-montserrat text-sm text-text-muted mb-1">Имя</label>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-montserrat text-sm text-text-muted mb-1">Телефон</label>
                <input
                  type="tel"
                  placeholder="+375 (XX) XXX-XX-XX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-montserrat text-sm text-text-muted mb-1">Сообщение (необязательно)</label>
                <textarea
                  rows={3}
                  placeholder="Опишите что ищете..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">Отправить заявку</Button>
              <p className="text-xs text-text-muted font-montserrat text-center">
                Нажимая кнопку, вы соглашаетесь с <a href="/oferta" className="text-primary hover:underline">договором оферты</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Страница Трекинг (заглушка)**

```tsx
// src/app/tracking/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Отслеживание авто',
  description: 'Отслеживайте статус доставки вашего автомобиля из США.',
}

export default function TrackingPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-xl">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-text-main mb-4">
          Отслеживание авто
        </h1>
        <p className="text-text-muted font-montserrat mb-10">
          Введите VIN или номер заказа чтобы узнать статус вашего автомобиля
        </p>
        <div className="bg-light-bg rounded-2xl p-8 mb-8">
          <label className="block font-montserrat font-bold text-sm text-text-main mb-2">
            VIN / Номер заказа
          </label>
          <input
            type="text"
            placeholder="Например: 1HGBH41JXMN109186"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary mb-4"
          />
          <Button size="lg" className="w-full" disabled>
            Отследить
          </Button>
          <p className="text-center text-xs text-text-muted font-montserrat mt-3">
            Функция в разработке
          </p>
        </div>
        <div className="bg-dark-bg rounded-2xl p-8 text-center">
          <p className="text-white font-montserrat mb-4">
            Для получения актуального статуса доставки — свяжитесь с менеджером
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer"
               className="px-5 py-2 bg-[#2AABEE] text-white rounded font-montserrat font-bold text-sm">
              Telegram
            </a>
            <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer"
               className="px-5 py-2 bg-[#25D366] text-white rounded font-montserrat font-bold text-sm">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: faq, oferta, contacts, tracking pages"
```

---

## PHASE 6: Раздел Информация

### Task 15: Таможенный калькулятор — UI

**Files:**
- Create: `src/app/info/kalkulyator/page.tsx`

- [ ] **Step 1: Создать страницу калькулятора**

```tsx
// src/app/info/kalkulyator/page.tsx
'use client'
import { useState, useEffect } from 'react'
import type { Metadata } from 'next'
import { calculateTotal, type CalculatorInput, type CalculatorResult } from '@/lib/calculator'
import Button from '@/components/ui/Button'

// Примечание: metadata нельзя экспортировать из 'use client' компонента.
// Создайте отдельный layout.tsx или используйте generateMetadata в server component.

const EUR_RATE_FALLBACK = 3.38

function fmt(n: number) {
  return new Intl.NumberFormat('ru-BY', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n)
}

export default function KalkulyatorPage() {
  const [eurRate, setEurRate] = useState(EUR_RATE_FALLBACK)
  const [input, setInput] = useState<Omit<CalculatorInput, 'eurRate'>>({
    carCost: 0,
    engineVolume: 0,
    carType: 'auto',
    engineType: 'ice',
    carAge: 'under3',
    decree140: false,
  })
  const [result, setResult] = useState<CalculatorResult | null>(null)

  useEffect(() => {
    fetch('https://api.nbrb.by/exrates/rates/451')
      .then((r) => r.json())
      .then((d) => { if (d?.Cur_OfficialRate) setEurRate(d.Cur_OfficialRate) })
      .catch(() => {}) // используем fallback
  }, [])

  function handleCalculate() {
    if (!input.carCost || !input.engineVolume) return
    setResult(calculateTotal({ ...input, eurRate }))
  }

  const sel = 'w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary bg-white'
  const inp = 'w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary'

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-2xl">
        <h1 className="font-muller font-bold text-4xl text-text-main mb-2">Таможенный калькулятор</h1>
        <p className="text-text-muted font-montserrat mb-2">
          Расчёт таможенных платежей при ввозе авто из США в Беларусь
        </p>
        <p className="text-xs text-text-muted font-montserrat mb-10">
          Курс EUR/BYN: {eurRate.toFixed(4)} (НБРБ)
        </p>

        <div className="bg-light-bg rounded-2xl p-8 space-y-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-montserrat font-bold text-sm text-text-main mb-1">Стоимость авто (EUR)</label>
              <input type="number" min={0} placeholder="Например: 15000" className={inp}
                value={input.carCost || ''} onChange={(e) => setInput({ ...input, carCost: +e.target.value })} />
            </div>
            <div>
              <label className="block font-montserrat font-bold text-sm text-text-main mb-1">Объём двигателя (куб. см)</label>
              <input type="number" min={0} placeholder="Например: 2000" className={inp}
                value={input.engineVolume || ''} onChange={(e) => setInput({ ...input, engineVolume: +e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block font-montserrat font-bold text-sm text-text-main mb-1">Тип ТС</label>
              <select className={sel} value={input.carType}
                onChange={(e) => setInput({ ...input, carType: e.target.value as 'auto' | 'moto' })}>
                <option value="auto">Автомобиль</option>
                <option value="moto">Мотоцикл</option>
              </select>
            </div>
            <div>
              <label className="block font-montserrat font-bold text-sm text-text-main mb-1">Тип двигателя</label>
              <select className={sel} value={input.engineType}
                onChange={(e) => setInput({ ...input, engineType: e.target.value as 'ice' | 'electric' })}>
                <option value="ice">Бензин / Дизель</option>
                <option value="electric">Электромобиль</option>
              </select>
            </div>
            <div>
              <label className="block font-montserrat font-bold text-sm text-text-main mb-1">Возраст авто</label>
              <select className={sel} value={input.carAge}
                onChange={(e) => setInput({ ...input, carAge: e.target.value as CalculatorInput['carAge'] })}>
                <option value="under3">До 3 лет</option>
                <option value="3to5">От 3 до 5 лет</option>
                <option value="over5">Старше 5 лет</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-primary"
              checked={input.decree140} onChange={(e) => setInput({ ...input, decree140: e.target.checked })} />
            <span className="font-montserrat text-sm text-text-main">С учётом Указа №140 (льготная пошлина)</span>
          </label>

          <Button size="lg" className="w-full" onClick={handleCalculate}>
            Рассчитать
          </Button>
        </div>

        {result && (
          <div className="bg-dark-bg rounded-2xl p-8 text-white">
            <h2 className="font-muller font-bold text-xl mb-6">Результат расчёта</h2>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Стоимость авто', value: result.carCost },
                { label: 'Таможенная пошлина', value: result.duty },
                { label: 'Таможенный сбор', value: result.customsFee },
                { label: 'Утилизационный сбор', value: result.recyclingFee },
                { label: 'ЭПТС', value: result.eptsFee },
              ].map((row) => (
                <div key={row.label} className="flex justify-between font-montserrat text-sm">
                  <span className="text-white/60">{row.label}</span>
                  <span className="text-white font-bold">{fmt(row.value)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between font-montserrat">
                <span className="text-white font-bold text-base">Итого таможенные платежи</span>
                <span className="text-primary font-bold text-xl">{fmt(result.total)}</span>
              </div>
            </div>
            <p className="text-white/30 text-xs font-montserrat">
              * Расчёт является ориентировочным. Точную стоимость уточняйте у менеджера.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Создать layout для info-раздела с metadata**

```tsx
// src/app/info/kalkulyator/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Таможенный калькулятор',
  description: 'Рассчитайте таможенные платежи при ввозе автомобиля из США в Беларусь онлайн.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: customs calculator UI with NBRB rate API"
```

---

### Task 16: Информационные страницы ЭПТС / ДКП / Снятие с учёта

**Files:**
- Create: `src/app/info/epts/page.tsx`
- Create: `src/app/info/dkp/page.tsx`
- Create: `src/app/info/snyatie/page.tsx`

- [ ] **Step 1: Создать ЭПТС страницу**

```tsx
// src/app/info/epts/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'ЭПТС — Электронный паспорт ТС',
  description: 'Что такое ЭПТС, как получить электронный паспорт транспортного средства при ввозе авто из США.',
}

export default function EptsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="font-muller font-bold text-4xl text-text-main mb-4">ЭПТС</h1>
        <p className="text-text-muted font-montserrat text-lg mb-10">Электронный паспорт транспортного средства</p>
        <div className="space-y-8 font-montserrat text-text-muted leading-relaxed">
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Что такое ЭПТС?</h2>
            <p>ЭПТС (Электронный паспорт транспортного средства) — обязательный документ для регистрации автомобиля в Республике Беларусь. Он содержит все технические характеристики авто и историю владельцев в электронном виде.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Кому нужен ЭПТС?</h2>
            <p>ЭПТС необходим для каждого автомобиля, ввозимого из-за рубежа и регистрируемого в РБ. Без ЭПТС постановка на учёт в ГАИ невозможна.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Как получить ЭПТС?</h2>
            <p>ЭПТС оформляется при таможенном оформлении автомобиля. Стоимость — 70 BYN. Мы берём на себя все формальности по его получению — вам ничего делать не нужно.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Сроки</h2>
            <p>ЭПТС оформляется в течение 1–3 рабочих дней после завершения таможенного оформления.</p>
          </section>
        </div>
        <div className="mt-10">
          <Button href="/contacts">Задать вопрос</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Создать ДКП страницу**

```tsx
// src/app/info/dkp/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'ДКП — Договор купли-продажи',
  description: 'Что такое ДКП при покупке авто из США, что должно быть в договоре купли-продажи.',
}

export default function DkpPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="font-muller font-bold text-4xl text-text-main mb-4">ДКП</h1>
        <p className="text-text-muted font-montserrat text-lg mb-10">Договор купли-продажи автомобиля</p>
        <div className="space-y-8 font-montserrat text-text-muted leading-relaxed">
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Что такое ДКП?</h2>
            <p>ДКП (Договор купли-продажи) — документ, подтверждающий факт покупки транспортного средства. При ввозе авто из США используется договор между нашей компанией и клиентом.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Зачем нужен ДКП?</h2>
            <p>ДКП необходим для постановки автомобиля на учёт в ГАИ, подтверждения легальности приобретения, а также при последующей продаже автомобиля.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Что входит в ДКП?</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Данные продавца и покупателя</li>
              <li>Характеристики авто (марка, модель, год, VIN, объём двигателя)</li>
              <li>Стоимость сделки</li>
              <li>Дата и подписи сторон</li>
            </ul>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Как мы оформляем ДКП?</h2>
            <p>Мы составляем ДКП после завершения таможенного оформления и передаём его вместе с комплектом документов на автомобиль.</p>
          </section>
        </div>
        <div className="mt-10">
          <Button href="/contacts">Задать вопрос</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Создать страницу Снятие с учёта**

```tsx
// src/app/info/snyatie/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Снятие с учёта',
  description: 'Нужно ли снимать авто с учёта в США перед ввозом в Беларусь. Процесс и документы.',
}

export default function SnyatiePage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="font-muller font-bold text-4xl text-text-main mb-4">Снятие с учёта</h1>
        <p className="text-text-muted font-montserrat text-lg mb-10">Снятие авто с учёта в США</p>
        <div className="space-y-8 font-montserrat text-text-muted leading-relaxed">
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Нужно ли снимать авто с учёта?</h2>
            <p>Авто, купленное на аукционах Copart или IAAI, как правило, уже снято с учёта — оно оформлено на страховую компанию и не имеет номерных знаков. Для экспорта из США это стандартная ситуация.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Что происходит с документами?</h2>
            <p>При покупке на аукционе вы получаете Title (аналог ПТС в США). После завершения сделки Title переоформляется на покупателя. Этот документ является основанием для таможенного оформления в Беларуси.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-text-main mb-3">Постановка на учёт в Беларуси</h2>
            <p>После получения ЭПТС и ДКП вы можете поставить автомобиль на учёт в ГАИ. Процедура стандартная: предоставить документы, пройти техосмотр, получить номерные знаки.</p>
          </section>
        </div>
        <div className="mt-10">
          <Button href="/contacts">Задать вопрос</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: info pages - epts, dkp, snyatie"
```

---

## PHASE 7: SEO + Claude.md

### Task 17: Sitemap, robots.txt, SEO-финализация

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Создать sitemap.ts**

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pmcars.by'
  const pages = [
    '',
    '/uslugi',
    '/dostavka',
    '/tracking',
    '/faq',
    '/oferta',
    '/contacts',
    '/info/kalkulyator',
    '/info/epts',
    '/info/dkp',
    '/info/snyatie',
  ]
  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))
}
```

- [ ] **Step 2: Создать robots.ts**

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://pmcars.by/sitemap.xml',
  }
}
```

- [ ] **Step 3: Запустить финальную проверку**

```bash
npm run build
```

Ожидаемо: BUILD SUCCESS, 0 ошибок.

- [ ] **Step 4: Запустить все тесты**

```bash
npm test
```

Ожидаемо: все тесты PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: sitemap and robots.txt"
```

---

### Task 18: claude.md

**Files:**
- Modify: `claude.md` (в корне проекта)

- [ ] **Step 1: Записать claude.md**

```markdown
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

## Брендинг
- Основной цвет: `#00ACB8` (primary в Tailwind)
- Тёмный фон: `#0d1117` (dark-bg)
- Шрифт заголовков: Muller
- Логотип: `/public/logo.svg` (белый wordmark)

## Важные детали
- **Замени перед запуском:** телефон (`+375XXXXXXXXX`), Telegram-ник (`pmcars`), адрес офиса, реквизиты ИП в оферте, ID YouTube-видео в VideoReviewsSection, фото команды в public/team/
- Таможенный калькулятор берёт курс EUR с API НБРБ: `https://api.nbrb.by/exrates/rates/451`
- Трекинг авто — заглушка, бэкенд добавляется позже
- Контактная форма в v1 ведёт в Telegram (нет email-бэкенда)

## Команды
```bash
npm run dev      # Запуск dev-сервера
npm run build    # Production сборка
npm test         # Запуск тестов
```

## Референсы
- `references/solutionauto.by` — стиль хедера
- `references/autogroup.by` — общий визуал, шрифты
- `references/westmotors` — структура главной, видеоотзывы
- Спек: `docs/superpowers/specs/2026-03-29-pmcars-website-design.md`
- Логика калькулятора: `references/autogroup.by/autogroup.by/customs-calculator/js/`
```

- [ ] **Step 2: Commit финальный**

```bash
git add -A && git commit -m "docs: add claude.md project guide"
```

---

## Чеклист перед запуском

- [ ] Заменить `+375XXXXXXXXX` на реальный номер телефона
- [ ] Заменить `https://t.me/pmcars` на реальный Telegram
- [ ] Добавить реальные фото команды в `public/team/`
- [ ] Заменить YouTube ID в `VideoReviewsSection.tsx`
- [ ] Заполнить реквизиты ИП в `/oferta`
- [ ] Добавить адрес офиса в `/contacts`
- [ ] Обновить цифры (количество авто, лет на рынке) в StatsSection
- [ ] Обновить тарифы если они изменились
- [ ] Настроить домен и деплой на Vercel
