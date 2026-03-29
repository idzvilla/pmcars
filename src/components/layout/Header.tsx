// src/components/layout/Header.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown } from 'lucide-react'
import MobileMenu from './MobileMenu'

const infoLinks: { label: string; href: string }[] = [
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
        <div className="bg-dark-bg border-b border-white/5">
          <div className="container flex items-center justify-between py-2 text-xs font-montserrat">
            <a href="tel:+375XXXXXXXXX" className="text-primary font-bold hover:text-primary-dark transition-colors">
              +375 (XX) XXX-XX-XX
            </a>
            <div className="flex items-center gap-3 text-white/60">
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex gap-3">
                  <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TG</a>
                  <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WA</a>
                  <a href="viber://chat?number=+375XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Viber</a>
                </div>
                <span className="text-white/30">|</span>
                <span>10:00–20:00</span>
                <span className="text-white/30">|</span>
              </div>
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
                <button
                  className="flex items-center gap-1 text-white/80 hover:text-primary transition-colors"
                  onClick={() => setInfoOpen(v => !v)}
                >
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
