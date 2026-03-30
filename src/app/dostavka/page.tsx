// src/app/dostavka/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import { Check, X, ShieldCheck, Shield, AlertTriangle, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Доставка авто из США в Беларусь',
  description: 'Полная информация о доставке авто из США: аукционы Copart и IAAI, маршрут, сроки, стоимость, типы документов.',
}

const stages = [
  { title: 'Покупка на аукционе', days: '3–7 дней', text: 'Выигрываем лот, оплачиваем аукционный сбор и забираем авто с площадки.' },
  { title: 'Доставка до порта (США)', days: '7–14 дней', text: 'Транспортировка авто до портового склада. Чаще всего — Хьюстон, Балтимор, Нью-Джерси.' },
  { title: 'Морская перевозка', days: '30–45 дней', text: 'Погрузка в контейнер и отправка судном до европейского порта назначения.' },
  { title: 'Доставка в Беларусь', days: '5–10 дней', text: 'Автовоз или собственный ход из порта до Минска.' },
  { title: 'Таможенное оформление', days: '3–7 дней', text: 'Декларирование, уплата пошлин, получение ЭПТС.' },
]

const routes = [
  {
    badge: 'до 3.0 л',
    title: 'Через Клайпеду',
    sub: 'Литва',
    text: 'США → порт Клайпеда → автовоз → Минск. Для авто с объёмом двигателя до 3.0 л.',
  },
  {
    badge: 'от 3.0 л',
    title: 'Через Поти',
    sub: 'Грузия',
    text: 'США → порт Поти → автовоз → Минск. Для авто с объёмом двигателя от 3.0 л.',
  },
]

const docTypes = [
  {
    title: 'Clean Title',
    badgeColor: 'green' as const,
    icon: ShieldCheck,
    text: 'Чистый титул — авто не имеет страховых случаев. Самый предпочтительный вариант для регистрации в РБ.',
  },
  {
    title: 'Rebuilt Title',
    badgeColor: 'teal' as const,
    icon: Shield,
    text: 'Восстановленный титул — авто было повреждено и официально восстановлено. Допускается к регистрации в РБ.',
  },
  {
    title: 'Salvage Title',
    badgeColor: 'amber' as const,
    icon: AlertTriangle,
    text: 'Страховой тотал — авто признано не подлежащим восстановлению страховой компанией. Требует дополнительных документов при растаможке.',
  },
]

const included = [
  'Аукционный сбор (Copart / IAAI)',
  'Доставка по США до порта',
  'Морская перевозка до Европы',
  'Доставка из порта в Минск',
  'Услуги таможенного декларанта',
  'Таможенные пошлины и сборы',
  'Получение ЭПТС',
]

const notIncluded = [
  'Стоимость самого автомобиля',
  'Комиссия банка при переводе (20–100 BYN)',
  'Оформление документов (80–85 EUR)',
  'Страхование груза (опционально)',
]

export default function DostavkaPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">

        {/* Заголовок */}
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Доставка из США
        </h1>
        <p className="text-muted font-montserrat text-lg max-w-2xl mb-14 md:mb-16">
          Работаем с аукционами Copart и IAAI. Организуем полную логистику от аукционной площадки до вашего гаража.
        </p>

        {/* Маршрут и сроки */}
        <section id="marshrut" className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
          <h2 className="font-muller font-bold text-2xl text-body mb-4">Маршрут и сроки</h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Полный путь авто от аукционной площадки в США до вашего гаража занимает в среднем 60–90 дней.
          </p>
          <div className="flex flex-col">
            {stages.map((s, i) => (
              <div key={s.title} className="flex gap-5 items-start">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-muller font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < stages.length - 1 && (
                    <div className="w-[2px] flex-1 min-h-[2rem] bg-primary/20 mt-1 mb-1" />
                  )}
                </div>
                <div className={i < stages.length - 1 ? 'pb-5' : ''}>
                  <div className="flex flex-wrap items-center gap-3 mb-1 pt-1">
                    <h3 className="font-muller font-bold text-lg text-body">{s.title}</h3>
                    <span className="text-xs font-montserrat text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{s.days}</span>
                  </div>
                  <p className="font-montserrat text-sm text-muted leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Маршруты доставки */}
        <section id="dostavka" className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
          <h2 className="font-muller font-bold text-2xl text-body mb-4">Маршруты доставки</h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Порт назначения определяется объёмом двигателя — это влияет на размер таможенной пошлины.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((r) => (
              <div key={r.title} className="bg-light-bg rounded-2xl p-6 border border-gray-100 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary" strokeWidth={1.75} />
                </div>
                <div>
                  <span className="inline-block text-xs font-montserrat font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mb-2">{r.badge}</span>
                  <h3 className="font-muller font-bold text-lg text-body leading-tight mb-1">
                    {r.title} <span className="text-muted font-normal text-base">— {r.sub}</span>
                  </h3>
                  <p className="font-montserrat text-sm text-muted leading-relaxed">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Типы документов */}
        <section id="dokumenty" className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
          <h2 className="font-muller font-bold text-2xl text-body mb-4">Типы документов (Title)</h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            У каждого авто на американском аукционе есть титул — документ о праве собственности. Тип влияет на растаможку и регистрацию в РБ.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {docTypes.map((d) => {
              const Icon = d.icon
              const accent = { green: 'text-green-600', teal: 'text-primary', amber: 'text-amber-500' }[d.badgeColor]
              return (
                <div key={d.title} className="bg-light-bg rounded-2xl p-6 border border-gray-100">
                  <Icon size={20} className={`mb-4 ${accent}`} strokeWidth={1.75} />
                  <h3 className="font-muller font-bold text-lg text-body mb-2">{d.title}</h3>
                  <p className="font-montserrat text-sm text-muted leading-relaxed">{d.text}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Что входит */}
        <section id="stoimost">
          <h2 className="font-muller font-bold text-2xl text-body mb-4">Что входит в нашу работу</h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Фиксированная стоимость услуги покрывает весь комплекс работ без скрытых платежей.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-light-bg rounded-2xl p-6 border border-gray-100">
              <h3 className="font-muller font-bold text-base text-body mb-4">Входит в стоимость</h3>
              <ul className="flex flex-col gap-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-montserrat text-sm text-muted">
                    <Check size={15} className="text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-light-bg rounded-2xl p-6 border border-gray-100">
              <h3 className="font-muller font-bold text-base text-body mb-4">Оплачивается отдельно</h3>
              <ul className="flex flex-col gap-3">
                {notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-montserrat text-sm text-muted">
                    <X size={15} className="text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-dark-bg rounded-2xl p-8 md:p-10 mt-4">
            <div className="max-w-xl">
              <h3 className="font-muller font-bold text-2xl text-white mb-3">
                Остались вопросы?
              </h3>
              <p className="font-montserrat text-white/50 text-base mb-8 leading-relaxed">
                Расскажем подробнее о процессе, поможем рассчитать стоимость под ваш бюджет и подберём подходящий вариант.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/contacts" size="lg">Оставить заявку</Button>
                <a
                  href="https://t.me/pmcars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 text-white font-montserrat font-bold text-base hover:border-primary hover:text-primary transition-colors"
                >
                  Написать в Telegram
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
