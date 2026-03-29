// src/components/ui/Accordion.tsx
'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-gray-200">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center py-4 px-0 text-left font-montserrat font-bold text-body hover:text-primary transition-colors"
            aria-expanded={openIndex === i}
          >
            <span>{item.question}</span>
            <ChevronDown
              size={18}
              className={`flex-shrink-0 ml-4 text-primary transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            style={{
              maxHeight: openIndex === i ? '24rem' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}
            aria-hidden={openIndex !== i}
          >
            <p className="text-muted font-montserrat text-sm leading-relaxed pb-4">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
