// src/components/sections/TeamSection.tsx
const team = [
  { name: 'Имя Фамилия', role: 'Основатель / Подбор авто', tg: 'plusminus_cars' },
  { name: 'Имя Фамилия', role: 'Логистика и доставка', tg: 'plusminus_cars' },
  { name: 'Имя Фамилия', role: 'Таможенное оформление', tg: 'plusminus_cars' },
]

export default function TeamSection() {
  return (
    <section className="pb-14 md:pb-16 border-b border-gray-100 mb-14 md:mb-16">
      <h2 className="font-muller font-bold text-3xl md:text-4xl lg:text-5xl text-body mb-3">
        Живые люди, не колл-центр
      </h2>
      <p className="font-montserrat text-base text-muted mb-8 max-w-xl">
        Каждый менеджер ведёт клиента сам от начала до конца — не передаёт между отделами.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
        {team.map((p) => (
          <div key={p.role} className="bg-light-bg rounded-2xl p-6 border border-gray-100 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-gray-200 mb-4 overflow-hidden flex items-center justify-center text-gray-400 text-xl flex-shrink-0">
              👤
            </div>
            <h3 className="font-muller font-bold text-base text-body mb-1">{p.name}</h3>
            <p className="font-montserrat text-xs text-primary mb-4">{p.role}</p>
            <a
              href={`https://t.me/${p.tg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted font-montserrat text-xs hover:text-primary transition-colors mt-auto"
            >
              Написать в Telegram →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
