// src/components/sections/PartnersSection.tsx
export default function PartnersSection() {
  return (
    <section className="bg-dark-bg py-12">
      <div className="container">
        <p className="text-center text-white/30 font-montserrat text-xs uppercase tracking-widest mb-8">
          Работаем напрямую с крупнейшими аукционами США
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/5 border border-white/10 rounded-xl px-10 py-5">
              <span className="font-muller font-bold text-white text-2xl tracking-widest">COPART</span>
            </div>
            <span className="text-white/30 text-xs font-montserrat">Крупнейший авто-аукцион США</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/5 border border-white/10 rounded-xl px-10 py-5">
              <span className="font-muller font-bold text-white text-2xl tracking-widest">IAAI</span>
            </div>
            <span className="text-white/30 text-xs font-montserrat">Insurance Auto Auctions</span>
          </div>
        </div>
      </div>
    </section>
  )
}
