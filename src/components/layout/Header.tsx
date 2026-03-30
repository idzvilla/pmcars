// src/components/layout/Header.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Search, Clock } from 'lucide-react'
import MobileMenu from './MobileMenu'

const infoLinks: { label: string; href: string }[] = [
  { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
  { label: 'Калькулятор расходов', href: '/info/kalkulyator-rashod' },
  { label: 'ЭПТС', href: '/info/epts' },
  { label: 'ДКП', href: '/info/dkp' },
  { label: 'Снятие с учёта', href: '/info/snyatie' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        className={`fixed top-2 left-2 right-2 z-40 bg-[#234041] rounded-2xl transition-shadow ${
          scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.6)]' : ''
        }`}
      >
        <div className="container py-2">
          <div className="flex items-center gap-4">

              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/logo.svg"
                    alt="pmcars.by"
                    width={160}
                    height={43}
                    priority
                    className="w-auto h-auto"
                  />
                </Link>
              </div>

              {/* Right section */}
              <div className="flex-1 min-w-0">

                {/* Top row — desktop */}
                <div className="hidden xl:flex items-center justify-between gap-4">

                  {/* Social icons */}
                  <div className="flex items-center gap-2">
                    <a href="https://tiktok.com/@pmcars" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 transition-opacity">
                      <Image src="/icons/tt.svg" alt="TikTok" width={25} height={25} />
                    </a>
                    <a href="https://instagram.com/pmcars" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 transition-opacity">
                      <Image src="/icons/inst.svg" alt="Instagram" width={25} height={25} />
                    </a>
                    <a href="https://youtube.com/@pmcars" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 transition-opacity">
                      <Image src="/icons/yt.svg" alt="YouTube" width={25} height={25} />
                    </a>
                  </div>

                  {/* Phone + messengers */}
                  <div className="flex items-center gap-[7px]">
                    <a
                      href="tel:+375XXXXXXXXX"
                      className="text-white font-montserrat text-base whitespace-nowrap hover:text-primary transition-colors mr-1"
                    >
                      +375 (XX) XXX-XX-XX
                    </a>
                    <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 transition-opacity">
                      <Image src="/icons/tg.svg" alt="Telegram" width={25} height={25} />
                    </a>
                    <a href="viber://chat?number=+375XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 transition-opacity">
                      <Image src="/icons/vb.svg" alt="Viber" width={25} height={25} />
                    </a>
                    <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 transition-opacity">
                      <Image src="/icons/wa.svg" alt="WhatsApp" width={25} height={25} />
                    </a>
                  </div>

                  {/* Email */}
                  <a
                    href="mailto:info@pmcars.by"
                    className="text-white font-montserrat text-base whitespace-nowrap hover:text-primary transition-colors"
                  >
                    info@pmcars.by
                  </a>

                  {/* Time */}
                  <div className="flex items-center gap-1">
                    <span className="text-white font-montserrat text-base whitespace-nowrap">10:00-20:00</span>
                    <Clock size={13} className="text-white/80" />
                  </div>

                  {/* Tracking button */}
                  <Link
                    href="/tracking"
                    className="inline-flex items-center gap-2 bg-[#f5f5f5] text-[#2d2c2c] pl-3 pr-4 py-[10px] rounded-lg font-montserrat text-sm whitespace-nowrap hover:bg-white transition-colors"
                  >
                    <Search size={17} />
                    Отслеживание авто
                  </Link>
                </div>

                {/* Top row — mobile */}
                <div className="xl:hidden flex items-center justify-between">
                  <a
                    href="tel:+375XXXXXXXXX"
                    className="text-white font-montserrat text-sm whitespace-nowrap"
                  >
                    +375 (XX) XXX-XX-XX
                  </a>
                  <a
                    href="https://t.me/pmcars"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 text-xs font-montserrat hover:text-primary transition-colors"
                  >
                    Telegram
                  </a>
                </div>

                {/* Bottom row — nav */}
                <nav className="hidden xl:block">
                  <ul className="flex items-center gap-8 h-10 font-montserrat text-base">
                    <li>
                      <Link href="/" className="text-white hover:text-primary transition-colors whitespace-nowrap">
                        Главная
                      </Link>
                    </li>
                    <li>
                      <Link href="/uslugi" className="text-white hover:text-primary transition-colors whitespace-nowrap">
                        Услуги
                      </Link>
                    </li>
                    <li>
                      <Link href="/dostavka" className="text-white hover:text-primary transition-colors whitespace-nowrap">
                        Доставка из США
                      </Link>
                    </li>
                    <li className="relative group self-stretch flex items-center">
                      <button className="flex items-center gap-2 text-white group-hover:text-primary transition-colors whitespace-nowrap">
                        Информация
                        <ChevronDown size={12} className="transition-transform group-hover:rotate-180" />
                      </button>
                      <div className="absolute top-full left-0 pt-1 z-50 hidden group-hover:block">
                        <ul className="bg-[#1b2e2f] border border-white/10 rounded-lg shadow-2xl min-w-[230px] overflow-hidden">
                          {infoLinks.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="block px-4 py-2.5 text-white/70 hover:text-primary hover:bg-white/5 transition-colors text-sm"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                    <li>
                      <Link href="/faq" className="text-white hover:text-primary transition-colors">
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href="/contacts" className="text-white hover:text-primary transition-colors">
                        Контакты
                      </Link>
                    </li>
                  </ul>
                </nav>

              </div>

              {/* Mobile burger (3×3 dots) */}
              <div className="xl:hidden ml-3 flex-shrink-0">
                <button
                  onClick={() => setMenuOpen(true)}
                  aria-label="Открыть меню"
                  className="p-1.5 flex flex-col gap-[5px]"
                >
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="flex gap-[5px]">
                      {[0, 1, 2].map((col) => (
                        <span key={col} className="block w-[5px] h-[5px] rounded-full bg-white/80" />
                      ))}
                    </div>
                  ))}
                </button>
              </div>

            </div>
          </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
