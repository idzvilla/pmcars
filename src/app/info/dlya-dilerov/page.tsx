// src/app/info/dlya-dilerov/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Building2, TrendingDown, Users, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Для дилеров и ИП — корпоративный импорт авто из США | pmcars.by',
  description: 'Условия для ИП и юридических лиц: брокерский аккаунт, параллельные сделки, корпоративный договор.',
}

const BENEFITS = [
  {
    icon: TrendingDown,
    title: 'Аукционные сборы ниже',
    text: 'При покупке через наш брокерский аккаунт сборы аукциона ниже, чем при прямом участии. Аукционам выгоднее работать через профессиональных брокеров — экономия на каждой машине.',
  },
  {
    icon: Users,
    title: 'Параллельные сделки',
    text: 'Ведём несколько автомобилей одновременно. Каждый лот отслеживается отдельно — вы получаете актуальный статус по каждой машине.',
  },
  {
    icon: FileText,
    title: 'Корпоративный договор',
    text: 'Работаем по корпоративному договору с закрытыми ценами. Полная отчётность по каждой сделке для бухгалтерии.',
  },
  {
    icon: Building2,
    title: 'Приоритетное сопровождение',
    text: 'Корпоративные клиенты получают выделенного менеджера и приоритет при подборе лотов.',
  },
]

const SUITABLE_FOR = [
  'ИП, занимающиеся продажей автомобилей',
  'Автосалоны и дилерские центры',
  'Частные перекупщики с постоянным объёмом',
  'Компании, закупающие автопарк',
  'Юридические лица любой формы собственности',
]

export default function DlyaDilerovPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <p className="text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
          Корпоративным клиентам
        </p>
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Для дилеров и ИП
        </h1>
        <p className="text-muted font-montserrat text-lg mb-10">
          Отдельные условия для бизнеса: брокерский аккаунт, корпоративный договор,
          параллельное ведение сделок.
        </p>

        <div className="space-y-10">

          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-5">Кому подходит</h2>
            <ul className="flex flex-col gap-2 font-montserrat text-muted">
              {SUITABLE_FOR.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-5">Что включает</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <div key={b.title} className="bg-light-bg rounded-2xl p-6 border border-gray-100">
                  <b.icon className="w-6 h-6 text-primary mb-3" strokeWidth={1.5} />
                  <h3 className="font-muller font-bold text-base text-body mb-2">{b.title}</h3>
                  <p className="font-montserrat text-sm text-muted leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Почему выгоднее через брокера</h2>
            <div className="bg-light-bg rounded-2xl p-6 border border-gray-100 font-montserrat text-muted leading-relaxed">
              <p className="mb-3">
                Аукционы Copart и IAAI начисляют сборы по разным тарифным сеткам — для
                розничных покупателей и для лицензированных брокеров. Брокерские ставки
                существенно ниже: аукционам выгоднее работать с профессионалами, которые
                обеспечивают стабильный поток сделок.
              </p>
              <p>
                При покупке через нашу компанию вы автоматически получаете брокерские условия —
                без необходимости самостоятельно регистрироваться и проходить верификацию.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Тариф</h2>
            <div className="bg-light-bg rounded-2xl p-6 border border-primary/30">
              <p className="font-muller font-bold text-2xl text-primary mb-1">Индивидуально</p>
              <p className="font-montserrat text-sm text-muted mb-4">для ИП и юр. лиц</p>
              <ul className="flex flex-col gap-2 font-montserrat text-sm text-muted">
                {[
                  'Доступ к брокерскому аккаунту',
                  'Сопровождение при покупке',
                  'Сопровождение в доставке',
                  'Корпоративный договор',
                  'Условия обсуждаются индивидуально',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={14} strokeWidth={2.5} className="text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </div>

        <div className="mt-10 bg-dark-bg rounded-2xl p-7">
          <h3 className="font-muller font-bold text-xl text-white mb-2">
            Обсудить условия
          </h3>
          <p className="font-montserrat text-white/50 text-sm mb-5">
            Расскажите о вашем объёме — подберём оптимальные условия сотрудничества.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://t.me/pmcars"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Написать в Telegram
            </a>
            <Link
              href="/contacts"
              className="inline-flex items-center px-5 py-3 rounded-xl border border-white/20 text-white font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Оставить заявку
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
