// src/app/dostavka/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import { Check, X } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Доставка авто из США в Беларусь',
  description: 'Полная информация о доставке авто из США: аукционы Copart и IAAI, маршрут, сроки, стоимость, типы документов.',
}

const stages = [
  { title: 'Покупка на аукционе', days: '3–7 дней', text: 'Выигрываем лот, оплачиваем аукционный сбор и забираем авто с площадки.' },
  { title: 'Доставка до порта (США)', days: '7–14 дней', text: 'Транспортировка авто до портового склада. Чаще всего — Хьюстон, Балтимор, Нью-Джерси.' },
  { title: 'Морская перевозка', days: '30–45 дней', text: 'Погрузка в контейнер и отправка судном. Порты назначения: Бремерхафен (Германия) или Клайпеда (Литва).' },
  { title: 'Доставка в Беларусь', days: '5–10 дней', text: 'Автовоз или собственный ход из порта до Минска.' },
  { title: 'Таможенное оформление', days: '3–7 дней', text: 'Декларирование, уплата пошлин, получение ЭПТС.' },
]

const docTypes = [
  {
    title: 'Clean Title',
    status: 'good',
    text: 'Чистый титул — авто не имеет страховых случаев. Самый предпочтительный вариант для регистрации в РБ.',
  },
  {
    title: 'Rebuilt Title',
    status: 'ok',
    text: 'Восстановленный титул — авто было повреждено и официально восстановлено. Допускается к регистрации в РБ.',
  },
  {
    title: 'Salvage Title',
    status: 'warn',
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
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Доставка из США
        </h1>
        <p className="text-muted font-montserrat text-lg mb-16 max-w-2xl">
          Работаем с аукционами Copart и IAAI. Организуем полную логистику от аукционной площадки до вашего гаража.
        </p>

        <h2 className="font-muller font-bold text-2xl text-body mb-6">Маршрут и сроки</h2>
        <div className="flex flex-col gap-4 mb-16">
          {stages.map((s, i) => (
            <div key={s.title} className="flex gap-5 items-start">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-muller font-bold text-sm">
                  {i + 1}
                </div>
                {i < stages.length - 1 && <div className="w-[2px] h-8 bg-primary/20 mt-1" />}
              </div>
              <div className="pb-4">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="font-muller font-bold text-lg text-body">{s.title}</h3>
                  <span className="text-xs font-montserrat text-primary bg-primary/10 px-2 py-0.5 rounded">{s.days}</span>
                </div>
                <p className="font-montserrat text-sm text-muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-muller font-bold text-2xl text-body mb-6">Типы документов (Title)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {docTypes.map((d) => (
            <div key={d.title} className={`rounded-xl p-6 border-2 ${
              d.status === 'good' ? 'border-green-200 bg-green-50'
              : d.status === 'ok' ? 'border-primary/30 bg-primary/5'
              : 'border-yellow-200 bg-yellow-50'
            }`}>
              <h3 className="font-muller font-bold text-lg text-body mb-2">{d.title}</h3>
              <p className="font-montserrat text-sm text-muted">{d.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-light-bg rounded-xl p-6">
            <h2 className="font-muller font-bold text-xl text-body mb-4">Входит в стоимость</h2>
            <ul className="flex flex-col gap-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2 font-montserrat text-sm text-muted">
                  <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-light-bg rounded-xl p-6">
            <h2 className="font-muller font-bold text-xl text-body mb-4">Оплачивается отдельно</h2>
            <ul className="flex flex-col gap-2">
              {notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2 font-montserrat text-sm text-muted">
                  <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center flex flex-wrap justify-center gap-4">
          <Button href="/info/kalkulyator" size="lg">Рассчитать стоимость</Button>
          <Button href="/contacts" variant="outline" size="lg">Задать вопрос</Button>
        </div>
      </div>
    </div>
  )
}
