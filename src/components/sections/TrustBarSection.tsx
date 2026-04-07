// src/components/sections/TrustBarSection.tsx
const stats = [
  { value: '200+', label: 'авто доставлено' },
  { value: '2–3 мес', label: 'средний срок' },
  { value: '8 лет', label: 'на рынке' },
  { value: '4.9 ★', label: 'средняя оценка' },
]

export default function TrustBarSection() {
  return (
    <div className="bg-dark-bg border-b border-white/[0.06]">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-5 text-center first:pl-0 last:pr-0">
              <p className="font-muller font-bold text-2xl text-primary mb-0.5">{s.value}</p>
              <p className="font-montserrat text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
