'use client'
import { TrackingStage } from '@/lib/tracking'

interface Props {
  stages: TrackingStage[]
}

function formatName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function TrackingTimeline({ stages }: Props) {
  if (!stages.length) return null

  const activeIndex = stages.reduce((last, s, i) => (s.isActive ? i : last), -1)

  return (
    <div className="bg-light-bg rounded-2xl p-6">
      <div className="flex flex-col">
        {stages.map((stage, i) => {
          const done = i <= activeIndex
          const current = i === activeIndex
          return (
            <div key={`${stage.name}-${i}`} className="flex items-start gap-4">
              {/* Node + vertical connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                    ${done ? 'bg-primary border-primary' : 'bg-white border-gray-300'}
                    ${current ? 'ring-4 ring-primary/20' : ''}`}
                  aria-current={current ? 'step' : undefined}
                >
                  {done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                {i < stages.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[24px] mt-1
                    ${i < activeIndex ? 'bg-primary' : 'bg-gray-200'}`}
                  />
                )}
              </div>
              {/* Content */}
              <div className={`pb-5 ${i === stages.length - 1 ? 'pb-0' : ''}`}>
                <p className={`font-montserrat font-bold text-sm leading-tight
                  ${done ? 'text-body' : 'text-muted'}`}>
                  {formatName(stage.name)}
                </p>
                {stage.date && stage.date !== 'TBA' && (
                  <p className="font-montserrat text-xs text-muted mt-0.5">{stage.date}</p>
                )}
                {!!stage.hiddenCount && (
                  <p className="font-montserrat text-xs text-primary mt-0.5">+{stage.hiddenCount} этапов</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
