// src/components/sections/HeroSection.tsx
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-dark-bg via-[#0f1f2e] to-dark-bg min-h-[600px] flex items-center">
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/40" />
      <div className="container py-20">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
            Авто с мировых аукционов • Беларусь
          </p>
          <h1 className="font-muller font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Авто из&nbsp;США, Китая и&nbsp;Кореи под&nbsp;ключ
          </h1>
          <p className="text-white/60 font-montserrat text-lg mb-8 leading-relaxed">
            Подбираем так, чтобы не было стыдно. Официальный договор, фиксированная стоимость услуг.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/info/kalkulyator-rashod" size="lg">
              Рассчитать стоимость
            </Button>
            <a
              href="https://t.me/pmcars"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded border-2 border-white/20 text-white font-montserrat font-bold text-lg hover:border-primary hover:text-primary transition-colors"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
