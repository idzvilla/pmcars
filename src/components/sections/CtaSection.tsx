// src/components/sections/CtaSection.tsx
import Button from '@/components/ui/Button'

export default function CtaSection() {
  return (
    <section className="bg-dark-bg py-16 md:py-24">
      <div className="container text-center">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-white mb-4">
          Готовы начать?
        </h2>
        <p className="text-white/50 font-montserrat mb-10 max-w-lg mx-auto">
          Оставьте заявку — мы свяжемся в течение часа и расскажем всё о вашем будущем автомобиле
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/contacts" size="lg">Оставить заявку</Button>
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
    </section>
  )
}
