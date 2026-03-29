// src/app/uslugi/page.tsx
import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import { Search, Ship, FileCheck, Car, Calculator, ClipboardList } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Услуги по доставке авто из США',
  description: 'Полный спектр услуг по импорту автомобилей из США в Беларусь: подбор, доставка, растаможка, оформление документов.',
}

const services = [
  {
    icon: Search,
    title: 'Подбор авто на аукционе',
    text: 'Анализируем тысячи лотов на Copart и IAAI. Проверяем историю по CarFax, оцениваем реальное состояние авто по фото, находим лучшее соотношение цены и состояния под ваш бюджет.',
  },
  {
    icon: Car,
    title: 'Участие в торгах',
    text: 'Участвуем в аукционных торгах от вашего имени. Устанавливаем правильный лимит ставки с учётом всех последующих расходов, чтобы итоговая стоимость не вышла за ваш бюджет.',
  },
  {
    icon: Ship,
    title: 'Доставка из США',
    text: 'Организуем полную цепочку логистики: забираем авто с площадки аукциона, доставляем на склад, грузим в морской контейнер, сопровождаем до порта назначения и до Минска.',
  },
  {
    icon: FileCheck,
    title: 'Растаможка под ключ',
    text: 'Берём на себя все таможенные формальности: подготовку документов, уплату пошлин и сборов, получение ЭПТС. Вы не тратите время на бюрократию.',
  },
  {
    icon: ClipboardList,
    title: 'Помощь с документами',
    text: 'Помогаем с ДКП, снятием с учёта, постановкой на учёт в ГАИ. Консультируем по всем вопросам оформления.',
  },
  {
    icon: Calculator,
    title: 'Расчёт стоимости',
    text: 'Бесплатно рассчитаем полную стоимость любого лота: цена + аукционный сбор + доставка + растаможка. Никаких сюрпризов.',
  },
]

export default function UslugiPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">Наши услуги</h1>
        <p className="text-muted font-montserrat text-lg mb-12 max-w-2xl">
          Берём на себя весь процесс — от поиска авто на аукционе до передачи ключей в Минске
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {services.map((s) => (
            <div key={s.title} className="bg-light-bg rounded-xl p-8 flex gap-5">
              <s.icon size={32} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-muller font-bold text-xl text-body mb-2">{s.title}</h2>
                <p className="font-montserrat text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-dark-bg rounded-2xl p-10 text-center">
          <h2 className="font-muller font-bold text-2xl text-white mb-3">Нужна консультация?</h2>
          <p className="text-white/50 font-montserrat mb-6">Ответим на все вопросы и рассчитаем стоимость вашего авто</p>
          <Button href="/contacts" size="lg">Получить консультацию</Button>
        </div>
      </div>
    </div>
  )
}
