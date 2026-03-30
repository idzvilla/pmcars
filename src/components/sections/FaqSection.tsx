// src/components/sections/FaqSection.tsx
import Accordion, { type AccordionItem } from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'

const faqItems: AccordionItem[] = [
  {
    question: 'Сколько стоит услуга по доставке авто из США?',
    answer: 'Тариф «Экспресс» — 300 руб (вы присылаете готовый лот, мы проводим аукцион и организуем доставку). Тариф «Стандартный» — 600 руб (включает подбор авто, консультацию по лоту, оценку повреждений). Корпоративным клиентам — индивидуально.',
  },
  {
    question: 'Какой срок доставки авто из США?',
    answer: 'В среднем 2–3 месяца: 1–2 недели на покупку и отправку, 30–45 дней морем, 2–3 недели на таможню и оформление.',
  },
  {
    question: 'Как происходит оплата?',
    answer: 'Оплата по инвойсу через банковский перевод. В связи с санкциями переводы идут через компании-посредники, комиссия 4–5%. Плюс комиссия банка РБ: 20–100 BYN и 80–85 EUR за оформление документов.',
  },
  {
    question: 'Что включено в итоговую стоимость авто?',
    answer: 'Аукционный сбор, доставка по США до порта, морская перевозка, доставка из порта в РБ, растаможка и таможенные платежи, услуги декларанта.',
  },
  {
    question: 'Можно ли отследить где находится мой автомобиль?',
    answer: 'Да. После покупки мы предоставляем трекинг-данные и регулярно обновляем статус доставки. Также вы можете воспользоваться разделом «Отслеживание авто» на нашем сайте.',
  },
]

export default function FaqSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-4xl md:text-5xl text-body tracking-tight text-center mb-14">
          Частые вопросы
        </h2>
        <div className="max-w-3xl mx-auto mb-10">
          <Accordion items={faqItems} />
        </div>
        <div className="text-center">
          <Button href="/faq" variant="outline">Все вопросы и ответы</Button>
        </div>
      </div>
    </section>
  )
}
