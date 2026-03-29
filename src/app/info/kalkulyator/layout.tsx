// src/app/info/kalkulyator/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Таможенный калькулятор',
  description: 'Рассчитайте таможенные платежи при ввозе автомобиля из США в Беларусь онлайн.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
