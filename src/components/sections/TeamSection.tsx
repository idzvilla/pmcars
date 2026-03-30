// src/components/sections/TeamSection.tsx
const team = [
  { name: 'Имя Фамилия', role: 'Основатель / Подбор авто', tg: 'pmcars' },
  { name: 'Имя Фамилия', role: 'Логистика и доставка', tg: 'pmcars' },
  { name: 'Имя Фамилия', role: 'Таможенное оформление', tg: 'pmcars' },
]

export default function TeamSection() {
  return (
    <section className="bg-dark-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-white text-center mb-4">
          Команда
        </h2>
        <p className="text-white/60 font-montserrat text-center mb-12 max-w-xl mx-auto">
          Живые люди, не колл-центр. Каждый менеджер ведёт клиента сам от начала до конца.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {team.map((p) => (
            <div key={p.role} className="text-center">
              <div className="w-32 h-32 rounded-2xl bg-dark-card mx-auto mb-4 overflow-hidden flex items-center justify-center text-white/20 text-4xl">
                👤
              </div>
              <h3 className="font-muller font-bold text-lg text-white mb-1">{p.name}</h3>
              <p className="font-montserrat text-sm text-primary mb-4">{p.role}</p>
              <a
                href={`https://t.me/${p.tg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded border border-white/20 text-white/70 font-montserrat text-sm hover:border-primary hover:text-primary transition-colors"
              >
                Написать в Telegram
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
