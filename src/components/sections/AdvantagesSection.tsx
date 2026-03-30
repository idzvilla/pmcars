// src/components/sections/AdvantagesSection.tsx
import { ShieldCheck, FileText, Star, Wrench, Users, Clock } from 'lucide-react'

const advantages = [
  {
    icon: ShieldCheck,
    title: 'Официальный договор',
    text: 'Каждая сделка закреплена договором. Ваши деньги защищены юридически с первого платежа.',
  },
  {
    icon: FileText,
    title: 'Никаких скрытых комиссий',
    text: 'Показываем все расходы до старта. Платите ровно то, что в смете — ни рублём больше.',
  },
  {
    icon: Star,
    title: 'Только США',
    text: 'Не распыляемся на Корею и Европу. Знаем Copart и IAAI изнутри — это даёт реальное преимущество при торгах.',
  },
  {
    icon: Wrench,
    title: 'Оцениваем лоты честно',
    text: 'Скажем если авто битое сильнее чем кажется. Лучше отговорить, чем потом объяснять.',
  },
  {
    icon: Users,
    title: 'Один менеджер от и до',
    text: 'Не передаём между отделами. Один человек ведёт вас от подбора до ключей в руках.',
  },
  {
    icon: Clock,
    title: 'Сроки — не обещания',
    text: 'Средний срок доставки 2–3 месяца. Обновляем статус на каждом этапе.',
  },
]

export default function AdvantagesSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="container">
        <div className="mb-12">
          <div className="w-10 h-[3px] bg-primary mb-5" />
          <div className="lg:flex lg:items-end lg:gap-16">
            <h2 className="font-muller font-bold text-3xl md:text-4xl text-body mb-4 lg:mb-0 lg:w-64 flex-shrink-0">
              Почему работают с нами
            </h2>
            <p className="text-muted font-montserrat max-w-md">
              Специализация на одном рынке, честность на каждом шаге и один менеджер от заявки до ключей.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {advantages.map((a, i) => (
            <div
              key={a.title}
              className={`rounded-2xl p-6 transition-shadow hover:shadow-md ${
                i === 0 ? 'bg-dark-bg text-white' : 'bg-white'
              }`}
            >
              <a.icon size={28} className={`mb-4 ${i === 0 ? 'text-primary' : 'text-primary'}`} />
              <h3 className={`font-muller font-bold text-lg mb-2 ${i === 0 ? 'text-white' : 'text-body'}`}>{a.title}</h3>
              <p className={`font-montserrat text-sm leading-relaxed ${i === 0 ? 'text-white/60' : 'text-muted'}`}>{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
