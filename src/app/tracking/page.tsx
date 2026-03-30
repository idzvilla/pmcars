// src/app/tracking/page.tsx
'use client'
import { useState } from 'react'
import { isValidVin, TrackingResult as TrackingResultType } from '@/lib/tracking'
import TrackingResult from '@/components/tracking/TrackingResult'
import Button from '@/components/ui/Button'
import { SearchX, AlertCircle } from 'lucide-react'

export default function TrackingPage() {
  const [vin, setVin] = useState('')
  const [vinError, setVinError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackingResultType | null>(null)

  const inputCls = `w-full bg-white px-4 py-3 rounded-lg border font-montserrat text-sm focus:outline-none
    ${vinError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary'}`

  function validateVin(value: string): boolean {
    if (!value.trim()) { setVinError('Введите VIN'); return false }
    if (!isValidVin(value)) { setVinError('VIN должен содержать 17 символов (латиница + цифры, без I, O, Q)'); return false }
    setVinError('')
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateVin(vin)) return

    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/track?vin=${encodeURIComponent(vin.trim().toUpperCase())}`)
      const data: TrackingResultType = await res.json()
      setResult(data)
    } catch {
      setResult({ success: false, error: 'unavailable' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Отслеживание авто
        </h1>
        <p className="text-muted font-montserrat text-lg mb-10">
          Введите VIN чтобы узнать статус доставки вашего автомобиля
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-light-bg rounded-2xl p-8 mb-8">
          <label className="block font-montserrat font-bold text-sm text-body mb-2">
            VIN номер
          </label>
          <input
            type="text"
            value={vin}
            onChange={(e) => { setVin(e.target.value.toUpperCase()); setVinError('') }}
            placeholder="Например: 1HGBH41JXMN109186"
            maxLength={17}
            className={inputCls}
          />
          {vinError && (
            <p className="text-red-500 font-montserrat text-xs mt-1">{vinError}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Поиск...
              </span>
            ) : 'Отследить'}
          </Button>
        </form>

        {/* Result */}
        {result && result.success && (
          <TrackingResult data={result.data} />
        )}

        {/* Errors */}
        {result && !result.success && (
          <div className="border border-gray-200 rounded-2xl p-10 text-center bg-light-bg">
            <div className="flex justify-center mb-4">
              {result.error === 'not_found'
                ? <SearchX className="w-12 h-12 text-muted" />
                : <AlertCircle className="w-12 h-12 text-muted" />}
            </div>
            <p className="text-body font-montserrat font-bold text-lg mb-2">
              {result.error === 'not_found'
                ? 'Авто не найдено'
                : 'Сервис недоступен'}
            </p>
            <p className="text-muted font-montserrat text-sm mb-8">
              {result.error === 'not_found'
                ? 'Проверьте правильность VIN или свяжитесь с менеджером — мы поможем найти ваш автомобиль'
                : 'Попробуйте через несколько минут или свяжитесь с менеджером'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#2AABEE] text-white rounded-lg font-montserrat font-bold text-sm">
                Telegram
              </a>
              <a href="https://wa.me/375296363636" target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#25D366] text-white rounded-lg font-montserrat font-bold text-sm">
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
