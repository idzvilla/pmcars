import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'

export const tariffs = [
  {
    title: 'Экспресс',
    price: '300 BYN',
    priceNote: null,
    badge: null,
    highlighted: false,
    cta: 'Начать с Экспресс',
    ctaHref: 'https://t.me/plusminus_cars',
    ctaExternal: true,
    features: [
      'Вы присылаете номер лота и ставку',
      'Проведение аукциона',
      'Организация доставки',
      'Отчёт CarFax бесплатно',
    ],
  },
  {
    title: 'Стандартный',
    price: '600 BYN',
    priceNote: null,
    badge: null,
    highlighted: true,
    cta: 'Выбрать Стандартный',
    ctaHref: 'https://t.me/plusminus_cars',
    ctaExternal: true,
    features: [
      'Подбор авто на аукционе',
      'Консультация по лоту: повреждения, история',
      'Проведение аукциона',
      'Организация доставки',
      'Отчёт CarFax бесплатно',
    ],
  },
  {
    title: 'Корпоративный',
    price: 'от 900 BYN',
    priceNote: 'для ИП и юр. лиц, обсуждаем объём',
    badge: null,
    highlighted: false,
    cta: 'Обсудить условия',
    ctaHref: 'https://t.me/plusminus_cars',
    ctaExternal: true,
    features: [
      'Доступ к брокерскому аккаунту',
      'Сопровождение при покупке',
      'Сопровождение в доставке',
      'Условия обсуждаются индивидуально',
    ],
  },
]

export function TariffGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
      {tariffs.map((t) => (
        <div
          key={t.title}
          className={`flex flex-col p-7 relative ${t.highlighted ? 'bg-[#f0fdfd]' : 'bg-white'}`}
        >
          {t.badge && (
            <span className="absolute top-5 right-5 inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-montserrat font-bold text-xs">
              {t.badge}
            </span>
          )}
          <h3 className="font-muller font-bold text-lg text-body mb-1">{t.title}</h3>
          <p className="text-3xl font-muller font-bold text-body mb-1">{t.price}</p>
          {t.priceNote
            ? <p className="font-montserrat text-xs text-muted mb-5">{t.priceNote}</p>
            : <div className="mb-5" />
          }
          <ul className="flex flex-col gap-3 mb-8 flex-1">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 font-montserrat text-sm text-muted">
                <Check size={14} strokeWidth={2.5} className="text-primary flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            href={t.ctaHref}
            variant={t.highlighted ? 'primary' : 'secondary'}
            className="w-full justify-center"
            external={t.ctaExternal}
          >
            {t.cta}
          </Button>
        </div>
      ))}
    </div>
  )
}

export default function TariffsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-4xl md:text-5xl text-body tracking-tight text-center mb-4">
          Стоимость услуг
        </h2>
        <p className="text-muted font-montserrat text-center mb-14 max-w-xl mx-auto text-lg">
          Фиксированная цена за нашу работу. Всё остальное — по фактическим затратам, без накруток.
        </p>
        <TariffGrid />
      </div>
    </section>
  )
}
