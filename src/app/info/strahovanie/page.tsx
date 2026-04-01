// src/app/info/strahovanie/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Check, X } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Страхование груза при доставке авто из США | pmcars.by',
  description: 'Страхование автомобиля во время морской доставки из США в Беларусь. Что покрывает, сколько стоит, как оформить.',
}

const COVERS = [
  'Пожар или взрыв во время транспортировки',
  'Потопление или посадка судна на мель',
  'Повреждения при погрузке и разгрузке',
  'Кража автомобиля из контейнера',
  'Полная конструктивная гибель груза',
]

const NOT_COVERS = [
  'Естественный износ и коррозия',
  'Заводские дефекты автомобиля',
  'Задержки доставки',
  'Повреждения до загрузки в контейнер',
]

export default function StrakhovaniePage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <p className="text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
          Полезная информация
        </p>
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Страхование груза
        </h1>
        <p className="text-muted font-montserrat text-lg mb-10">
          Страховка автомобиля на время морской доставки из США
        </p>

        <div className="space-y-10 font-montserrat text-muted leading-relaxed">

          <section>
            <div className="flex items-start gap-3 mb-3">
              <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" strokeWidth={1.5} />
              <h2 className="font-muller font-bold text-2xl text-body">Что такое страхование груза</h2>
            </div>
            <p>
              Страхование груза — это страховой полис, который защищает ваш автомобиль на время
              морской перевозки из США в Европу. Автомобиль находится в контейнере на борту судна
              несколько недель, и за это время может произойти всё что угодно — от шторма до
              пожара на борту.
            </p>
            <p className="mt-3">
              Страховка покрывает стоимость автомобиля в случае наступления страхового случая —
              вы получаете компенсацию и не теряете вложенные деньги.
            </p>
          </section>

          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-4">Что покрывает</h2>
            <ul className="flex flex-col gap-2">
              {COVERS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-4">Что не покрывает</h2>
            <ul className="flex flex-col gap-2">
              {NOT_COVERS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-muted/50 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Стоимость</h2>
            <div className="bg-light-bg rounded-2xl p-6 border border-gray-100">
              <p className="text-2xl font-muller font-bold text-primary mb-2">≈ 0.5–1%</p>
              <p className="text-sm">от стоимости автомобиля</p>
              <p className="mt-3 text-sm">
                Точная стоимость рассчитывается индивидуально — зависит от цены авто и
                выбранного страхового покрытия. Уточните при оформлении заявки.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Нужно ли страховать?</h2>
            <p>
              Формально страхование не является обязательным. Но учитывая, что автомобиль
              проводит в пути 4–6 недель и стоит тысячи долларов — рекомендуем не экономить
              на этом. Стоимость страховки несопоставима с возможными потерями.
            </p>
          </section>

        </div>

        <div className="mt-10 bg-dark-bg rounded-2xl p-7">
          <h3 className="font-muller font-bold text-xl text-white mb-2">
            Хотите застраховать автомобиль?
          </h3>
          <p className="font-montserrat text-white/50 text-sm mb-5">
            Рассчитаем стоимость и оформим страховку вместе с доставкой.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://t.me/pmcars"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-montserrat font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Получить расчёт в Telegram
            </a>
            <Link
              href="/contacts"
              className="inline-flex items-center px-5 py-3 rounded-xl border border-white/20 text-white font-montserrat font-bold text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Написать нам
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
