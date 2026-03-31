// src/components/layout/MobileMenu.tsx
'use client'
import { X } from 'lucide-react'
import Link from 'next/link'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

type NavItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: { label: string; href: string }[] }

const navItems: NavItem[] = [
  { label: 'Главная', href: '/' },
{ label: 'Процесс покупки', href: '/protsess' },
  {
    label: 'Информация',
    children: [
      { label: 'Вопросы и ответы', href: '/faq' },
      { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
      { label: 'Калькулятор расходов', href: '/info/kalkulyator-rashod' },
      { label: 'ЭПТС', href: '/info/epts' },
      { label: 'ДКП', href: '/info/dkp' },
      { label: 'Снятие с учёта', href: '/info/snyatie' },
    ],
  },
  { label: 'Контакты', href: '/contacts' },
]


export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-dark-bg flex flex-col">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-white p-2" aria-label="Закрыть меню">
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
        <a href="tel:+375296363636" className="block text-primary text-xl font-bold font-montserrat mb-3">
          +375 (29) 636-36-36
        </a>
        <div className="flex gap-4">
          <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary text-sm">TG</a>
          <a href="https://wa.me/375296363636" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary text-sm">WA</a>
          <a href="viber://chat?number=+375296363636" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary text-sm">Viber</a>
        </div>
      </div>
    </div>
  )
}
