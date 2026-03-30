// src/components/sections/HowItWorksSection.tsx
const steps = [
  {
    num: '01',
    title: 'Подбор авто',
    text: 'Вы указываете бюджет и пожелания. Мы находим подходящие лоты на Copart и IAAI, проверяем историю и состояние.',
  },
  {
    num: '02',
    title: 'Покупка на аукционе',
    text: 'Участвуем в торгах от вашего имени. После победы оплачиваете лот и доставку по инвойсу через банк.',
  },
  {
    num: '03',
    title: 'Доставка морем',
    text: 'Авто забирается с площадки аукциона, грузится в порту и отправляется морским контейнером. Срок 30–45 дней.',
  },
  {
    num: '04',
    title: 'Растаможка и передача',
    text: 'Встречаем авто в порту, проводим таможенное оформление, получаем ЭПТС. Передаём вам ключи в Минске.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-body text-center mb-12">
          Как это работает
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-14 -right-6 h-[1px] bg-primary/15" />
              )}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <span className="font-muller font-bold text-5xl text-primary/20 mb-3 leading-none">{s.num}</span>
                <h3 className="font-muller font-bold text-lg text-body mb-2">{s.title}</h3>
                <p className="font-montserrat text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
