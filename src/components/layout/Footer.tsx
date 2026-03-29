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
              <a href="viber://chat?number=+375XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Viber</a>
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
