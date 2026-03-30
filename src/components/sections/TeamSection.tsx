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
        <div className="mb-12">
          <div className="w-10 h-[3px] bg-primary mb-5" />
          <div className="lg:flex lg:items-end lg:gap-16">
            <h2 className="font-muller font-bold text-3xl md:text-4xl text-white mb-4 lg:mb-0 lg:w-64 flex-shrink-0">
              Команда
            </h2>
            <p className="text-white/50 font-montserrat max-w-md">
              Живые люди, не колл-центр. Каждый менеджер ведёт клиента сам от начала до конца.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          {team.map((p) => (
            <div key={p.role} className="bg-dark-card rounded-2xl p-6">
              <div className="w-16 h-16 rounded-xl bg-dark-bg mb-4 overflow-hidden flex items-center justify-center text-white/20 text-2xl">
                👤
              </div>
              <h3 className="font-muller font-bold text-lg text-white mb-1">{p.name}</h3>
              <p className="font-montserrat text-sm text-primary mb-4">{p.role}</p>
              <a
                href={`https://t.me/${p.tg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/50 font-montserrat text-sm hover:text-primary transition-colors"
              >
                Написать в Telegram →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
