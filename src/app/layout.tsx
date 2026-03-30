// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Agentation } from 'agentation'

export const metadata: Metadata = {
  title: {
    default: 'Авто из США в Беларусь под ключ | pmcars.by',
    template: '%s | pmcars.by',
  },
  description: 'Импорт автомобилей из США в Беларусь под ключ. Подбор на аукционах Copart и IAAI, доставка, растаможка, официальный договор. Без скрытых комиссий.',
  metadataBase: new URL('https://pmcars.by'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="font-montserrat">
        <Header />
        <main className="pt-[90px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
