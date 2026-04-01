// src/app/info/tipy-povrezhdeniy/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Типы повреждений авто на аукционах США | pmcars.by',
  description: 'Классификация повреждений на аукционах Copart и IAAI: Front End, Rear, Side, Flood, Fire, Hail, Theft. Что проверять и какие риски.',
}

type Severity = 'low' | 'medium' | 'high'

const DAMAGE_TYPES: {
  type: string
  label: string
  description: string
  checkWhat: string[]
  risks: string
  severity: Severity
}[] = [
  {
    type: 'Front End',
    label: 'Передний удар',
    description:
      'Лобовое столкновение — один из самых распространённых типов. Повреждает передний бампер, капот, фары, радиатор, а в серьёзных случаях — лонжероны кузова.',
    checkWhat: [
      'Геометрия кузова (лонжероны, передние стойки)',
      'Радиатор и система охлаждения',
      'Подушки безопасности',
      'Моторный отсек на скрытые повреждения',
    ],
    risks: 'Нарушение геометрии кузова делает ремонт дорогостоящим или невозможным.',
    severity: 'medium',
  },
  {
    type: 'Rear End',
    label: 'Удар сзади',
    description:
      'Удар в заднюю часть авто. Как правило затрагивает багажник, задние фонари, заднюю подвеску. Реже — топливный бак и кузовные стойки.',
    checkWhat: [
      'Задние лонжероны и усилители',
      'Подвеска и балка',
      'Топливный бак',
      'Крышка багажника и фонари',
    ],
    risks: 'При сильном ударе может пострадать кузовная геометрия. Ремонт обычно дешевле, чем Front End.',
    severity: 'low',
  },
  {
    type: 'Side',
    label: 'Боковой удар',
    description:
      'Удар в боковую часть автомобиля. Может затронуть одну или несколько дверей, пороги, стойки кузова (A, B, C). Самый опасный вид удара с точки зрения жёсткости кузова.',
    checkWhat: [
      'Стойки A, B, C на деформацию',
      'Пороги и усилители дверей',
      'Подушки безопасности бокового удара',
      'Жёсткость кузова при осмотре',
    ],
    risks: 'Удар в стойку B — наиболее серьёзный: восстановление геометрии может быть невозможным.',
    severity: 'high',
  },
  {
    type: 'Flood',
    label: 'Залив водой',
    description:
      'Автомобиль побывал в воде — частично или полностью. Особенно распространено после ураганов. Вода проникает в электронику, двигатель, салон, и наносит скрытые повреждения, которые проявляются спустя месяцы.',
    checkWhat: [
      'Электроника и блоки управления',
      'Двигатель (гидроудар)',
      'Салон и обивка (запах, коррозия)',
      'Задние фонари — скопление воды',
      'Следы ила или водорослей',
    ],
    risks: 'Скрытая коррозия и отказ электроники могут проявиться через несколько месяцев. Авто после сильного залива — высокий риск.',
    severity: 'high',
  },
  {
    type: 'Fire',
    label: 'Пожар',
    description:
      'Возгорание в моторном отсеке или салоне. Огонь уничтожает проводку, обивку, пластик и может повредить кузов. Восстановление зависит от очага и площади поражения.',
    checkWhat: [
      'Проводка по всему автомобилю',
      'Моторный отсек — следы копоти и плавления',
      'Кузов на термическую деформацию',
      'Стёкла — оплавления или трещины от жара',
    ],
    risks: 'Повреждения проводки могут быть обширными и скрытыми. Ремонт часто нерентабелен.',
    severity: 'high',
  },
  {
    type: 'Hail',
    label: 'Градобой',
    description:
      'Поверхностные вмятины от града по всему кузову. Стёкла могут быть разбиты. Механика и электрика, как правило, не затронуты — только кузов.',
    checkWhat: [
      'Крыша, капот, крылья, крышка багажника',
      'Стёкла на трещины',
      'Фары',
    ],
    risks: 'Исключительно косметические повреждения. Один из наиболее предсказуемых типов — ремонт хорошо прогнозируется.',
    severity: 'low',
  },
  {
    type: 'Theft',
    label: 'Угон / возврат',
    description:
      'Автомобиль был угнан и возвращён. Злоумышленники могут снять запчасти, повредить замки, вскрыть бортовую электронику или оставить авто в нерабочем состоянии.',
    checkWhat: [
      'Наличие всех ключей и брелоков',
      'Иммобилайзер и замок зажигания',
      'Комплектность (сиденья, рулевое колесо, магнитола)',
      'Электрические замки и стёкла',
    ],
    risks: 'Неполная комплектность увеличивает стоимость восстановления. Проблемы с иммобилайзером могут быть дорогими.',
    severity: 'medium',
  },
]

const severityLabel: Record<Severity, { text: string; className: string }> = {
  low: { text: 'Низкий риск', className: 'bg-green-50 text-green-700' },
  medium: { text: 'Средний риск', className: 'bg-yellow-50 text-yellow-700' },
  high: { text: 'Высокий риск', className: 'bg-red-50 text-red-700' },
}

export default function TipyPovrezhdeniyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <p className="text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
          Полезная информация
        </p>
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Типы повреждений
        </h1>
        <p className="text-muted font-montserrat text-lg mb-10 max-w-xl">
          Классификация повреждений на аукционах Copart и IAAI — что означает каждый тип,
          что проверять при выборе лота и каких рисков ожидать.
        </p>

        <div className="flex flex-col gap-6 mb-12">
          {DAMAGE_TYPES.map((d) => {
            const sev = severityLabel[d.severity]
            return (
              <div
                key={d.type}
                className="bg-light-bg rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="font-montserrat text-xs text-muted font-semibold uppercase tracking-wider">
                      {d.type}
                    </span>
                    <h2 className="font-muller font-bold text-xl text-body">{d.label}</h2>
                  </div>
                  <span className={`text-xs font-montserrat font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${sev.className}`}>
                    {sev.text}
                  </span>
                </div>
                <p className="font-montserrat text-sm text-muted leading-relaxed mb-4">
                  {d.description}
                </p>
                <div className="mb-4">
                  <p className="font-montserrat text-xs font-semibold text-body uppercase tracking-wide mb-2">
                    Что проверять:
                  </p>
                  <ul className="flex flex-col gap-1">
                    {d.checkWhat.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-montserrat text-sm text-muted">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="font-montserrat text-xs font-semibold text-body mb-1">Риски:</p>
                  <p className="font-montserrat text-sm text-muted">{d.risks}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-dark-bg rounded-2xl p-7">
          <h3 className="font-muller font-bold text-xl text-white mb-2">
            Не знаете как оценить лот?
          </h3>
          <p className="font-montserrat text-white/50 text-sm mb-5">
            Проанализируем повреждения, оценим стоимость ремонта и скажем стоит ли брать.
          </p>
          <a
            href="https://t.me/pmcars"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            Получить консультацию
          </a>
        </div>
      </div>
    </div>
  )
}
