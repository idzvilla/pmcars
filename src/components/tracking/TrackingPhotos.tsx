'use client'
import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { TrackingPhotoCategory } from '@/lib/tracking'

interface Props {
  photos: TrackingPhotoCategory[]
}

export default function TrackingPhotos({ photos }: Props) {
  const withPhotos = photos.filter((p) => p.count > 0)
  const [lightbox, setLightbox] = useState<{ category: TrackingPhotoCategory; index: number } | null>(null)

  if (!withPhotos.length) return null

  function openLightbox(category: TrackingPhotoCategory, index = 0) {
    if (category.imageUrls.length) setLightbox({ category, index })
  }

  const prev = useCallback(() => {
    if (!lightbox) return
    const max = lightbox.category.imageUrls.length - 1
    setLightbox({ ...lightbox, index: lightbox.index === 0 ? max : lightbox.index - 1 })
  }, [lightbox])

  const next = useCallback(() => {
    if (!lightbox) return
    const max = lightbox.category.imageUrls.length - 1
    setLightbox({ ...lightbox, index: lightbox.index === max ? 0 : lightbox.index + 1 })
  }, [lightbox])

  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next])

  return (
    <div>
      <h3 className="font-muller font-bold text-lg text-body mb-4">Фото</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {withPhotos.map((cat) => (
          <button
            key={cat.category}
            onClick={() => openLightbox(cat)}
            disabled={cat.count === 0}
            className={`relative rounded-xl overflow-hidden bg-gray-100 aspect-video text-left
              ${cat.count > 0 ? 'cursor-pointer hover:opacity-90 transition-opacity' : 'opacity-50 cursor-default'}`}
          >
            {cat.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cat.thumbnailUrl} alt={cat.category} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Images className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3">
              <p className="text-white font-montserrat font-bold text-sm leading-tight">{cat.category}</p>
              <p className="text-white/70 font-montserrat text-xs">{cat.count} фото</p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографий"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary"
            onClick={() => setLightbox(null)}
            aria-label="Закрыть"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            className="absolute left-4 text-white hover:text-primary"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.category.imageUrls[lightbox.index]}
              alt={`${lightbox.category.category} ${lightbox.index + 1}`}
              className="max-h-[65vh] object-contain rounded-lg"
            />
            <p className="text-white font-montserrat text-sm">
              {lightbox.category.category} — {lightbox.index + 1} / {lightbox.category.imageUrls.length}
            </p>
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
              {lightbox.category.imageUrls.map((url, i) => (
                <button key={i} onClick={() => setLightbox({ ...lightbox, index: i })} aria-label={`Фото ${i + 1}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className={`w-16 h-12 object-cover rounded flex-shrink-0 border-2
                      ${i === lightbox.index ? 'border-primary' : 'border-transparent'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            className="absolute right-4 text-white hover:text-primary"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Следующее фото"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  )
}
