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
