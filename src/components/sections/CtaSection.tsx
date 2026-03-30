// src/components/sections/CtaSection.tsx
export default function CtaSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="bg-primary rounded-3xl px-8 py-16 md:py-20 text-center">
          <h2 className="font-muller font-bold text-4xl md:text-5xl text-white tracking-tight mb-4">
            Готовы начать?
          </h2>
          <p className="text-white/80 font-montserrat text-lg mb-10 max-w-md mx-auto">
            Оставьте заявку — свяжемся в течение часа
          </p>
          <a
            href="https://t.me/pmcars"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-primary font-montserrat font-bold text-lg hover:bg-white/90 transition-colors"
          >
            Написать в Telegram
          </a>
        </div>
      </div>
    </section>
  )
}
