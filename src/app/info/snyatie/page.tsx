// src/app/info/snyatie/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Снятие с учёта',
  description: 'Нужно ли снимать авто с учёта в США перед ввозом в Беларусь. Процесс и документы.',
}

export default function SnyatiePage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">Снятие с учёта</h1>
        <p className="text-muted font-montserrat text-lg mb-10">Снятие авто с учёта в США</p>
        <div className="space-y-8 font-montserrat text-muted leading-relaxed">
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Нужно ли снимать авто с учёта?</h2>
            <p>Авто, купленное на аукционах Copart или IAAI, как правило, уже снято с учёта — оно оформлено на страховую компанию и не имеет номерных знаков. Для экспорта из США это стандартная ситуация.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Что происходит с документами?</h2>
            <p>При покупке на аукционе вы получаете Title (аналог ПТС в США). После завершения сделки Title переоформляется на покупателя. Этот документ является основанием для таможенного оформления в Беларуси.</p>
          </section>
          <section>
            <h2 className="font-muller font-bold text-2xl text-body mb-3">Постановка на учёт в Беларуси</h2>
            <p>После получения ЭПТС и ДКП вы можете поставить автомобиль на учёт в ГАИ. Процедура стандартная: предоставить документы, пройти техосмотр, получить номерные знаки.</p>
          </section>
        </div>
        <div className="mt-10">
          <Button href="/contacts">Задать вопрос</Button>
        </div>
      </div>
    </div>
  )
}
