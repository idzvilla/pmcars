'use client'
import { useEffect, useState } from 'react'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'
import { FileText, Car, Truck, Landmark } from 'lucide-react'
import { TariffGrid } from '@/components/sections/TariffsSection'

const SECTIONS = [
  { id: 'protsess', label: 'Процесс покупки' },
  { id: 'oplata', label: 'Оплата и договор' },
  { id: 'dostavka', label: 'Доставка и растаможка' },
  { id: 'poluchenie', label: 'Получение авто в РБ' },
  { id: 'tarify', label: 'Стоимость услуг' },
  { id: 'info', label: 'Полезная информация' },
]

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {items.map((item) => (
        <li key={item} className="font-montserrat text-sm text-muted flex items-start gap-2">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function SubHead({ children }: { children: string }) {
  return <p className="font-muller font-semibold text-sm text-body mt-4 mb-1">{children}</p>
}

const PURCHASE_STEPS = [
  {
    title: 'Заявка и консультация',
    duration: '1 день',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">
          Вы оставляете заявку или связываетесь с нами удобным способом.
        </p>
        <p className="font-montserrat text-sm text-muted mt-2">Мы:</p>
        <Bullets items={['уточняем бюджет', 'обсуждаем, какой автомобиль вам нужен', 'объясняем, как проходит покупка', 'делаем предварительный расчёт']} />
        <p className="font-montserrat text-sm text-muted mt-3 leading-relaxed">
          Вы уже на этом этапе понимаете: сколько примерно будет стоить авто «под ключ» и какие есть варианты.
        </p>
      </>
    ),
  },
  {
    title: 'Подбор автомобиля',
    duration: '2–5 дней',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">
          Подбираем для вас реальные лоты с аукционов США (Copart, IAAI, Manheim).
        </p>
        <p className="font-montserrat text-sm text-muted mt-2">Что вы получаете:</p>
        <Bullets items={['подбор под ваш бюджет', 'фото и описание авто', 'отчёт CARFAX / история', 'анализ повреждений', 'прогноз стоимости ремонта']} />
        <p className="font-montserrat text-sm text-muted mt-3 leading-relaxed">
          В результате вы понимаете: какой авто стоит брать, а какой — нет, и почему.
        </p>
      </>
    ),
  },
  {
    title: 'Согласование и расчёт',
    duration: '1 день',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">Перед покупкой вы точно знаете:</p>
        <Bullets items={['финальную стоимость авто при согласованной ставке аукциона', 'расходы на доставку', 'таможенные платежи', 'ориентировочную стоимость ремонта']} />
      </>
    ),
  },
  {
    title: 'Участие в торгах',
    duration: '1–2 недели',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">
          Наша задача — купить автомобиль, который будет выгоден и оправдает ваши вложения.
        </p>
        <Bullets items={['согласовываем максимальную ставку', 'участвуем в онлайн-торгах', 'не превышаем ваш бюджет']} />
        <p className="font-montserrat text-sm text-muted mt-3 leading-relaxed">
          Вы можете присутствовать онлайн, в офисе или доверить процесс нам.
        </p>
        <div className="mt-4 pl-4 border-l-2 border-primary/30">
          <p className="font-muller font-semibold text-sm text-body mb-1">Если авто не выиграли</p>
          <p className="font-montserrat text-sm text-muted leading-relaxed">
            Подбираем другие варианты, корректируем стратегию. Вы ничего не теряете — работа продолжается.
          </p>
        </div>
      </>
    ),
  },
  {
    title: 'Оплата и оформление',
    duration: '2–3 дня',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">После покупки вы получаете:</p>
        <Bullets items={['скриншот из кабинета аукциона', 'официальный инвойс (счёт)']} />
        <p className="font-montserrat text-sm text-muted mt-3 leading-relaxed">
          В инвойсе указана итоговая сумма: стоимость автомобиля + аукционный сбор. Именно эту сумму вы оплачиваете напрямую на аукцион.
        </p>
        <SubHead>Как проходит оплата</SubHead>
        <p className="font-montserrat text-sm text-muted leading-relaxed">Оплата осуществляется через банк по SWIFT-переводу. Мы:</p>
        <Bullets items={['объясняем, как правильно заполнить платёж', 'подсказываем банки, которые работают с переводами', 'сопровождаем процесс']} />
        <SubHead>Важно проверить</SubHead>
        <p className="font-montserrat text-sm text-muted leading-relaxed">После оформления платежа убедитесь, что в назначении указаны:</p>
        <Bullets items={['номер аккаунта (Buyer / Member)', 'номер лота (Lot / Stock)']} />
        <SubHead>Аукционные сборы</SubHead>
        <p className="font-montserrat text-sm text-muted leading-relaxed">
          Аукционный сбор включён в инвойс и зависит от стоимости авто, типа сделки и условий аукциона. При покупке через компанию сборы, как правило, ниже — аукционам выгоднее работать с брокерами.
        </p>
        <p className="font-montserrat text-xs text-muted/70 mt-3 leading-relaxed">
          Можно изменить получателя автомобиля, пока он находится в пути — до прибытия в порт назначения.
        </p>
      </>
    ),
  },
  {
    title: 'Доставка из США',
    duration: '6–10 недель',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">Организовываем логистику автомобиля:</p>
        <Bullets items={['доставка по США до порта', 'погрузка в контейнер', 'отправка в Европу', 'доставка в Беларусь']} />
        <p className="font-montserrat text-sm text-muted mt-3 leading-relaxed">
          Вы можете отслеживать авто на каждом этапе. Мы сообщаем статусы и сроки.
        </p>
      </>
    ),
  },
  {
    title: 'Таможенное оформление',
    duration: '1–2 недели',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">Помогаем пройти растаможку в Беларуси:</p>
        <Bullets items={['подготовка документов', 'расчёт платежей', 'сопровождение процесса']} />
      </>
    ),
  },
  {
    title: 'Получение автомобиля',
    duration: '1 день',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">
          Вы получаете авто в Беларуси (Гомель или другой город).
        </p>
        <p className="font-montserrat text-sm text-muted mt-2">Что дальше:</p>
        <Bullets items={['проверяете автомобиль', 'оформляете документы', 'при необходимости — помогаем с ремонтом']} />
        <p className="font-montserrat text-sm text-muted mt-3 leading-relaxed">
          На каждом этапе вы понимали: где находится ваш автомобиль, сколько уже потрачено и что будет дальше.
        </p>
      </>
    ),
  },
]

const PAYMENT_STAGES = [
  {
    label: 'Договор и предоплата',
    sub: 'После согласования условий подписывается договор и вносится предоплата за услуги компании.',
    icon: FileText,
  },
  {
    label: 'Оплата автомобиля',
    sub: 'После выигрыша на аукционе вы оплачиваете стоимость лота, аукционные сборы и почтовые услуги. Оплата официальная, с подтверждением всех операций.',
    icon: Car,
  },
  {
    label: 'Доставка',
    sub: 'Оплачивается логистика: доставка по США, морская доставка, доставка в Беларусь по прибытию в порт назначения.',
    icon: Truck,
  },
  {
    label: 'Таможенные платежи',
    sub: 'Оплата производится при оформлении авто в Республике Беларусь.',
    icon: Landmark,
  },
]

const DELIVERY_STEPS = [
  {
    title: 'Доставка по США до порта',
    duration: '3–10 дней',
    content: (
      <p className="font-montserrat text-sm text-muted leading-relaxed">
        После покупки автомобиль отправляется с аукциона в порт. Учитывается расстояние до порта — на этом этапе уже формируется часть стоимости доставки.
      </p>
    ),
  },
  {
    title: 'Подготовка и погрузка',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">Автомобиль:</p>
        <Bullets items={['проходит оформление документов', 'готовится к отправке', 'загружается в контейнер']} />
        <p className="font-montserrat text-sm text-muted mt-3 leading-relaxed">
          Вы получаете информацию о дате отправки и фото загрузки.
        </p>
      </>
    ),
  },
  {
    title: 'Морская доставка',
    duration: '4–6 недель',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">
          Автомобиль отправляется морем в Европу. После отправки вы можете отслеживать контейнер.
        </p>
        <p className="font-montserrat text-sm text-muted mt-2">Что влияет на сроки:</p>
        <Bullets items={['загруженность портов', 'маршрут', 'сезон']} />
      </>
    ),
  },
  {
    title: 'Доставка в Беларусь',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">После прибытия в транзитный порт:</p>
        <Bullets items={['авто выгружается', 'проходит транзит', 'доставляется в Беларусь']} />
        <p className="font-montserrat text-sm text-muted mt-3 leading-relaxed">
          Мы сопровождаем процесс до момента прибытия.
        </p>
      </>
    ),
  },
  {
    title: 'Передача на таможню',
    content: (
      <>
        <p className="font-montserrat text-sm text-muted leading-relaxed">Автомобиль передаётся для оформления в РБ. На этом этапе:</p>
        <Bullets items={['подготавливаем документы', 'сопровождаем процесс', 'помогаем пройти таможню']} />
      </>
    ),
  },
]

const INFO_ITEMS = [
  {
    question: 'С чего начинается покупка',
    answer: (
      <>
        <p className="mb-2">Первый шаг — понять, что именно вы ищете:</p>
        <ul className="list-none flex flex-col gap-1 mb-3">
          {['конкретная модель или даже номер лота', 'автомобиль под определённый бюджет', 'авто для себя или для перепродажи'].map((item) => (
            <li key={item} className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />{item}</li>
          ))}
        </ul>
        <p className="mb-2">Что важно учитывать:</p>
        <ul className="list-none flex flex-col gap-1">
          {['оптимальный возраст авто — до 5 лет', 'минимальный бюджет «под ключ» — от $13 000', 'чем ниже бюджет — тем выше риски'].map((item) => (
            <li key={item} className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />{item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    question: 'Из чего складывается итоговая стоимость',
    answer: (
      <>
        <p className="mb-2">Цена автомобиля из США — это не только стоимость на аукционе. В итог входят:</p>
        <ul className="list-none flex flex-col gap-1 mb-3">
          {['стоимость лота', 'комиссия аукциона', 'доставка по США', 'морская доставка', 'доставка в Беларусь', 'таможенные платежи', 'утильсбор, оформление, хранение', 'ремонт', 'услуги компании'].map((item) => (
            <li key={item} className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />{item}</li>
          ))}
        </ul>
        <p>Мы сразу считаем полную стоимость, чтобы не было «доплат по ходу».</p>
      </>
    ),
  },
  {
    question: 'Как строится маршрут доставки',
    answer: (
      <>
        <p className="mb-3">Маршрут зависит от объёма двигателя автомобиля:</p>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-body mb-1">До 1.5 литра</p>
            <p className="mb-1">Контейнер доставляется в порт Клайпеда (Литва), после чего:</p>
            <ul className="list-none flex flex-col gap-1">
              {['авто выгружается', 'загружается на автовоз', 'доставляется на СВХ в Гомель/Минск'].map((item) => (
                <li key={item} className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-body mb-1">Более 1.5 литра</p>
            <p className="mb-1">Автомобиль направляется через порт Поти (Грузия), далее:</p>
            <ul className="list-none flex flex-col gap-1">
              {['контейнер разгружается', 'авто перегружается на автовоз', 'доставляется в Гомель/Минск'].map((item) => (
                <li key={item} className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />{item}</li>
              ))}
            </ul>
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
          В Беларуси есть возможность снизить таможенные платежи на 50%. Льготой может воспользоваться категория граждан РБ, имеющая инвалидность 1–2 группы, а также многодетные семьи.
        </p>
        <ul className="list-none flex flex-col gap-1 mb-2">
          {['требуется подтверждающий документ', 'воспользоваться можно 1 раз в год', 'ограничений на дальнейшую продажу нет'].map((item) => (
            <li key={item} className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />{item}</li>
          ))}
        </ul>
        <p className="text-xs text-muted/70">
          Использование на постоянной основе в коммерческих целях может повлечь вопросы со стороны контролирующих органов.
        </p>
      </>
    ),
  },
  {
    question: 'Проверка автомобиля — почему это важно',
    answer: (
      <>
        <p className="mb-2">Без опыта можно столкнуться с ситуациями:</p>
        <ul className="list-none flex flex-col gap-1 mb-3">
          {['авто невозможно растаможить в РБ', 'автомобиль нельзя вывезти из США', 'серьёзные скрытые повреждения', 'участие в сильных ДТП или наводнениях', 'скрученный пробег', 'неправильная комплектация', 'завышенная цена', 'проблемы с кузовом и геометрией', 'ошибки в расчёте таможни'].map((item) => (
            <li key={item} className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />{item}</li>
          ))}
        </ul>
        <p className="mb-2">Как мы снижаем риски:</p>
        <ul className="list-none flex flex-col gap-1">
          {['проверяем историю авто (CARFAX и др.)', 'анализируем повреждения', 'оцениваем целесообразность покупки', 'отсекаем проблемные варианты', 'объясняем, что стоит брать, а что — нет'].map((item) => (
            <li key={item} className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />{item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    question: 'Как оплатить — SWIFT-перевод',
    answer: (
      <>
        <p className="mb-3">
          Оплата производится через банк по SWIFT-переводу. В назначении платежа укажите
          номер аккаунта (Buyer&nbsp;/&nbsp;Member) и номер лота (Lot&nbsp;/&nbsp;Stock) —
          по этим данным аукцион понимает, кто оплатил и за какой автомобиль.
        </p>
        <ul className="list-none flex flex-col gap-1">
          {['Аукционные сборы через нашего брокера, как правило, ниже рыночных', 'Мы объясняем как правильно заполнить платёж и подсказываем банки', 'Пока авто в пути, можно сменить получателя — уточняйте заранее'].map((item) => (
            <li key={item} className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />{item}</li>
          ))}
        </ul>
      </>
    ),
  },
]

function Timeline({ steps }: { steps: { title: string; duration?: string; content: React.ReactNode }[] }) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div key={step.title} className="flex gap-5">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-muller font-bold text-sm flex-shrink-0">
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-[2px] flex-1 min-h-[2rem] bg-primary/20 mt-1 mb-1" />
            )}
          </div>
          <div className={i < steps.length - 1 ? 'pb-6' : ''}>
            <div className="flex flex-wrap items-center gap-3 mb-1 pt-1">
              <h3 className="font-muller font-bold text-lg text-body leading-tight">{step.title}</h3>
              {'duration' in step && step.duration && (
                <span className="text-[11px] font-montserrat text-primary bg-primary/8 px-2.5 py-0.5 rounded-full border border-primary/15 flex-shrink-0">
                  {step.duration as string}
                </span>
              )}
            </div>
            {step.content}
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-muller font-bold text-3xl md:text-4xl text-body tracking-tight mb-3">{title}</h2>
      {sub && <p className="font-montserrat text-base text-muted max-w-xl">{sub}</p>}
    </div>
  )
}

function CtaBlock({ dark, children }: { dark?: boolean; children: React.ReactNode }) {
  if (dark) {
    return (
      <div className="bg-dark-bg rounded-2xl p-8 md:p-10 mt-8">
        <div className="max-w-xl">{children}</div>
      </div>
    )
  }
  return <div className="mt-8 flex flex-wrap gap-3">{children}</div>
}

export default function ProtsessPageClient() {
  const [activeSection, setActiveSection] = useState('protsess')

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.2 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <div className="py-10 md:py-14">
      <div className="max-w-[1200px] mx-auto px-4 xl:px-6">
        <div className="flex gap-16 items-start">

          {/* Main content */}
          <div className="flex-1 min-w-0">

            <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
              Процесс покупки
            </h1>
            <p className="text-muted font-montserrat text-lg max-w-2xl mb-10">
              Процесс выстроен так, чтобы вы на каждом этапе понимали, что происходит с вашим автомобилем и за что вы платите.
            </p>

            {/* ── 1. Процесс покупки ── */}
            <section id="protsess" className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16 scroll-mt-28">
              <Timeline steps={PURCHASE_STEPS} />
            </section>

            {/* ── 3. Оплата и договор ── */}
            <section id="oplata" className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16 scroll-mt-28">
              <SectionHeader
                title="Оплата и договор"
                sub="Перед началом сотрудничества мы заключаем договор. Вы понимаете, за что платите и какие у вас есть гарантии."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PAYMENT_STAGES.map((stage) => (
                  <div key={stage.label} className="bg-light-bg border border-gray-100 rounded-2xl p-6">
                    <stage.icon size={24} strokeWidth={1.5} className="text-primary mb-4" />
                    <p className="font-muller font-bold text-base text-body mb-2">{stage.label}</p>
                    <p className="font-montserrat text-sm text-muted leading-relaxed">{stage.sub}</p>
                  </div>
                ))}
              </div>
              <CtaBlock dark>
                <p className="font-muller font-bold text-xl text-white mb-3">
                  Не обещаем «самые дешёвые авто»
                </p>
                <p className="font-montserrat text-white/60 text-base mb-8 leading-relaxed">
                  А работаем так, чтобы вы рекомендовали нас своим знакомым.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button href="/contacts">Получить консультацию</Button>
                  <Button href="https://t.me/plusminus_cars" variant="ghost" external>Рассчитать стоимость</Button>
                </div>
              </CtaBlock>
            </section>

            {/* ── 4. Доставка и растаможка ── */}
            <section id="dostavka" className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16 scroll-mt-28">
              <SectionHeader
                title="Доставка и растаможка"
                sub="Организуем доставку авто из США в Гомель и по всей Беларуси: от аукциона до получения автомобиля без лишних сложностей."
              />
              <p className="font-montserrat text-sm font-semibold text-primary mb-8">
                В среднем доставка занимает от 6 до 10 недель
              </p>
              <Timeline steps={DELIVERY_STEPS} />
            </section>

            {/* ── 5. Получение авто в РБ ── */}
            <section id="poluchenie" className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16 scroll-mt-28">
              <SectionHeader
                title="Получение авто в РБ"
                sub="Все автомобили доставляются на СВХ (склад временного хранения) в Гомеле или Минске. Именно здесь автомобиль выгружается, проходит таможенное оформление и передаётся вам."
              />
              <ul className="flex flex-col gap-4 mb-8">
                {[
                  { label: 'Выгрузка из контейнера', desc: 'авто осматривается на СВХ при выгрузке' },
                  { label: 'Таможенное оформление', desc: 'документы, расчёт и уплата пошлин' },
                  { label: 'Осмотр автомобиля', desc: 'вы проверяете авто до подписания акта' },
                  { label: 'Подписание акта приёма', desc: 'фиксируем состояние документально' },
                  { label: 'Постановка на учёт', desc: 'помогаем с регистрацией при необходимости' },
                ].map(({ label, desc }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#00ACB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span className="font-montserrat text-sm text-muted leading-relaxed">
                      <span className="font-semibold text-body">{label}</span> — {desc}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="bg-light-bg border border-gray-100 rounded-2xl px-6 py-5 mb-8">
                <p className="font-montserrat text-base text-muted leading-relaxed">
                  Вы не остаётесь один на этапе получения. Мы сопровождаем и подсказываем до момента, пока ключи не окажутся в ваших руках.
                </p>
              </div>
              <CtaBlock>
                <Button href="/contacts">Рассчитать стоимость авто под ключ</Button>
                <Button href="https://t.me/plusminus_cars" variant="ghost" external>Получить консультацию</Button>
              </CtaBlock>
            </section>

            {/* ── 6. Стоимость услуг ── */}
            <section id="tarify" className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16 scroll-mt-28">
              <SectionHeader
                title="Стоимость услуг"
                sub="Фиксированная цена за нашу работу. Всё остальное — по фактическим затратам без накруток."
              />
              <TariffGrid />
            </section>

            {/* ── 7. Полезная информация ── */}
            <section id="info" className="pb-14 md:pb-16 scroll-mt-28">
              <SectionHeader
                title="Полезная информация"
                sub="Коротко и по делу — чтобы вы понимали, как всё устроено и не сталкивались с неприятными сюрпризами."
              />
              <div className="mb-10">
                <Accordion items={INFO_ITEMS} />
              </div>
              <CtaBlock dark>
                <p className="font-muller font-bold text-2xl text-white mb-3">Остались вопросы?</p>
                <p className="font-montserrat text-white/60 text-base mb-8 leading-relaxed">
                  Расскажем подробнее, поможем рассчитать стоимость под ваш бюджет и подберём подходящий вариант.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button href="/contacts">Получить консультацию</Button>
                  <Button href="https://t.me/plusminus_cars" variant="ghost" external>Рассчитать стоимость</Button>
                </div>
              </CtaBlock>
            </section>

          </div>

          {/* Right sidebar — desktop only */}
          <aside className="hidden xl:block w-[200px] flex-shrink-0 sticky top-32">
            <nav className="flex flex-col">
              {SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`py-[5px] pl-2 text-xs font-montserrat leading-snug transition-colors border-l-[1.5px] ${
                    activeSection === id
                      ? 'text-primary font-semibold border-primary'
                      : 'text-muted/50 font-medium border-transparent hover:text-muted'
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
