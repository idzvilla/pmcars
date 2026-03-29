// src/components/sections/AdvantagesSection.tsx
import { ShieldCheck, Users, FileText, Star, MapPin, Wrench } from 'lucide-react'

const advantages = [
  {
    icon: Star,
    title: 'Только США',
    text: 'Специализируемся исключительно на рынке США. Знаем аукционы Copart и IAAI изнутри.',
  },
  {
    icon: ShieldCheck,
    title: 'Официальный договор',
    text: 'Заключаем договор с каждым клиентом. Ваши деньги защищены юридически.',
  },
  {
    icon: FileText,
    title: 'Прозрачные расходы',
    text: 'Показываем все платежи заранее. Никаких скрытых комиссий — только фактические затраты.',
  },
  {
    icon: Wrench,
    title: 'Команда автомобилистов',
    text: 'Наши специалисты разбираются в автомобилях — поможем выбрать правильный лот.',
  },
  {
    icon: Users,
    title: 'Индивидуальный подход',
    text: 'Работаем на качество, а не на количество. Ведём вас на каждом этапе.',
  },
  {
    icon: MapPin,
    title: 'Работаем по всей РБ',
    text: 'Клиенты из всех регионов Беларуси. Специальные условия для регионов.',
  },
]

export default function AdvantagesSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-12">
          Почему выбирают нас
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((a) => (
            <div key={a.title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
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
