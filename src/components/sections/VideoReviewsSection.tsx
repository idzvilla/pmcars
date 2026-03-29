// src/components/sections/VideoReviewsSection.tsx
'use client'
import { useState } from 'react'
import { Play } from 'lucide-react'

const videos = [
  { id: 'YOUTUBE_ID_1', title: 'Отзыв клиента — Ford Mustang' },
  { id: 'YOUTUBE_ID_2', title: 'Отзыв клиента — Chevrolet Tahoe' },
  { id: 'YOUTUBE_ID_3', title: 'Отзыв клиента — BMW X5' },
  { id: 'YOUTUBE_ID_4', title: 'Отзыв клиента — Toyota Camry' },
]

function VideoCard({ video }: { video: typeof videos[0] }) {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`

  if (playing) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={video.title}
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full aspect-video rounded-xl overflow-hidden group"
      aria-label={`Воспроизвести: ${video.title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumb} alt={video.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play size={20} className="text-white ml-1" fill="white" />
        </div>
      </div>
      <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-montserrat text-left line-clamp-1">
        {video.title}
      </p>
    </button>
  )
}

export default function VideoReviewsSection() {
  return (
    <section className="bg-dark-bg py-16 md:py-24">
      <div className="container">
        <h2 className="font-muller font-bold text-3xl md:text-4xl text-white text-center mb-4">
          Что говорят наши клиенты
        </h2>
        <p className="text-white/40 font-montserrat text-center mb-12">
          Видеоотзывы реальных покупателей
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      </div>
    </section>
  )
}
