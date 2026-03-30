// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pmcars.by'
  const pages = [
    '',
    '/uslugi',
    '/dostavka',
    '/tracking',
    '/faq',
    '/oferta',
    '/contacts',
    '/info/kalkulyator',
    '/info/kalkulyator-rashod',
    '/info/epts',
    '/info/dkp',
    '/info/snyatie',
  ]
  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))
}
