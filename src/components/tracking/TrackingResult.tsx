import { TrackingData } from '@/lib/tracking'
import TrackingTimeline from './TrackingTimeline'
import TrackingPhotos from './TrackingPhotos'
import { ExternalLink } from 'lucide-react'

interface Props {
  data: TrackingData
}

function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function InfoCard({ title, rows }: { title: string; rows: { label: string; value: string | null; link?: string }[] }) {
  const visibleRows = rows.filter((r) => r.value)
  if (!visibleRows.length) return null
  return (
    <div className="bg-light-bg rounded-2xl p-6">
      <h3 className="font-muller font-bold text-base text-body mb-4 uppercase tracking-wide">{title}</h3>
      <div className="space-y-3">
        {visibleRows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <span className="text-muted font-montserrat text-sm flex-shrink-0">{row.label}</span>
            {row.link ? (
              <a href={row.link} target="_blank" rel="noopener noreferrer"
                className="text-primary font-montserrat text-sm font-bold flex items-center gap-1 hover:underline">
                {row.value} <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-body font-montserrat text-sm font-bold text-right">{row.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TrackingResult({ data }: Props) {
  const currentStage = data.stages.filter((s) => s.isActive).at(-1)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-dark-bg rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-white/50 font-montserrat text-sm mb-1">VIN: {data.commodity.vin}</p>
            <h2 className="font-muller font-bold text-2xl text-white">{data.commodity.vehicle || data.commodity.vin}</h2>
            {data.commodity.lotNo && (
              <p className="text-white/50 font-montserrat text-sm mt-1">Лот: {data.commodity.lotNo}</p>
            )}
          </div>
          {currentStage && (
            <span className="flex-shrink-0 px-4 py-2 bg-primary text-white font-montserrat font-bold rounded-lg text-sm">
              {capitalize(currentStage.name)}
            </span>
          )}
        </div>
      </div>

      {/* Timeline */}
      {data.stages.length > 0 && <TrackingTimeline stages={data.stages} />}

      {/* Info cards */}
      <div className="space-y-4">
        <InfoCard title="Доставка" rows={[
          { label: 'Пункт назначения', value: data.shipping.destination },
          { label: 'Линия', value: data.shipping.line },
          { label: 'Судно', value: data.shipping.vessel },
          { label: 'Контейнер', value: data.shipping.containerNo },
          ...(data.shipping.trackingUrl ? [{ label: 'Трекинг судна', value: 'Открыть', link: data.shipping.trackingUrl }] : []),
        ]} />

        <InfoCard title="Инспекция" rows={[
          { label: 'Цвет', value: data.inspection.color },
          { label: 'Состояние', value: data.inspection.condition },
          { label: 'Повреждения', value: data.inspection.damage },
        ]} />

        {data.saleOrigin.origin && (
          <InfoCard title="Происхождение" rows={[
            { label: 'Аукцион', value: data.saleOrigin.origin },
          ]} />
        )}
      </div>

      {/* Photos */}
      {data.photos.some((p) => p.count > 0) && <TrackingPhotos photos={data.photos} />}
    </div>
  )
}
