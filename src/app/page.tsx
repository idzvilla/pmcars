// src/app/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import Accordion from '@/components/ui/Accordion'
import { Check, ShieldCheck, FileText, Star, Users } from 'lucide-react'
import CasesSection from '@/components/sections/CasesSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import TrustBarSection from '@/components/sections/TrustBarSection'

export const metadata: Metadata = {
  title: 'Авто из США в Беларусь дешевле на 30–50% | pmcars.by',
  description: 'Импортируем авто из США в Беларусь под ключ. Подбор на Copart и IAAI, доставка морем, растаможка. 200+ авто, 8 лет на рынке. Договор и фиксированная цена с первого дня.',
}

const steps = [
  {
    title: 'Опишите что хотите — получите подборку за день',
    text: 'Бюджет, марка, пожелания. Найдём подходящие лоты и разберём каждый: повреждения, история, реальная стоимость.',
  },
  {
    title: 'Вы выбираете — мы выигрываем торги',
    text: 'Подписываем договор, вносите депозит. Торгуемся на Copart или IAAI от вашего имени.',
  },
  {
    title: 'Следите за доставкой в реальном времени',
    text: 'Забираем авто с площадки → контейнер → море (30–45 дней). Трекинг и обновления статуса.',
  },
  {
    title: 'Получаете ключи в Минске',
    text: 'Таможня, ЭПТС, все документы — на нас. Вы забираете готовое авто.',
  },
]

const advantages = [
  {
    icon: ShieldCheck,
    title: 'Договор до первого платежа',
    text: 'Сумма фиксируется в договоре до того, как вы переведёте хоть рубль. Если что-то идёт не по плану — у вас есть юридическая защита.',
  },
  {
    icon: FileText,
    title: 'Видите каждый рубль в смете',
    text: 'Аукцион, доставка по США, морская перевозка, таможня, наши услуги — всё расписано. Итоговая сумма не меняется.',
  },
  {
    icon: Star,
    title: '8 лет только на Copart и IAAI',
    text: 'Не разбрасываемся на Корею и Европу. Знаем стратегии торгов, подводные камни аукционов, реальное состояние лотов по фото.',
  },
  {
    icon: Users,
    title: 'Один человек от старта до ключей',
    text: 'Ваш менеджер знает всю историю — не нужно ничего объяснять дважды.',
  },
]

const tariffs = [
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
    badge: 'Популярный выбор',
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

const faqItems = [
  {
    question: 'А если авто окажется хуже, чем на фото?',
    answer: 'Мы проверяем каждый лот по истории (CarFax), фото и описанию аукциона. Если видим риск — говорим прямо и предлагаем другой вариант. После покупки делаем фотофиксацию состояния.',
  },
  {
    question: 'Как защищены мои деньги?',
    answer: 'Договор подписывается до первого платежа. Все суммы зафиксированы. Оплата идёт по инвойсам через банковский перевод — у вас полная финансовая прозрачность.',
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
    question: 'Как происходит оплата и почему есть комиссия 4–5%?',
    answer: 'Оплата по инвойсу через банковский перевод. В связи с санкциями переводы идут через компании-посредники — это стандарт рынка, не наша накрутка. Комиссия 4–5% плюс комиссия банка РБ: 20–100 BYN и 80–85 EUR за оформление документов.',
  },
  {
    question: 'Можно ли отследить где находится мой автомобиль?',
    answer: 'Да. После покупки предоставляем трекинг-данные и регулярно обновляем статус. Также есть раздел «Отслеживание авто» на сайте.',
  },
  {
    question: 'Сколько стоит услуга?',
    answer: 'Тариф «Экспресс» — 300 BYN (вы присылаете лот, мы проводим аукцион и организуем доставку). Тариф «Стандартный» — 600 BYN (включает подбор, консультацию по лоту, оценку повреждений). Корпоративным клиентам — от 900 BYN, обсуждаем объём.',
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
            <p className="inline-flex items-center gap-2 text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              200+ авто доставлено · Работаем с 2017 года
            </p>
            <h1 className="font-muller font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Авто из&nbsp;США дешевле на&nbsp;30–50%, чем на&nbsp;рынке в&nbsp;Беларуси
            </h1>
            <p className="text-white/60 font-montserrat text-lg mb-8 leading-relaxed">
              Подберём на Copart или IAAI, доставим морем, растаможим. Получите ключи в Минске через 2–3 месяца. Договор и фиксированная цена — с первого дня.
            </p>
            <div className="flex flex-wrap gap-4 mb-14">
              <Button href="/info/kalkulyator-rashod" size="lg">
                Рассчитать стоимость моего авто
              </Button>
              <Button href="https://t.me/plusminus_cars" variant="ghost" size="lg" external>
                Написать в Telegram
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustBarSection />

    <div className="py-16 md:py-24">
      <div className="container">

        {/* Как это работает */}
        <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            От звонка до ключей — 4 шага и 2–3 месяца
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Вы занимаетесь своими делами — мы везём.
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
            Прозрачность на каждом этапе
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Никаких «не знаем, позвоните позже». Всё фиксируем, всё объясняем.
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
            Выберите свой формат
          </h2>
          <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
            Фиксированная цена за нашу работу. Всё остальное — по фактическим затратам, без накруток.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {tariffs.map((t) => (
              <div
                key={t.title}
                className={`bg-light-bg rounded-2xl p-6 border flex flex-col relative ${
                  t.highlighted ? 'border-primary' : 'border-gray-100'
                }`}
              >
                {t.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center px-3 py-1 rounded-full bg-primary text-white font-montserrat font-bold text-xs">
                    {t.badge}
                  </span>
                )}
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
        </section>

        {/* Калькулятор расходов */}
        <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
          <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
            <div className="max-w-xl">
              <h3 className="font-muller font-bold text-2xl text-white mb-3">
                Хотите узнать полную стоимость?
              </h3>
              <p className="font-montserrat text-white/60 text-base mb-8 leading-relaxed">
                Считаем точно: цена авто + доставка + таможня — без сюрпризов.
              </p>
              <Button href="/info/kalkulyator-rashod">
                Открыть калькулятор →
              </Button>
            </div>
          </div>
        </section>

        <ReviewsSection />

        {/* Частые вопросы */}
        <section className="mb-14 md:mb-16">
          <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
            Частые вопросы
          </h2>
          <div className="max-w-2xl mb-6">
            <Accordion items={faqItems} />
          </div>
          <Button href="/faq" variant="secondary">
            Все вопросы и ответы →
          </Button>
        </section>

        {/* CTA */}
        <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
          <div className="max-w-xl">
            <h3 className="font-muller font-bold text-2xl text-white mb-3">
              Узнайте, сколько будет стоить ваше авто
            </h3>
            <p className="font-montserrat text-white/60 text-base mb-3 leading-relaxed">
              Напишите нам — рассчитаем полную стоимость под ваш бюджет за 1 час.
            </p>
            <p className="font-montserrat text-white/40 text-sm mb-8">
              Бесплатно, без обязательств. Уже помогли 200+ клиентам.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="https://t.me/plusminus_cars" external>
                Написать в Telegram
              </Button>
              <Button href="/contacts" variant="ghost">
                Оставить заявку
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}
