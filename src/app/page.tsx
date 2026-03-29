// src/app/page.tsx
import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import TariffsSection from '@/components/sections/TariffsSection'
import StatsSection from '@/components/sections/StatsSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import PartnersSection from '@/components/sections/PartnersSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ServicesSection from '@/components/sections/ServicesSection'
import TeamSection from '@/components/sections/TeamSection'
import VideoReviewsSection from '@/components/sections/VideoReviewsSection'
import FaqSection from '@/components/sections/FaqSection'
import CtaSection from '@/components/sections/CtaSection'

export const metadata: Metadata = {
  title: 'Авто из США в Беларусь под ключ | pmcars.by',
  description: 'Импорт автомобилей из США в Беларусь под ключ. Подбор на Copart и IAAI, доставка, растаможка. Официальный договор, без скрытых комиссий.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TariffsSection />
      <StatsSection />
      <AdvantagesSection />
      <PartnersSection />
      <HowItWorksSection />
      <ServicesSection />
      <TeamSection />
      <VideoReviewsSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
