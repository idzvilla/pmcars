// src/components/sections/TeamSection.tsx
const team = [
  { name: 'Имя Фамилия', role: 'Основатель / Подбор авто' },
  { name: 'Имя Фамилия', role: 'Логистика и доставка' },
  { name: 'Имя Фамилия', role: 'Таможенное оформление' },
]

export default function TeamSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-4">
          Наша команда
        </h2>
        <p className="text-muted font-montserrat text-center mb-12 max-w-xl mx-auto">
          Люди, которые разбираются в автомобилях
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {team.map((p) => (
            <div key={p.role} className="text-center">
              <div className="w-32 h-32 rounded-full bg-light-bg mx-auto mb-4 overflow-hidden border-4 border-primary/20 flex items-center justify-center text-muted text-4xl">
                👤
              </div>
              <h3 className="font-muller font-bold text-lg text-body">{p.name}</h3>
              <p className="font-montserrat text-sm text-muted">{p.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
