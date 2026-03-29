// src/app/tracking/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Отслеживание авто',
  description: 'Отслеживайте статус доставки вашего автомобиля из США.',
}

export default function TrackingPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-xl">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Отслеживание авто
        </h1>
        <p className="text-muted font-montserrat mb-10">
          Введите VIN или номер заказа чтобы узнать статус вашего автомобиля
        </p>
        <div className="bg-light-bg rounded-2xl p-8 mb-8">
          <label className="block font-montserrat font-bold text-sm text-body mb-2">
            VIN / Номер заказа
          </label>
          <input
            type="text"
            placeholder="Например: 1HGBH41JXMN109186"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary mb-4"
            readOnly
          />
          <button
            disabled
            className="w-full px-6 py-3 bg-primary/50 text-white font-montserrat font-bold rounded cursor-not-allowed text-base"
          >
            Отследить
          </button>
          <p className="text-center text-xs text-muted font-montserrat mt-3">
            Функция в разработке
          </p>
        </div>
        <div className="bg-dark-bg rounded-2xl p-8 text-center">
          <p className="text-white font-montserrat mb-4">
            Для получения актуального статуса доставки — свяжитесь с менеджером
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer"
               className="px-5 py-2 bg-[#2AABEE] text-white rounded font-montserrat font-bold text-sm">
              Telegram
            </a>
            <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer"
               className="px-5 py-2 bg-[#25D366] text-white rounded font-montserrat font-bold text-sm">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
