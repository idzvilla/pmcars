// src/app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Accordion from '@/components/ui/Accordion'
import { Check, ShieldCheck, FileText, Star, Users } from 'lucide-react'
import CasesSection from '@/components/sections/CasesSection'

export const metadata: Metadata = {
  title: 'Авто из США в Беларусь под ключ | pmcars.by',
  description: 'Импорт автомобилей из США в Беларусь под ключ. Подбор на Copart и IAAI, доставка, растаможка. Официальный договор, без скрытых комиссий.',
}

const steps = [
  {
    title: 'Рассказываете что хотите',
    text: 'Бюджет, марка, пожелания по состоянию. Находим подходящие лоты и присылаем подборку с разбором каждого.',
  },
  {
    title: 'Выбираете — мы торгуемся',
    text: 'Вы одобряете лот, подписываем договор, вносите депозит. Участвуем в торгах от вашего имени.',
  },
  {
    title: 'Авто едет морем',
    text: 'Забираем с площадки, грузим в контейнер, отправляем. Держим в курсе где авто прямо сейчас.',
  },
  {
    title: 'Забираете в Минске',
    text: 'Встречаем в порту, оформляем таможню, получаем ЭПТС. Передаём ключи.',
  },
]

const advantages = [
  {
    icon: ShieldCheck,
    title: 'Официальный договор',
    text: 'Каждая сделка закреплена договором. Ваши деньги защищены юридически с первого платежа.',
  },
  {
    icon: FileText,
    title: 'Никаких скрытых комиссий',
    text: 'Показываем все расходы до старта. Платите ровно то, что в смете — ни рублём больше.',
  },
  {
    icon: Star,
    title: 'США, Китай, Корея',
    text: 'Работаем с мировыми аукционами — Copart, IAAI и азиатские площадки. Знаем рынки изнутри, это даёт преимущество при подборе и торгах.',
  },
  {
    icon: Users,
    title: 'Один менеджер от и до',
    text: 'Один человек ведёт вас от подбора до ключей — не передаём между отделами.',
  },
]

const tariffs = [
  {
    title: 'Экспресс',
    price: '300 руб',
    priceNote: null,
    highlighted: false,
    features: [
      'Вы присылаете номер лота и ставку',
      'Проведение аукциона',
      'Организация доставки',
      'Отчёт CarFax бесплатно',
    ],
  },
  {
    title: 'Стандартный',
    price: '600 руб',
    priceNote: null,
    highlighted: true,
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
    price: 'Индивидуально',
    priceNote: 'для ИП и юр. лиц',
    highlighted: false,
    features: [
      'Доступ к брокерскому аккаунту',
      'Сопровождение при покупке',
      'Сопровождение в доставке',
      'Условия обсуждаются индивидуально',
    ],
  },
]

const faqItems = [
  {
    question: 'Сколько стоит услуга по доставке авто из США?',
    answer: 'Тариф «Экспресс» — 300 руб (вы присылаете готовый лот, мы проводим аукцион и организуем доставку). Тариф «Стандартный» — 600 руб (включает подбор авто, консультацию по лоту, оценку повреждений). Корпоративным клиентам — индивидуально.',
  },
  {
    question: 'Какой срок доставки авто из США?',
    answer: 'В среднем 2–3 месяца: 1–2 недели на покупку и отправку, 30–45 дней морем, 2–3 недели на таможню и оформление.',
  },
  {
    question: 'Что включено в итоговую стоимость авто?',
    answer: 'Аукционный сбор, доставка по США до порта, морская перевозка, доставка из порта в РБ, растаможка и таможенные платежи, услуги декларанта.',
  },
  {
    question: 'Как происходит оплата?',
    answer: 'Оплата по инвойсу через банковский перевод. В связи с санкциями переводы идут через компании-посредники, комиссия 4–5%. Плюс комиссия банка РБ: 20–100 BYN и 80–85 EUR за оформление документов.',
  },
  {
    question: 'Можно ли отследить где находится мой автомобиль?',
    answer: 'Да. После покупки мы предоставляем трекинг-данные и регулярно обновляем статус доставки. Также вы можете воспользоваться разделом «Отслеживание авто» на нашем сайте.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-dark-bg via-[#0f1f2e] to-dark-bg">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />
        <div className="container py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
              Авто с мировых аукционов • Беларусь
            </p>
            <h1 className="font-muller font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Авто из&nbsp;США, Китая и&nbsp;Кореи под&nbsp;ключ
            </h1>
            <p className="text-white/60 font-montserrat text-lg mb-8 leading-relaxed">
              Подбираем так, чтобы не было стыдно. Официальный договор, фиксированная стоимость услуг.
            </p>
            <div className="flex flex-wrap gap-4 mb-14">
              <Button href="/info/kalkulyator-rashod" size="lg">
                Рассчитать стоимость
              </Button>
              <a
                href="https://t.me/pmcars"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-montserrat font-bold text-base hover:border-primary hover:text-primary transition-colors"
              >
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

    <div className="py-16 md:py-24">
      <div className="container">

        {/* Как это работает */}
        <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Как это работает
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            От вашего звонка до ключей в Минске — четыре шага.
          </p>
          <div className="flex flex-col max-w-2xl">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-muller font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-[2px] flex-1 min-h-[2rem] bg-primary/20 mt-1 mb-1" />
                  )}
                </div>
                <div className={i < steps.length - 1 ? 'pb-6' : ''}>
                  <h3 className="font-muller font-bold text-lg text-body mb-1 pt-1">{s.title}</h3>
                  <p className="font-montserrat text-sm text-muted leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Почему работают с нами */}
        <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Почему работают с нами
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Работаем только с США — знаем Copart и IAAI изнутри.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advantages.map((a) => (
              <div key={a.title} className="bg-light-bg rounded-2xl p-6 border border-gray-100">
                <a.icon size={22} strokeWidth={1.5} className="text-primary mb-4" />
                <h3 className="font-muller font-bold text-base text-body mb-2">{a.title}</h3>
                <p className="font-montserrat text-sm text-muted leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        <CasesSection />

        {/* Стоимость услуг */}
        <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Стоимость услуг
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Фиксированная цена за нашу работу. Всё остальное — по фактическим затратам, без накруток.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {tariffs.map((t) => (
              <div
                key={t.title}
                className={`bg-light-bg rounded-2xl p-6 border flex flex-col ${
                  t.highlighted ? 'border-primary' : 'border-gray-100'
                }`}
              >
                <h3 className="font-muller font-bold text-lg text-body mb-1">{t.title}</h3>
                <p className="text-2xl font-muller font-bold text-primary mb-1">{t.price}</p>
                {t.priceNote
                  ? <p className="font-montserrat text-xs text-muted mb-4">{t.priceNote}</p>
                  : <div className="mb-4" />
                }
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-montserrat text-sm text-muted">
                      <Check size={14} strokeWidth={2.5} className="text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contacts"
                  className={`inline-flex w-full justify-center items-center px-5 py-3 rounded-xl font-montserrat font-bold text-sm transition-colors ${
                    t.highlighted
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'border border-gray-200 text-body hover:border-primary hover:text-primary'
                  }`}
                >
                  Оставить заявку
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Калькулятор расходов */}
        <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
          <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
            <div className="max-w-xl">
              <h3 className="font-muller font-bold text-2xl text-white mb-3">
                Хотите узнать полную стоимость?
              </h3>
              <p className="font-montserrat text-white/50 text-base mb-8 leading-relaxed">
                Считаем точно: цена авто + доставка + таможня — без сюрпризов.
              </p>
              <Link
                href="/info/kalkulyator-rashod"
                className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Открыть калькулятор →
              </Link>
            </div>
          </div>
        </section>

        {/* Частые вопросы */}
        <section className="mb-14 md:mb-16">
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Частые вопросы
          </h2>
          <div className="max-w-2xl mb-6">
            <Accordion items={faqItems} />
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center px-5 py-3 rounded-xl border border-gray-200 text-body font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
          >
            Все вопросы и ответы →
          </Link>
        </section>

        {/* CTA */}
        <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
          <div className="max-w-xl">
            <h3 className="font-muller font-bold text-2xl text-white mb-3">
              Готовы начать?
            </h3>
            <p className="font-montserrat text-white/50 text-base mb-8 leading-relaxed">
              Оставьте заявку — свяжемся в течение часа и рассчитаем стоимость под ваш бюджет.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://t.me/pmcars"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Написать в Telegram
              </a>
              <Link
                href="/contacts"
                className="inline-flex items-center px-6 py-3.5 rounded-xl border border-white/20 text-white font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
              >
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}
