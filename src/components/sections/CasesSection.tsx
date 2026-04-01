// src/components/sections/CasesSection.tsx
import { Check } from 'lucide-react'

const PLACEHOLDER_CASES = [
  {
    car: 'Honda Accord 2020',
    auction: 'Copart · Texas',
    auctionPrice: '$8,200',
    totalPrice: '$16,500',
    work: ['Передний бампер', 'Покраска капота', 'Растаможка'],
  },
  {
    car: 'Toyota Camry 2019',
    auction: 'IAAI · Florida',
    auctionPrice: '$7,400',
    totalPrice: '$15,800',
    work: ['Замена лобового стекла', 'Подушки безопасности', 'Растаможка'],
  },
  {
    car: 'Kia Sorento 2021',
    auction: 'Copart · Georgia',
    auctionPrice: '$11,000',
    totalPrice: '$20,200',
    work: ['Боковая дверь', 'Покраска порога', 'Растаможка'],
  },
]

export default function CasesSection() {
  return (
    <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
      <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
        Реальные пригоны
      </h2>
      <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
        Примеры автомобилей, которые мы доставили клиентам.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {PLACEHOLDER_CASES.map((c) => (
          <div
            key={c.car}
            className="bg-light-bg rounded-2xl p-6 border border-gray-100 flex flex-col"
          >
            <h3 className="font-muller font-bold text-lg text-body mb-1">{c.car}</h3>
            <p className="font-montserrat text-xs text-muted mb-4">{c.auction}</p>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-montserrat text-xs text-muted mb-0.5">Аукцион</p>
                <p className="font-muller font-bold text-base text-body">{c.auctionPrice}</p>
              </div>
              <span className="text-muted/30 font-muller font-bold">→</span>
              <div className="text-right">
                <p className="font-montserrat text-xs text-muted mb-0.5">Под ключ</p>
                <p className="font-muller font-bold text-base text-primary">{c.totalPrice}</p>
              </div>
            </div>
            <ul className="flex flex-col gap-1 mb-5 flex-1">
              {c.work.map((w) => (
                <li key={w} className="flex items-start gap-2 font-montserrat text-xs text-muted">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1.5 text-xs font-montserrat font-semibold text-primary">
              <Check size={12} strokeWidth={2.5} />
              Передан клиенту
            </span>
          </div>
        ))}
      </div>
      <div className="bg-light-bg rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="font-montserrat text-sm text-muted">
          Данные обновляются — свяжитесь с нами чтобы получить актуальные примеры
        </p>
        <a
          href="https://t.me/pmcars"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          Написать в Telegram
        </a>
      </div>
    </section>
  )
}
