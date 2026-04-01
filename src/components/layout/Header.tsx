// src/components/layout/Header.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Search, Clock, Calculator } from 'lucide-react'
import MobileMenu from './MobileMenu'

const infoLinks: { label: string; href: string }[] = [
  { label: 'Вопросы и ответы', href: '/faq' },
  { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
  { label: 'ЭПТС', href: '/info/epts' },
  { label: 'ДКП', href: '/info/dkp' },
  { label: 'Снятие с учёта', href: '/info/snyatie' },
  { label: 'Страхование груза', href: '/info/strahovanie' },
  { label: 'Для дилеров', href: '/info/dlya-dilerov' },
  { label: 'Типы повреждений', href: '/info/tipy-povrezhdeniy' },
  { label: 'Аукционный лист', href: '/info/auktsionnyy-list' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-2 inset-x-0 mx-auto w-[calc(100%-1rem)] max-w-[1200px] z-40 bg-dark-bg border border-white/[0.08] rounded-2xl shadow-2xl">
        <div className="px-5 xl:px-6 h-[80px] flex items-center">
          <div className="flex items-center gap-6 w-full h-full">

              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/logo.svg"
                    alt="pmcars.by"
                    width={130}
                    height={36}
                    priority
                    className="w-auto h-[36px]"
                  />
                </Link>
              </div>

              {/* Right section */}
              <div className="flex-1 min-w-0 flex items-center h-full">

                {/* Mobile top row */}
                <div className="xl:hidden flex items-center justify-between">
                  <a
                    href="tel:+375296363636"
                    className="text-white font-montserrat text-sm whitespace-nowrap"
                  >
                    +375 (29) 636-36-36
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

                {/* Desktop layout */}
                <div className="hidden xl:flex items-center gap-5 flex-1 h-full">

                  {/* Left: info + nav stacked */}
                  <div className="flex-1 flex flex-col items-start gap-0 pt-[4px]">

                    {/* Info row */}
                    <div className="flex items-center gap-3">
                      {/* Social */}
                      <div className="flex items-center gap-1">
                        <a href="https://tiktok.com/@pmcars" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                          <Image src="/icons/tt.svg" alt="TikTok" width={18} height={18} />
                        </a>
                        <a href="https://instagram.com/pmcars" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                          <Image src="/icons/inst.svg" alt="Instagram" width={18} height={18} />
                        </a>
                        <a href="https://youtube.com/@pmcars" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                          <Image src="/icons/yt.svg" alt="YouTube" width={18} height={18} />
                        </a>
                      </div>

                      <div className="w-px h-3.5 bg-white/15" />

                      {/* Phone */}
                      <a href="tel:+375296363636" className="text-white font-montserrat text-[15px] whitespace-nowrap hover:text-primary transition-colors">
                        +375 (29) 636-36-36
                      </a>

                      {/* Messengers */}
                      <div className="flex items-center gap-1">
                        <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                          <Image src="/icons/tg.svg" alt="Telegram" width={18} height={18} />
                        </a>
                        <a href="viber://chat?number=+375296363636" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                          <Image src="/icons/vb.svg" alt="Viber" width={18} height={18} />
                        </a>
                        <a href="https://wa.me/375296363636" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                          <Image src="/icons/wa.svg" alt="WhatsApp" width={18} height={18} />
                        </a>
                      </div>

                      <div className="w-px h-3.5 bg-white/15" />

                      {/* Time */}
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-white/50" />
                        <span className="text-white/60 font-montserrat text-[15px] whitespace-nowrap">10:00–20:00</span>
                      </div>
                    </div>

                    {/* Nav */}
                    <nav>
                      <ul className="flex items-center gap-6 h-[2rem] font-montserrat text-[15px]">
                        <li>
                          <Link href="/" className="text-white/80 hover:text-primary transition-colors whitespace-nowrap">
                            Главная
                          </Link>
                        </li>
                        <li>
                          <Link href="/protsess" className="text-white/80 hover:text-primary transition-colors whitespace-nowrap">
                            Процесс покупки
                          </Link>
                        </li>
                        <li className="relative group self-stretch flex items-center">
                          <button className="flex items-center gap-1.5 text-white/80 group-hover:text-primary transition-colors whitespace-nowrap">
                            Информация
                            <ChevronDown size={12} className="transition-transform group-hover:rotate-180" />
                          </button>
                          <div className="absolute top-full left-0 pt-1 z-50 hidden group-hover:block">
                            <ul className="bg-dark-card border border-white/10 rounded-lg shadow-2xl min-w-[230px] overflow-hidden">
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
                          <Link href="/contacts" className="text-white/80 hover:text-primary transition-colors">
                            Контакты
                          </Link>
                        </li>
                      </ul>
                    </nav>

                  </div>{/* end left column */}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href="/tracking"
                      className="inline-flex items-center gap-2 bg-white/10 text-white/70 px-3.5 py-2 rounded-lg font-montserrat text-sm whitespace-nowrap hover:bg-white/15 hover:text-white transition-colors"
                    >
                      <Search size={13} />
                      Отслеживание авто
                    </Link>
                    <Link
                      href="/info/kalkulyator-rashod"
                      className="inline-flex items-center gap-2 bg-white/10 text-white/70 px-3.5 py-2 rounded-lg font-montserrat text-sm whitespace-nowrap hover:bg-white/15 hover:text-white transition-colors"
                    >
                      <Calculator size={13} />
                      Калькулятор расходов
                    </Link>
                  </div>

                </div>

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
