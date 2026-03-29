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
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-4">
          Стоимость услуги
        </h2>
        <p className="text-muted font-montserrat text-center mb-12 max-w-xl mx-auto">
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
              <h3 className="font-muller font-bold text-xl text-body mb-2">{t.title}</h3>
              <p className="text-3xl font-muller font-bold text-primary mb-6">{t.price}</p>
              <ul className="flex flex-col gap-2 mb-8 flex-1">
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
      </div>
    </section>
  )
}
