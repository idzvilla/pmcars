// src/components/sections/TariffsSection.tsx
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'
import Link from 'next/link'

const tariffs = [
  {
    title: 'Экспресс',
    price: '300 руб',
    priceNote: null,
    features: [
      'Без консультаций сотрудников: вы присылаете номер лота и ставку по нему',
      'Проведение аукциона',
      'Организация доставки',
      'Отчёт CarFax бесплатно',
    ],
    highlighted: false,
  },
  {
    title: 'Стандартный',
    price: '600 руб',
    priceNote: null,
    features: [
      'Подбор авто (лотов)',
      'Консультация по найденному лоту: оценка степени проникновения удара, проверка истории',
      'Проведение аукциона',
      'Организация доставки',
      'Отчёт CarFax бесплатно',
    ],
    highlighted: true,
  },
  {
    title: 'Корпоративный',
    price: 'Индивидуально',
    priceNote: 'для ИП и юр. лиц',
    features: [
      'Доступ к брокерскому аккаунту',
      'Сопровождение при покупке',
      'Сопровождение в доставке',
      'Условия обсуждаются индивидуально',
    ],
    highlighted: false,
  },
]

export default function TariffsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="mb-12">
          <div className="w-10 h-[3px] bg-primary mb-5" />
          <div className="lg:flex lg:items-end lg:gap-16">
            <h2 className="font-muller font-bold text-3xl md:text-4xl text-body mb-4 lg:mb-0 lg:w-64 flex-shrink-0">
              Стоимость услуг
            </h2>
            <p className="text-muted font-montserrat max-w-md">
              Фиксированная цена за нашу работу. Всё остальное — по фактическим затратам, без накруток.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tariffs.map((t) => (
            <div
              key={t.title}
              className={`rounded-2xl p-8 flex flex-col border-2 transition-all ${
                t.highlighted
                  ? 'border-primary bg-primary/5 shadow-xl shadow-primary/15 lg:-mt-5'
                  : 'border-gray-100 bg-light-bg'
              }`}
            >
              <h3 className="font-muller font-bold text-xl text-body mb-2">{t.title}</h3>
              <p className="text-3xl font-muller font-bold text-primary mb-1">{t.price}</p>
              {t.priceNote && (
                <p className="font-montserrat text-xs text-muted mb-4">{t.priceNote}</p>
              )}
              {!t.priceNote && <div className="mb-4" />}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-montserrat text-sm text-muted">
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
        <p className="text-left font-montserrat text-sm text-muted mt-8">
          Хотите узнать полную стоимость авто включая доставку и таможню?{' '}
          <Link href="/info/kalkulyator-rashod" className="text-primary hover:underline font-bold">
            Калькулятор расходов →
          </Link>
        </p>
      </div>
    </section>
  )
}
