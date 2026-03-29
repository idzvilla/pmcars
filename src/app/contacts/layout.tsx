// src/app/contacts/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с pmcars.by — импорт авто из США в Беларусь. Телефон, Telegram, WhatsApp, адрес в Минске.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
