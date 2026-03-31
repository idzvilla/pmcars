'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const SECTIONS = [
  { id: 'kak-my-rabotaem', label: 'Как мы работаем' },
  { id: 'protsess', label: 'Процесс покупки' },
  { id: 'oplata', label: 'Оплата и договор' },
  { id: 'dostavka', label: 'Доставка и растаможка' },
  { id: 'poluchenie', label: 'Получение авто в РБ' },
  { id: 'info', label: 'Полезная информация' },
]

const PAYMENT_STAGES = [
  {
    num: 1,
    title: 'Договор и предоплата',
    text: 'После согласования условий подписывается договор и вносится предоплата за услуги компании.',
  },
  {
    num: 2,
    title: 'Оплата автомобиля',
    text: 'После выигрыша на аукционе вы оплачиваете стоимость лота, аукционные сборы и почтовые услуги. Оплата официальная с подтверждением всех операций.',
  },
  {
    num: 3,
    title: 'Доставка',
    text: 'Оплачивается логистика: доставка по США, морская доставка, доставка в Беларусь по прибытию в порт назначения.',
  },
  {
    num: 4,
    title: 'Таможенные платежи',
    text: 'Оплата производится при оформлении авто в Республике Беларусь.',
  },
]

const PURCHASE_STEPS = [
  {
    title: 'Заявка и консультация',
    text: 'Вы оставляете заявку или связываетесь с нами удобным способом. Мы уточняем бюджет, обсуждаем какой автомобиль нужен, объясняем как проходит покупка и делаем предварительный расчёт. Уже на этом этапе вы понимаете: сколько примерно будет стоить авто «под ключ» и какие есть варианты.',
    bullets: null,
  },
  {
    title: 'Подбор автомобиля',
    text: 'Подбираем реальные лоты с аукционов США (Copart, IAAI, Manheim). Вы получаете:',
    bullets: [
      'подбор под ваш бюджет',
      'фото и описание авто',
      'отчёт CARFAX / история',
      'анализ повреждений',
      'прогноз стоимости ремонта',
    ],
  },
  {
    title: 'Согласование и расчёт',
    text: 'Перед покупкой вы точно знаете: финальную стоимость авто при согласованной ставке, расходы на доставку, таможенные платежи и ориентировочную стоимость ремонта. Никаких «доплат по ходу».',
    bullets: null,
  },
  {
    title: 'Участие в торгах',
    text: 'Наша задача — купить автомобиль, который будет выгоден и оправдает вложения. Согласовываем максимальную ставку, участвуем в онлайн-торгах, не превышаем ваш бюджет. Вы можете присутствовать онлайн, в офисе или доверить процесс нам. Если авто не выиграли — подбираем другие варианты, вы ничего не теряете.',
    bullets: null,
  },
  {
    title: 'Оплата и оформление',
    text: 'После покупки вы получаете скриншот из кабинета аукциона и официальный инвойс. В инвойсе указана итоговая сумма: стоимость автомобиля + аукционный сбор. Оплата производится через банк по SWIFT-переводу — мы объясняем как правильно заполнить платёж и подсказываем банки.',
    bullets: null,
  },
  {
    title: 'Доставка из США',
    text: 'Организовываем логистику: доставка по США до порта, погрузка в контейнер, отправка в Европу, доставка в Беларусь. Вы можете отслеживать авто на каждом этапе — мы сообщаем статусы и сроки.',
    bullets: null,
  },
  {
    title: 'Таможенное оформление',
    text: 'Помогаем пройти растаможку в Беларуси: подготовка документов, расчёт платежей, сопровождение процесса.',
    bullets: null,
  },
  {
    title: 'Получение автомобиля',
    text: 'Вы получаете авто в Беларуси (Гомель или другой город). Проверяете автомобиль, оформляете документы. На каждом этапе вы знали: где находится ваш автомобиль, сколько уже потрачено и что будет дальше.',
    bullets: null,
  },
]

export default function ProtsessPageClient() {
  const [activeSection, setActiveSection] = useState('kak-my-rabotaem')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 xl:px-6">
        {/* Page header */}
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Процесс покупки
        </h1>
        <p className="text-muted font-montserrat text-lg max-w-2xl mb-14 md:mb-16">
          Понятный процесс покупки авто из США — от заявки до ключей. На каждом этапе вы
          понимаете, что происходит с вашим автомобилем и за что вы платите.
        </p>

        {/* Two-column layout */}
        <div className="flex gap-16 items-start">

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* ── Section 1: Как мы работаем ── */}
            <section
              id="kak-my-rabotaem"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-6">
                Как мы работаем
              </h2>
              <div className="font-montserrat text-base text-muted leading-relaxed space-y-4 max-w-2xl mb-8">
                <p>
                  Подбираем автомобили, за которые нам не будет стыдно. Не работаем по
                  принципу «лишь бы купить дешевле». Если видим, что авто не стоит брать —
                  мы прямо об этом говорим и не настаиваем на покупке.
                </p>
                <p>
                  Для нас важно не просто провести сделку, а чтобы вы остались довольны
                  результатом. Мы уверены, что движемся в правильном направлении, если вы
                  рекомендуете нас своим знакомым.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contacts"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Подобрать автомобиль под ваш бюджет
                </Link>
                <a
                  href="https://t.me/pmcars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl border border-gray-200 text-body font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Получить честную консультацию
                </a>
              </div>
            </section>

            {/* ── Section 2: Процесс покупки ── */}
            <section
              id="protsess"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Процесс покупки
              </h2>
              <p className="font-montserrat text-base text-muted mb-10 max-w-xl">
                Процесс выстроен так, чтобы вы на каждом этапе понимали, что происходит с
                вашим автомобилем и за что вы платите.
              </p>
              <div className="flex flex-col">
                {PURCHASE_STEPS.map((step, i) => (
                  <div key={step.title} className="flex gap-5 items-start">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-muller font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      {i < PURCHASE_STEPS.length - 1 && (
                        <div className="w-[2px] flex-1 min-h-[2rem] bg-primary/20 mt-1 mb-1" />
                      )}
                    </div>
                    <div className={i < PURCHASE_STEPS.length - 1 ? 'pb-6' : ''}>
                      <h3 className="font-muller font-bold text-lg text-body mb-1 pt-1">
                        {step.title}
                      </h3>
                      <p className="font-montserrat text-sm text-muted leading-relaxed">
                        {step.text}
                      </p>
                      {step.bullets && (
                        <ul className="mt-2 flex flex-col gap-1">
                          {step.bullets.map((b) => (
                            <li
                              key={b}
                              className="font-montserrat text-sm text-muted flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 3: Оплата и договор ── */}
            <section
              id="oplata"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Оплата и договор
              </h2>
              <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
                Перед началом сотрудничества мы заключаем договор. Вы понимаете, за что
                платите и какие у вас есть гарантии.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {PAYMENT_STAGES.map((stage) => (
                  <div
                    key={stage.num}
                    className="bg-light-bg rounded-2xl p-6 border border-gray-100"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-muller font-bold text-xs mb-3">
                      {stage.num}
                    </span>
                    <h3 className="font-muller font-bold text-lg text-body mb-2">
                      {stage.title}
                    </h3>
                    <p className="font-montserrat text-sm text-muted leading-relaxed">
                      {stage.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
                <div className="max-w-xl">
                  <h3 className="font-muller font-bold text-2xl text-white mb-3">
                    Не обещаем «самые дешёвые авто»
                  </h3>
                  <p className="font-montserrat text-white/50 text-base mb-8 leading-relaxed">
                    Работаем так, чтобы вы рекомендовали нас своим знакомым.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/contacts"
                      className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                      Оставить заявку
                    </Link>
                    <a
                      href="https://t.me/pmcars"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3.5 rounded-xl border border-white/20 text-white font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                    >
                      Написать в Telegram
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Sections 4–6 will be added here */}
          </div>

          {/* Right sidebar — desktop only */}
          <aside className="hidden xl:block w-[160px] flex-shrink-0 sticky top-24">
            <p className="text-xs uppercase tracking-widest text-muted/40 font-montserrat mb-3">
              На странице
            </p>
            <nav className="flex flex-col">
              {SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`py-[5px] pl-2 text-xs font-montserrat leading-snug transition-colors border-l-[1.5px] ${
                    activeSection === id
                      ? 'text-primary font-semibold border-primary'
                      : 'text-muted/50 border-transparent hover:text-muted'
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>

        </div>
      </div>
    </div>
  )
}
