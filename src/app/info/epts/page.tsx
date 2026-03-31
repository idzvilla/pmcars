// src/app/info/epts/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import { Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ЭПТС — Электронный паспорт ТС',
  description: 'Что такое ЭПТС, как получить электронный паспорт транспортного средства при ввозе авто из США.',
}

export default function EptsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">ЭПТС</h1>
        <p className="text-muted font-montserrat text-lg mb-6">Электронный паспорт транспортного средства</p>
        <a
          href="/Blank-EPTS.docx"
          download="Blank-EPTS.docx"
          className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-montserrat font-bold px-6 py-3 rounded-xl transition-colors text-base mb-10"
        >
          <Download size={18} />
          Скачать бланк ЭПТС
        </a>
        <div className="space-y-8 font-montserrat text-muted leading-relaxed">
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Что такое ЭПТС?</h2>
            <p>ЭПТС (Электронный паспорт транспортного средства) — обязательный документ для регистрации автомобиля в Республике Беларусь. Он содержит все технические характеристики авто и историю владельцев в электронном виде.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Кому нужен ЭПТС?</h2>
            <p>ЭПТС необходим для каждого автомобиля, ввозимого из-за рубежа и регистрируемого в РБ. Без ЭПТС постановка на учёт в ГАИ невозможна.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Как получить ЭПТС?</h2>
            <p>ЭПТС оформляется при таможенном оформлении автомобиля. Стоимость — 70 BYN. Мы берём на себя все формальности по его получению — вам ничего делать не нужно.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Сроки</h2>
            <p>ЭПТС оформляется в течение 1–3 рабочих дней после завершения таможенного оформления.</p>
          </section>
        </div>
        <div className="mt-10">
          <Button href="/contacts">Задать вопрос</Button>
        </div>
      </div>
    </div>
  )
}
