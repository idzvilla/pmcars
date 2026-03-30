// src/app/contacts/page.tsx
'use client'
import Image from 'next/image'
import { MapPin, Clock, Building2 } from 'lucide-react'

export default function ContactsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-3">Контакты</h1>
            <p className="text-muted font-montserrat text-lg mb-10">
              Ответим на любой вопрос — по телефону или в мессенджере
            </p>

            {/* Phone */}
            <a href="tel:+375296363636" className="font-muller font-bold text-4xl text-body hover:text-primary transition-colors block mb-4">
              +375 (29) 636-36-36
            </a>
            <div className="flex flex-wrap gap-2 mb-10">
              <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 font-montserrat text-sm text-body hover:border-primary hover:text-primary transition-colors">
                <Image src="/icons/tg.svg" alt="" width={16} height={16} />
                Telegram
              </a>
              <a href="https://wa.me/375296363636" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 font-montserrat text-sm text-body hover:border-primary hover:text-primary transition-colors">
                <Image src="/icons/wa.svg" alt="" width={16} height={16} />
                WhatsApp
              </a>
              <a href="viber://chat?number=+375296363636" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 font-montserrat text-sm text-body hover:border-primary hover:text-primary transition-colors">
                <Image src="/icons/vb.svg" alt="" width={16} height={16} />
                Viber
              </a>
            </div>

            {/* Details */}
            <div className="divide-y divide-gray-100 mb-12">
              <div className="flex items-start gap-4 py-5">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                <div>
                  <p className="font-montserrat text-body">г. Гомель, ул. Лепешинского 7И, оф. 89</p>
                  <p className="font-montserrat text-sm text-muted mt-0.5">Беларусь, 246007</p>
                </div>
              </div>
              <div className="flex items-center gap-4 py-5">
                <Clock size={18} className="text-primary flex-shrink-0" strokeWidth={1.75} />
                <p className="font-montserrat text-body">10:00 – 20:00, без выходных</p>
              </div>
              <div className="flex items-start gap-4 py-5">
                <Building2 size={18} className="text-primary mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                <div>
                  <p className="font-montserrat text-body">ООО «Плюс-Минус Карс»</p>
                  <p className="font-montserrat text-sm text-muted mt-0.5">УНП 491392898</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: map */}
          <div className="rounded-2xl overflow-hidden sticky top-[100px] shadow-sm">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=30.9573%2C52.4332&z=17&pt=30.9573%2C52.4332,pm2rdl&l=map"
              width="100%"
              height="620"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              title="Карта офиса"
            />
          </div>

        </div>
      </div>
    </div>
  )
}
