// src/app/info/kalkulyator/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { calculateTotal, type CalculatorInput, type CalculatorResult } from '@/lib/calculator'
import Button from '@/components/ui/Button'
import { ChevronDown } from 'lucide-react'

const EUR_RATE_FALLBACK = 3.38

function fmt(n: number) {
  return new Intl.NumberFormat('ru-BY', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n)
}

export default function KalkulyatorPage() {
  const [eurRate, setEurRate] = useState(EUR_RATE_FALLBACK)
  const [input, setInput] = useState<Omit<CalculatorInput, 'eurRate'>>({
    carCost: 0,
    engineVolume: 0,
    carType: 'auto',
    engineType: 'ice',
    carAge: 'under3',
    decree140: false,
  })
  const [result, setResult] = useState<CalculatorResult>({
    carCost: 0,
    duty: 0,
    customsFee: 0,
    recyclingFee: 0,
    eptsFee: 0,
    total: 0,
  })

  useEffect(() => {
    fetch('https://api.nbrb.by/exrates/rates/451')
      .then((r) => r.json())
      .then((d) => { if (d?.Cur_OfficialRate) setEurRate(d.Cur_OfficialRate) })
      .catch(() => {})
  }, [])

  function handleCalculate() {
    if (!input.carCost || !input.engineVolume) return
    setResult(calculateTotal({ ...input, eurRate }))
  }

  const sel = 'w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary bg-white appearance-none'
  const inp = 'w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary'

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">Таможенный калькулятор</h1>
        <p className="text-muted font-montserrat text-lg mb-4 max-w-2xl">
          Расчёт таможенных платежей при ввозе авто из США в Беларусь
        </p>
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-light-bg border border-gray-200 font-montserrat text-sm text-body">
            🇪🇺 <span className="font-bold">EUR</span> {eurRate.toFixed(4)} BYN
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">

        <div className="bg-light-bg rounded-2xl p-8 space-y-5 mb-8 lg:mb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-montserrat font-bold text-sm text-body mb-1">Стоимость авто (EUR)</label>
              <input type="number" min={0} placeholder="Например: 15000" className={inp}
                value={input.carCost || ''} onChange={(e) => setInput({ ...input, carCost: +e.target.value })} />
            </div>
            <div>
              <label className="block font-montserrat font-bold text-sm text-body mb-1">Объём двигателя (куб. см)</label>
              <input type="number" min={0} placeholder="Например: 2000" className={inp}
                value={input.engineVolume || ''} onChange={(e) => setInput({ ...input, engineVolume: +e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block font-montserrat font-bold text-sm text-body mb-1">Тип ТС</label>
              <div className="relative">
                <select className={sel} value={input.carType}
                  onChange={(e) => setInput({ ...input, carType: e.target.value as 'auto' | 'moto' })}>
                  <option value="auto">Автомобиль</option>
                  <option value="moto">Мотоцикл</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
            </div>
            <div>
              <label className="block font-montserrat font-bold text-sm text-body mb-1">Тип двигателя</label>
              <div className="relative">
                <select className={sel} value={input.engineType}
                  onChange={(e) => setInput({ ...input, engineType: e.target.value as 'ice' | 'electric' })}>
                  <option value="ice">Бензин / Дизель</option>
                  <option value="electric">Электромобиль</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
            </div>
            <div>
              <label className="block font-montserrat font-bold text-sm text-body mb-1">Возраст авто</label>
              <div className="relative">
                <select className={sel} value={input.carAge}
                  onChange={(e) => setInput({ ...input, carAge: e.target.value as CalculatorInput['carAge'] })}>
                  <option value="under3">До 3 лет</option>
                  <option value="3to5">От 3 до 5 лет</option>
                  <option value="over5">Старше 5 лет</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-primary"
              checked={input.decree140} onChange={(e) => setInput({ ...input, decree140: e.target.checked })} />
            <span className="font-montserrat text-sm text-body">С учётом Указа №140 (льготная пошлина)</span>
          </label>

          <Button size="lg" className="w-full" onClick={handleCalculate}>
            Рассчитать
          </Button>
        </div>

        <div className="sticky top-24">
          <div className="bg-dark-bg rounded-2xl p-8 text-white">
            <h2 className="font-muller font-bold text-xl mb-6">Результат расчёта</h2>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Стоимость авто', value: result.carCost },
                { label: 'Таможенная пошлина', value: result.duty },
                { label: 'Таможенный сбор', value: result.customsFee },
                { label: 'Утилизационный сбор', value: result.recyclingFee },
                { label: 'ЭПТС', value: result.eptsFee },
              ].map((row) => (
                <div key={row.label} className="flex justify-between font-montserrat text-sm">
                  <span className="text-white/60">{row.label}</span>
                  <span className="text-white font-bold">{fmt(row.value)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between font-montserrat">
                <span className="text-white font-bold text-base">Итого таможенные платежи</span>
                <span className="text-primary font-bold text-xl">{fmt(result.total)}</span>
              </div>
            </div>
            <p className="text-white/30 text-xs font-montserrat">
              * Расчёт является ориентировочным. Точную стоимость уточняйте у менеджера.
            </p>
          </div>
        </div>

        </div>
      </div>
    </div>
  )
}
