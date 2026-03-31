import type { Metadata } from 'next'
import ProtsessPageClient from './ProtsessPageClient'

export const metadata: Metadata = {
  title: 'Процесс покупки авто из США | pmcars.by',
  description: 'Полный процесс покупки автомобиля из США в Беларусь: от заявки и подбора до таможни и получения. Прозрачно, пошагово, без скрытых платежей.',
}

export default function ProtsessPage() {
  return <ProtsessPageClient />
}
