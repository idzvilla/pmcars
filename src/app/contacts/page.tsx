// src/app/contacts/page.tsx
'use client'
import Button from '@/components/ui/Button'

export default function ContactsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-12">Контакты</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="space-y-6 mb-10">
              <div>
                <p className="text-xs font-montserrat text-muted uppercase tracking-widest mb-1">Телефон</p>
                <a href="tel:+375XXXXXXXXX" className="font-muller font-bold text-2xl text-primary hover:text-primary-dark">
                  +375 (XX) XXX-XX-XX
                </a>
              </div>
              <div>
                <p className="text-xs font-montserrat text-muted uppercase tracking-widest mb-2">Мессенджеры</p>
                <div className="flex gap-3">
                  <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer"
                     className="px-5 py-2 bg-[#2AABEE] text-white rounded font-montserrat font-bold text-sm hover:opacity-90">
                    Telegram
                  </a>
                  <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer"
                     className="px-5 py-2 bg-[#25D366] text-white rounded font-montserrat font-bold text-sm hover:opacity-90">
                    WhatsApp
                  </a>
                  <a href="viber://chat?number=+375XXXXXXXXX" target="_blank" rel="noopener noreferrer"
                     className="px-5 py-2 bg-[#7360F2] text-white rounded font-montserrat font-bold text-sm hover:opacity-90">
                    Viber
                  </a>
                </div>
              </div>
              <div>
                <p className="text-xs font-montserrat text-muted uppercase tracking-widest mb-1">Адрес</p>
                <p className="font-montserrat text-body">[Адрес офиса в Минске]</p>
              </div>
              <div>
                <p className="text-xs font-montserrat text-muted uppercase tracking-widest mb-1">Режим работы</p>
                <p className="font-montserrat text-body">10:00 – 20:00, без выходных</p>
              </div>
            </div>
          </div>

          <div className="bg-light-bg rounded-2xl p-8">
            <h2 className="font-muller font-bold text-2xl text-body mb-6">Оставить заявку</h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                window.open('https://t.me/pmcars', '_blank')
              }}
            >
              <div>
                <label className="block font-montserrat text-sm text-muted mb-1">Имя</label>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-montserrat text-sm text-muted mb-1">Телефон</label>
                <input
                  type="tel"
                  placeholder="+375 (XX) XXX-XX-XX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-montserrat text-sm text-muted mb-1">Сообщение (необязательно)</label>
                <textarea
                  rows={3}
                  placeholder="Опишите что ищете..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">Отправить заявку</Button>
              <p className="text-xs text-muted font-montserrat text-center">
                Нажимая кнопку, вы соглашаетесь с <a href="/oferta" className="text-primary hover:underline">договором оферты</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
