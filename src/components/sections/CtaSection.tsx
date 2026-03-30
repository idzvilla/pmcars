// src/components/sections/CtaSection.tsx
export default function CtaSection() {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="container text-center">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-white mb-4">
          Готовы начать?
        </h2>
        <p className="text-white/80 font-montserrat mb-10 max-w-lg mx-auto">
          Оставьте заявку — свяжемся в течение часа
        </p>
        <a
          href="https://t.me/pmcars"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-10 py-4 rounded bg-white text-primary font-montserrat font-bold text-lg hover:bg-white/90 transition-colors"
        >
          Написать в Telegram
        </a>
      </div>
    </section>
  )
}
