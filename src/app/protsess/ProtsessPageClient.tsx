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
