import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Калькулятор расходов',
  description: 'Рассчитайте полную стоимость покупки и доставки автомобиля из США в Беларусь: аукцион, доставка, таможня.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
