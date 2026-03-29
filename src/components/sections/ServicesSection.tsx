// src/components/sections/ServicesSection.tsx
import Button from '@/components/ui/Button'
import { Search, Ship, FileCheck, Car } from 'lucide-react'

const services = [
  {
    icon: Search,
    title: 'Подбор на аукционе',
    text: 'Ищем подходящий лот по вашим критериям. Проверяем историю, пробег, повреждения.',
  },
  {
    icon: Ship,
    title: 'Доставка из США',
    text: 'Организуем полную логистику: склад в США, морской контейнер, доставка в Беларусь.',
  },
  {
    icon: FileCheck,
    title: 'Растаможка под ключ',
    text: 'Таможенное оформление, уплата пошлин, получение ЭПТС и постановка на учёт.',
  },
  {
    icon: Car,
    title: 'Подбор для перепродажи',
    text: 'Помогаем оптовым клиентам — специальные условия при регулярных заказах.',
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-4">
          Наши услуги
        </h2>
        <p className="text-muted font-montserrat text-center mb-12 max-w-xl mx-auto">
          Берём на себя весь процесс — от поиска авто до передачи ключей
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-xl p-6 shadow-sm flex gap-4">
              <s.icon size={28} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-muller font-bold text-lg text-body mb-1">{s.title}</h3>
                <p className="font-montserrat text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button href="/uslugi" variant="outline" size="lg">Все услуги</Button>
        </div>
      </div>
    </section>
  )
}
