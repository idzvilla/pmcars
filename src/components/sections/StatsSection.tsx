// src/components/sections/StatsSection.tsx
const stats = [
  { value: '500+', label: 'авто доставлено' },
  { value: '5 лет', label: 'на рынке' },
  { value: '0', label: 'скрытых комиссий' },
  { value: '2–3 мес', label: 'средний срок доставки' },
]

export default function StatsSection() {
  return (
    <section className="bg-dark-bg py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-muller font-bold text-3xl md:text-4xl text-primary mb-1">{s.value}</p>
              <p className="font-montserrat text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
