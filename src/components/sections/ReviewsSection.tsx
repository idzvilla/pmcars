// src/components/sections/ReviewsSection.tsx
const reviews = [
  {
    name: 'Алексей',
    car: 'BMW X3 2021',
    text: 'От покупки до ключей — 67 дней. Ни одного скрытого платежа. Всё как договорились.',
  },
  {
    name: 'Дмитрий',
    car: 'Toyota Camry SE 2022',
    text: 'Всё прозрачно, как и обещали. Смета совпала с итогом до рубля.',
  },
  {
    name: 'Сергей',
    car: 'Kia Sorento 2021',
    text: 'Брал через стандартный тариф. Менеджер был на связи весь путь — не нужно было самому ничего отслеживать.',
  },
]

export default function ReviewsSection() {
  return (
    <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
      <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
        Что говорят клиенты
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {reviews.map((r) => (
          <div key={r.name} className="bg-light-bg rounded-2xl p-6 border border-gray-100 flex flex-col gap-4">
            <p className="font-montserrat text-sm text-body leading-relaxed flex-1">
              «{r.text}»
            </p>
            <div>
              <p className="font-muller font-bold text-sm text-body">{r.name}</p>
              <p className="font-montserrat text-xs text-muted">{r.car}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
