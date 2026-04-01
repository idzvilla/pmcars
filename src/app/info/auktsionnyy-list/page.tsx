// src/app/info/auktsionnyy-list/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Как читать аукционный лист Copart и IAAI | pmcars.by',
  description: 'Разбор полей аукционного листа: тайтл, VIN, пробег, повреждения, оценка состояния. Что означает каждое поле и на что обратить внимание.',
}

const FIELDS = [
  {
    field: 'Title / Тайтл',
    what: 'Тип юридического документа на автомобиль',
    values: [
      { name: 'Clean Title', desc: 'Чистый документ — авто без страховых историй. Идеальный вариант.' },
      { name: 'Salvage Title', desc: 'Страховая компания признала авто «тотальным». Авто требует восстановления. После ремонта получит Rebuilt.' },
      { name: 'Rebuilt Title', desc: 'Авто восстановлено после Salvage. Прошло инспекцию. Стоимость ниже Clean.' },
      { name: 'Parts Only', desc: 'Авто продаётся только на запчасти. Нельзя зарегистрировать.' },
    ],
    attention: 'Salvage и Rebuilt тайтлы в РБ растаможиваются без ограничений. Parts Only — нельзя.',
  },
  {
    field: 'VIN',
    what: '17-значный идентификационный номер автомобиля',
    values: [],
    attention: 'По VIN проверяется история через CARFAX или AutoCheck: пробег, ДТП, количество владельцев, техобслуживание.',
  },
  {
    field: 'Odometer',
    what: 'Показания одометра на момент попадания на аукцион',
    values: [
      { name: 'Actual', desc: 'Пробег достоверен.' },
      { name: 'TMU (True Mileage Unknown)', desc: 'Пробег неизвестен или не подтверждён.' },
      { name: 'Exempt', desc: 'Авто старше 10 лет — фиксация пробега не требуется по закону США.' },
    ],
    attention: 'TMU и Exempt не означают скрученный пробег — это юридический статус. Но стоит дополнительно проверить историю по CARFAX.',
  },
  {
    field: 'Primary / Secondary Damage',
    what: 'Основные и вторичные повреждения автомобиля',
    values: [],
    attention: 'Primary Damage — главная причина попадания на аукцион. Secondary — дополнительные повреждения. Изучайте оба поля. Подробнее о типах повреждений — в отдельном разделе.',
  },
  {
    field: 'Est. Retail Value',
    what: 'Ориентировочная рыночная стоимость авто в исправном состоянии',
    values: [],
    attention: 'Используется как базис для расчёта выгодности покупки. Если итоговые затраты + ремонт приближаются к Est. Retail Value — сделка невыгодна.',
  },
  {
    field: 'Buy It Now',
    what: 'Фиксированная цена без торгов',
    values: [],
    attention: 'Позволяет купить авто без ожидания торгов. Обычно выше рыночной аукционной цены. Удобно если нужна конкретная машина срочно.',
  },
  {
    field: 'Highlights',
    what: 'Специальные метки состояния автомобиля',
    values: [
      { name: 'Runs and Drives', desc: 'Авто заводится и едет своим ходом.' },
      { name: 'Enhanced Vehicle', desc: 'Авто проверено и задокументировано — улучшенные фото, отчёт о состоянии.' },
      { name: 'Does Not Start', desc: 'Авто не заводится.' },
      { name: 'No Keys', desc: 'Ключи отсутствуют.' },
    ],
    attention: '"Runs and Drives" существенно повышает цену лота и упрощает доставку. "No Keys" добавляет расходы на изготовление ключа.',
  },
  {
    field: 'Keys',
    what: 'Наличие ключей от автомобиля',
    values: [
      { name: 'Yes', desc: 'Ключи есть.' },
      { name: 'No', desc: 'Ключи отсутствуют.' },
    ],
    attention: 'Отсутствие ключей влияет на стоимость доставки по США — часть площадок не принимает авто без ключей на стандартный транспортёр.',
  },
  {
    field: 'Sale Date',
    what: 'Дата проведения торгов',
    values: [],
    attention: 'Торги проходят в режиме реального времени онлайн. За 24–48 часов до торгов нужно согласовать максимальную ставку.',
  },
]

export default function AuktsionnyyListPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <p className="text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
          Полезная информация
        </p>
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Как читать аукционный лист
        </h1>
        <p className="text-muted font-montserrat text-lg mb-10 max-w-xl">
          Разбор всех полей карточки лота на Copart и IAAI — что означает каждое поле
          и на что обратить внимание при выборе автомобиля.
        </p>

        <div className="flex flex-col gap-5 mb-12">
          {FIELDS.map((f) => (
            <div key={f.field} className="bg-light-bg rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-3 mb-2">
                <span className="font-montserrat text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5">
                  {f.field}
                </span>
              </div>
              <p className="font-montserrat text-sm text-body font-semibold mb-3">{f.what}</p>
              {f.values.length > 0 && (
                <ul className="flex flex-col gap-2 mb-4">
                  {f.values.map((v) => (
                    <li key={v.name} className="font-montserrat text-sm text-muted">
                      <span className="font-semibold text-body">{v.name}</span>
                      {' — '}
                      {v.desc}
                    </li>
                  ))}
                </ul>
              )}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="font-montserrat text-xs font-semibold text-body mb-1">На что обратить внимание:</p>
                <p className="font-montserrat text-sm text-muted leading-relaxed">{f.attention}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-dark-bg rounded-2xl p-7">
          <h3 className="font-muller font-bold text-xl text-white mb-2">
            Нашли лот, хотите разобраться?
          </h3>
          <p className="font-montserrat text-white/50 text-sm mb-5">
            Пришлите ссылку на лот — разберём все поля и скажем стоит ли брать.
          </p>
          <a
            href="https://t.me/pmcars"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            Написать в Telegram
          </a>
        </div>
      </div>
    </div>
  )
}
