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
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-12">
          Почему работают с нами
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((a) => (
            <div key={a.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <a.icon size={32} className="text-primary mb-4" />
              <h3 className="font-muller font-bold text-lg text-body mb-2">{a.title}</h3>
              <p className="font-montserrat text-sm text-muted leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
