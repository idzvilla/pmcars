// src/app/info/dkp/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import { Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ДКП — Договор купли-продажи',
  description: 'Что такое ДКП при покупке авто из США, что должно быть в договоре купли-продажи.',
}

export default function DkpPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">ДКП</h1>
        <p className="text-muted font-montserrat text-lg mb-6">Договор купли-продажи автомобиля</p>
        <a
          href="/Dogovor-KP.doc"
          download="Dogovor-KP.doc"
          className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-montserrat font-bold px-6 py-3 rounded-xl transition-colors text-base mb-10"
        >
          <Download size={18} />
          Скачать бланк ДКП
        </a>
        <div className="space-y-8 font-montserrat text-muted leading-relaxed">
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Что такое ДКП?</h2>
            <p>ДКП (Договор купли-продажи) — документ, подтверждающий факт покупки транспортного средства. При ввозе авто из США используется договор между нашей компанией и клиентом.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Зачем нужен ДКП?</h2>
            <p>ДКП необходим для постановки автомобиля на учёт в ГАИ, подтверждения легальности приобретения, а также при последующей продаже автомобиля.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Что входит в ДКП?</h2>
            <ul className="list-none flex flex-col gap-1 mt-2">
              {['Данные продавца и покупателя', 'Характеристики авто (марка, модель, год, VIN, объём двигателя)', 'Стоимость сделки', 'Дата и подписи сторон'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Как мы оформляем ДКП?</h2>
            <p>Мы составляем ДКП после завершения таможенного оформления и передаём его вместе с комплектом документов на автомобиль.</p>
          </section>
        </div>
        <div className="mt-10">
          <Button href="/contacts">Задать вопрос</Button>
        </div>
      </div>
    </div>
  )
}
