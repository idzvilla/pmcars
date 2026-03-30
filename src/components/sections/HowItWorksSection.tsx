// src/components/sections/HowItWorksSection.tsx
const steps = [
  {
    num: '01',
    title: 'Рассказываете что хотите',
    text: 'Бюджет, марка, пожелания по состоянию. Мы находим подходящие лоты и присылаем подборку с разбором каждого.',
  },
  {
    num: '02',
    title: 'Выбираете — мы торгуемся',
    text: 'Вы одобряете лот, подписываем договор, вносите депозит. Участвуем в торгах от вашего имени.',
  },
  {
    num: '03',
    title: 'Авто едет морем',
    text: 'Забираем с площадки, грузим в контейнер, отправляем. Держим в курсе где авто прямо сейчас.',
  },
  {
    num: '04',
    title: 'Забираете в Минске',
    text: 'Встречаем в порту, оформляем таможню, получаем ЭПТС. Передаём ключи.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="mb-12">
          <div className="w-10 h-[3px] bg-primary mb-5" />
          <h2 className="font-muller font-bold text-3xl md:text-4xl text-body">
            Как это работает
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-14 -right-6 h-[1px] bg-primary/15" />
              )}
              <div className="flex flex-col">
                <span className="font-muller font-bold text-6xl text-primary/15 mb-3 leading-none">{s.num}</span>
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
