'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Accordion from '@/components/ui/Accordion'
import {
  FileText, Car, Truck, Landmark, ShieldCheck, MessageCircle, Star,
  MessageSquare, Search, Calculator, TrendingUp, CreditCard, Ship, FileCheck, Key, Check,
} from 'lucide-react'

const SECTIONS = [
  { id: 'protsess', label: 'Процесс покупки' },
  { id: 'kak-my-rabotaem', label: 'Как мы работаем' },
  { id: 'oplata', label: 'Оплата и договор' },
  { id: 'dostavka', label: 'Доставка и растаможка' },
  { id: 'poluchenie', label: 'Получение авто в РБ' },
  { id: 'info', label: 'Вопросы и ответы' },
]

const PAYMENT_STAGES = [
  {
    icon: FileText,
    title: 'Договор и предоплата',
    text: 'После согласования условий подписывается договор и вносится предоплата за услуги компании.',
  },
  {
    icon: Car,
    title: 'Оплата автомобиля',
    text: 'После выигрыша на аукционе вы оплачиваете стоимость лота, аукционные сборы и почтовые услуги. Оплата официальная с подтверждением всех операций.',
  },
  {
    icon: Truck,
    title: 'Доставка',
    text: 'Оплачивается логистика: доставка по США, морская доставка, доставка в Беларусь по прибытию в порт назначения.',
  },
  {
    icon: Landmark,
    title: 'Таможенные платежи',
    text: 'Оплата производится при оформлении авто в Республике Беларусь.',
  },
]

const PURCHASE_STEPS = [
  {
    icon: MessageSquare,
    title: 'Заявка и консультация',
    text: 'Вы оставляете заявку или связываетесь с нами удобным способом. Мы уточняем бюджет, обсуждаем какой автомобиль нужен, объясняем как проходит покупка и делаем предварительный расчёт. Уже на этом этапе вы понимаете: сколько примерно будет стоить авто «под ключ» и какие есть варианты.',
    bullets: null,
  },
  {
    icon: Search,
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
    icon: Calculator,
    title: 'Согласование и расчёт',
    text: 'Перед покупкой вы точно знаете: финальную стоимость авто при согласованной ставке, расходы на доставку, таможенные платежи и ориентировочную стоимость ремонта. Никаких «доплат по ходу».',
    bullets: null,
  },
  {
    icon: TrendingUp,
    title: 'Участие в торгах',
    text: 'Наша задача — купить автомобиль, который будет выгоден и оправдает вложения. Согласовываем максимальную ставку, участвуем в онлайн-торгах, не превышаем ваш бюджет. Вы можете присутствовать онлайн, в офисе или доверить процесс нам. Если авто не выиграли — подбираем другие варианты, вы ничего не теряете.',
    bullets: null,
  },
  {
    icon: CreditCard,
    title: 'Оплата и оформление',
    text: 'После покупки вы получаете скриншот из кабинета аукциона и официальный инвойс. В инвойсе указана итоговая сумма: стоимость автомобиля + аукционный сбор. Оплата производится через банк по SWIFT-переводу — мы объясняем как правильно заполнить платёж и подсказываем банки.',
    bullets: null,
  },
  {
    icon: Ship,
    title: 'Доставка из США',
    text: 'Организовываем логистику: доставка по США до порта, погрузка в контейнер, отправка в Европу, доставка в Беларусь. Вы можете отслеживать авто на каждом этапе — мы сообщаем статусы и сроки.',
    bullets: null,
  },
  {
    icon: FileCheck,
    title: 'Таможенное оформление',
    text: 'Помогаем пройти растаможку в Беларуси: подготовка документов, расчёт платежей, сопровождение процесса.',
    bullets: null,
  },
  {
    icon: Key,
    title: 'Получение автомобиля',
    text: 'Вы получаете авто в Беларуси (Гомель или другой город). Проверяете автомобиль, оформляете документы. На каждом этапе вы знали: где находится ваш автомобиль, сколько уже потрачено и что будет дальше.',
    bullets: null,
  },
]

const DELIVERY_STAGES = [
  {
    title: 'Доставка по США до порта',
    days: '3–10 дней',
    text: 'После покупки автомобиль отправляется с аукциона в порт. Срок зависит от расстояния до порта. На этом этапе уже формируется часть стоимости доставки.',
  },
  {
    title: 'Подготовка и погрузка',
    days: null,
    text: 'Автомобиль проходит оформление документов, готовится к отправке и загружается в контейнер. Вы получаете информацию о дате отправки.',
  },
  {
    title: 'Морская доставка',
    days: '4–6 недель',
    text: 'Автомобиль отправляется морем в Европу. Сроки зависят от загрузки портов, маршрута и сезона. После отправки вы можете отслеживать контейнер.',
  },
  {
    title: 'Доставка в Беларусь',
    days: null,
    text: 'После прибытия в транзитный порт авто выгружается, проходит транзит и доставляется в Беларусь. Мы сопровождаем процесс до момента прибытия.',
  },
  {
    title: 'Передача на таможню',
    days: null,
    text: 'Автомобиль передаётся для оформления в РБ. Подготавливаем документы, сопровождаем процесс, помогаем пройти таможню.',
  },
]

const INFO_ITEMS = [
  {
    question: 'С чего начинается покупка',
    answer: (
      <p>
        Первый шаг — понять что именно вы ищете: конкретная модель или лот, автомобиль под
        определённый бюджет, авто для себя или для перепродажи. Мы помогаем определить
        оптимальный вариант и объясняем на что реально можно рассчитывать. Оптимальный
        возраст авто — до 5 лет, минимальный бюджет «под ключ» — от $13 000.
      </p>
    ),
  },
  {
    question: 'Из чего складывается итоговая стоимость',
    answer: (
      <>
        <p className="mb-2">Цена автомобиля из США — это не только стоимость на аукционе. В итог входят:</p>
        <ul className="list-none flex flex-col gap-1">
          {[
            'стоимость лота',
            'комиссия аукциона',
            'доставка по США',
            'морская доставка',
            'доставка в Беларусь',
            'таможенные платежи',
            'утильсбор, оформление, хранение',
            'ремонт',
            'услуги компании',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-2">Мы сразу считаем полную стоимость, чтобы не было «доплат по ходу».</p>
      </>
    ),
  },
  {
    question: 'Как строится маршрут доставки',
    answer: (
      <>
        <p className="mb-3">Маршрут зависит от объёма двигателя автомобиля:</p>
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-body">До 1.5 литра</span>
            <p className="mt-0.5">Контейнер доставляется в порт Клайпеда (Литва), затем авто перегружается на автовоз и доставляется на СВХ в Гомель или Минск.</p>
          </div>
          <div>
            <span className="font-semibold text-body">Более 1.5 литра</span>
            <p className="mt-0.5">Автомобиль направляется через порт Поти (Грузия), далее перегружается на автовоз и доставляется в Гомель или Минск.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    question: 'Льготная растаможка — 140 указ',
    answer: (
      <>
        <p className="mb-2">
          В Беларуси есть возможность снизить таможенные платежи на 50%. Льготой может
          воспользоваться категория граждан РБ, имеющая инвалидность 1–2 группы, а также
          многодетные семьи.
        </p>
        <ul className="list-none flex flex-col gap-1 mb-2">
          {[
            'Требуется подтверждающий документ',
            'Воспользоваться можно 1 раз в год',
            'Ограничений на дальнейшую продажу нет',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted/70">
          Использование на постоянной основе в коммерческих целях может повлечь вопросы со
          стороны контролирующих органов.
        </p>
      </>
    ),
  },
  {
    question: 'Чем вы отличаетесь от других компаний?',
    answer: (
      <p>
        Работаем только с рынком США и не распыляемся на Корею, ОАЭ или Европу. Знаем
        Copart и IAAI изнутри — это даёт реальное преимущество при торгах и оценке лотов.
        Каждую сделку ведёт один менеджер от подбора до получения авто: вы не
        пересказываете свой запрос несколько раз. Договор с первого платежа,
        все расходы считаем до покупки.
      </p>
    ),
  },
  {
    question: 'Что если авто не понравится при получении?',
    answer: (
      <>
        <p className="mb-2">
          Неожиданностей при получении практически не бывает — вы видите фото и отчёты ещё
          до покупки и получаете обновления на каждом этапе доставки.
        </p>
        <p>
          Если при получении обнаружены повреждения, которых не было при покупке, — фиксируем
          их актом и разбираемся со страховщиком или перевозчиком. Вы не остаётесь с этим один
          на один.
        </p>
      </>
    ),
  },
  {
    question: 'Реальные риски при покупке без опыта',
    answer: (
      <>
        <p className="mb-2">Без опыта можно столкнуться с ситуациями:</p>
        <ul className="list-none flex flex-col gap-1 mb-3">
          {[
            'авто невозможно растаможить в РБ',
            'автомобиль нельзя вывезти из США',
            'серьёзные скрытые повреждения',
            'участие в сильных ДТП или наводнениях',
            'скрученный пробег',
            'завышенная цена',
            'ошибки в расчёте таможни',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          Мы проверяем историю авто (CARFAX), анализируем повреждения, оцениваем
          целесообразность покупки и отсекаем проблемные варианты.
        </p>
      </>
    ),
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
        {/* Two-column layout */}
        <div className="flex gap-16 items-start">

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Page header */}
            <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
              Процесс покупки
            </h1>
            <p className="text-muted font-montserrat text-lg max-w-2xl mb-14 md:mb-16">
              От заявки до ключей — 8 шагов. На каждом этапе вы понимаете, что происходит
              с вашим автомобилем и за что платите.
            </p>

            {/* ── Section 1: Процесс покупки ── */}
            <section
              id="protsess"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <div className="flex flex-col">
                {PURCHASE_STEPS.map((step, i) => (
                  <div key={step.title} className="flex gap-5">
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

            {/* ── Section 2: Как мы работаем ── */}
            <section
              id="kak-my-rabotaem"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-6">
                Как мы работаем
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-light-bg rounded-2xl p-6 border border-gray-100">
                  <ShieldCheck className="w-6 h-6 text-primary mb-3" strokeWidth={1.5} />
                  <h3 className="font-muller font-bold text-base text-body mb-2">Честный подбор</h3>
                  <p className="font-montserrat text-sm text-muted leading-relaxed">
                    Если авто не стоит брать — скажем прямо. Не настаиваем на покупке ради сделки.
                  </p>
                </div>
                <div className="bg-light-bg rounded-2xl p-6 border border-gray-100">
                  <MessageCircle className="w-6 h-6 text-primary mb-3" strokeWidth={1.5} />
                  <h3 className="font-muller font-bold text-base text-body mb-2">Без скрытых доплат</h3>
                  <p className="font-montserrat text-sm text-muted leading-relaxed">
                    Полную стоимость считаем до аукциона. Платите ровно то, что в смете —
                    без доплат по ходу.
                  </p>
                </div>
                <div className="bg-light-bg rounded-2xl p-6 border border-gray-100">
                  <Star className="w-6 h-6 text-primary mb-3" strokeWidth={1.5} />
                  <h3 className="font-muller font-bold text-base text-body mb-2">Работаем на репутацию</h3>
                  <p className="font-montserrat text-sm text-muted leading-relaxed">
                    Наш ориентир — когда клиент советует нас друзьям. Это важнее любой другой метрики.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <h3 className="font-muller font-bold text-lg text-body mb-1">
                    Не обещаем «самые дешёвые авто»
                  </h3>
                  <p className="font-montserrat text-sm text-muted">
                    Работаем так, чтобы вы рекомендовали нас своим знакомым.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 flex-shrink-0">
                  <Link
                    href="/contacts"
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Оставить заявку
                  </Link>
                  <a
                    href="https://t.me/pmcars"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-200 text-body font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    Написать в Telegram
                  </a>
                </div>
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
                    key={stage.title}
                    className="bg-light-bg rounded-2xl p-6 border border-gray-100"
                  >
                    <stage.icon className="w-6 h-6 text-primary mb-3" strokeWidth={1.5} />
                    <h3 className="font-muller font-bold text-lg text-body mb-2">
                      {stage.title}
                    </h3>
                    <p className="font-montserrat text-sm text-muted leading-relaxed">
                      {stage.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 4: Доставка и растаможка ── */}
            <section
              id="dostavka"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Доставка и растаможка
              </h2>
              <p className="font-montserrat text-base text-muted mb-3 max-w-xl">
                Организуем доставку авто из США в Гомель и по всей Беларуси: от аукциона до
                получения автомобиля без лишних сложностей.
              </p>
              <p className="font-montserrat text-sm text-primary font-semibold mb-8">
                В среднем доставка занимает от 6 до 10 недель
              </p>
              <div className="flex flex-col mb-10">
                {DELIVERY_STAGES.map((stage, i) => (
                  <div key={stage.title} className="flex gap-5">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-muller font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      {i < DELIVERY_STAGES.length - 1 && (
                        <div className="w-[2px] flex-1 min-h-[2rem] bg-primary/20 mt-1 mb-1" />
                      )}
                    </div>
                    <div className={i < DELIVERY_STAGES.length - 1 ? 'pb-6' : ''}>
                      <div className="flex flex-wrap items-center gap-3 mb-1 pt-1">
                        <h3 className="font-muller font-bold text-lg text-body">
                          {stage.title}
                        </h3>
                        {stage.days && (
                          <span className="text-xs font-montserrat text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                            {stage.days}
                          </span>
                        )}
                      </div>
                      <p className="font-montserrat text-sm text-muted leading-relaxed">
                        {stage.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-light-bg rounded-2xl p-6 border border-gray-100 mb-6">
                <h3 className="font-muller font-bold text-base text-body mb-2">
                  Вы всегда знаете где ваш автомобиль
                </h3>
                <p className="font-montserrat text-sm text-muted leading-relaxed">
                  Во время доставки вы можете отслеживать статус авто, получать обновления и
                  задавать вопросы. Выбираем надёжных перевозчиков, контролируем этапы,
                  информируем без задержек.
                </p>
              </div>
            </section>

            {/* ── Section 5: Получение авто в РБ ── */}
            <section
              id="poluchenie"
              className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16"
            >
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Получение авто в РБ
              </h2>
              <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
                Все автомобили доставляются на СВХ (склад временного хранения) в Гомеле или
                Минске. Именно здесь автомобиль выгружается, проходит таможенное оформление и
                передаётся вам.
              </p>
              <div className="flex flex-col gap-3 mb-8 max-w-xl">
                {[
                  { label: 'Выгрузка из контейнера', desc: 'авто осматривается на СВХ при выгрузке' },
                  { label: 'Таможенное оформление', desc: 'документы, расчёт и уплата пошлин' },
                  { label: 'Осмотр автомобиля', desc: 'вы проверяете авто до подписания акта' },
                  { label: 'Подписание акта приёма', desc: 'фиксируем состояние документально' },
                  { label: 'Постановка на учёт', desc: 'помогаем с регистрацией при необходимости' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
                    </div>
                    <p className="font-montserrat text-sm text-body leading-relaxed">
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-muted"> — {item.desc}</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-light-bg rounded-2xl p-6 border border-gray-100 mb-8 max-w-xl">
                <p className="font-montserrat text-sm text-muted leading-relaxed">
                  Вы не остаётесь один на этапе получения. Мы сопровождаем и подсказываем
                  до момента, пока ключи не окажутся в ваших руках.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/info/kalkulyator-rashod"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Рассчитать стоимость авто под ключ
                </Link>
                <a
                  href="https://t.me/pmcars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl border border-gray-200 text-body font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Получить консультацию
                </a>
              </div>
            </section>

            {/* ── Calculator CTA ── */}
            <div className="bg-dark-bg rounded-2xl p-8 md:p-10 mb-14 md:mb-16">
              <div className="max-w-xl">
                <h3 className="font-muller font-bold text-2xl text-white mb-3">
                  Сколько будет стоить доставка?
                </h3>
                <p className="font-montserrat text-white/50 text-base mb-8 leading-relaxed">
                  Считаем точную стоимость под конкретный автомобиль и штат.
                </p>
                <Link
                  href="/info/kalkulyator-rashod"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Открыть калькулятор
                </Link>
              </div>
            </div>

            {/* ── Section 6: Полезная информация ── */}
            <section id="info" className="pb-14 md:pb-16">
              <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">
                Вопросы и ответы
              </h2>
              <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
                Коротко и по делу — чтобы вы понимали как всё устроено и не сталкивались с
                неприятными сюрпризами.
              </p>
              <div className="mb-10">
                <Accordion items={INFO_ITEMS} />
              </div>
              <div className="bg-dark-bg rounded-2xl p-8 md:p-10">
                <div className="max-w-xl">
                  <h3 className="font-muller font-bold text-2xl text-white mb-3">
                    Остались вопросы?
                  </h3>
                  <p className="font-montserrat text-white/50 text-base mb-8 leading-relaxed">
                    Расскажем подробнее, поможем рассчитать стоимость под ваш бюджет и
                    подберём подходящий вариант.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/contacts"
                      className="inline-flex items-center px-6 py-3.5 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                      Получить консультацию
                    </Link>
                    <Link
                      href="/info/kalkulyator-rashod"
                      className="inline-flex items-center px-6 py-3.5 rounded-xl border border-white/20 text-white font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                    >
                      Рассчитать стоимость
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right sidebar — desktop only */}
          <aside className="hidden xl:block w-[160px] flex-shrink-0 sticky top-32">
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
