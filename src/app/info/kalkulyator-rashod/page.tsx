'use client'
import { useState, useEffect } from 'react'
import { calculateExpenses, type ExpensesInput, type ExpensesResult } from '@/lib/expenses-calculator'
import { autoSelectPort, getLocationsForAuction, type AuctionType, type VehicleSize, type FuelType, type CarAge, type EUPort, type City } from '@/lib/expenses-data'
import Combobox from '@/components/ui/Combobox'
import { ChevronDown, Copy, Check } from 'lucide-react'

const USD_RATE_FALLBACK = 3.0
const EUR_RATE_FALLBACK = 3.38

function fmtUSD(n: number) {
  return new Intl.NumberFormat('ru-BY', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}
function fmtEUR(n: number) {
  return new Intl.NumberFormat('ru-BY', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
function fmtBYN(n: number) {
  return new Intl.NumberFormat('ru-BY', { maximumFractionDigits: 0 }).format(n) + ' BYN'
}

const ZERO_RESULT: ExpensesResult = {
  carPriceUSD: 0, auctionFeeUSD: 0, usDomesticUSD: 0, oceanFreightUSD: 0,
  insuranceUSD: 0, portHandlingUSD: 0, inlandUSD: 0, ourServicesBYN: 0,
  dutyEUR: 0, customsFeeBYN: 0, utilFeeBYN: 0, svxBYN: 0, totalUSD: 0,
}

const sel = 'w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary bg-white appearance-none'
const inp = 'w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary bg-white'

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between font-montserrat text-sm">
    <span className="text-white/60">{label}</span>
    <span className="text-white font-bold">{value}</span>
  </div>
)

const ResultBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="font-muller font-bold text-base text-white mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
)

export default function KalkulyatorRashodPage() {
  const [usdRate, setUsdRate] = useState(USD_RATE_FALLBACK)
  const [eurRate, setEurRate] = useState(EUR_RATE_FALLBACK)
  const [auction, setAuction] = useState<AuctionType>('copart')
  const [location, setLocation] = useState('')
  const [priceUSD, setPriceUSD] = useState(0)
  const [engineLiters, setEngineLiters] = useState(0)
  const [carAge, setCarAge] = useState<CarAge>('over5')
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>('regular')
  const [fuelType, setFuelType] = useState<FuelType>('gas')
  const [city, setCity] = useState<City>('MINSK')
  const [euPort, setEuPort] = useState<EUPort>('POTI')
  const [portManual, setPortManual] = useState(false)
  const [decree140, setDecree140] = useState(false)
  const [result, setResult] = useState<ExpensesResult>(ZERO_RESULT)
  const [copied, setCopied] = useState(false)

  const AGE_LABEL: Record<CarAge, string> = { under3: 'до 3 лет', '3to5': '3–5 лет', over5: 'старше 5 лет' }
  const FUEL_LABEL: Record<FuelType, string> = { gas: 'Бензин', diesel: 'Дизель', hybrid: 'Гибрид', electric: 'Электро' }
  const SIZE_LABEL: Record<VehicleSize, string> = { regular: 'Легковой автомобиль', large: 'Крупный', oversize: 'Oversized' }
  const CITY_LABEL: Record<City, string> = { MINSK: 'Минск', GOMEL: 'Гомель', VITEBSK: 'Витебск', MOGILEV: 'Могилёв', BREST: 'Брест', GRODNO: 'Гродно' }
  const PORT_LABEL: Record<EUPort, string> = { POTI: 'Поти', KLAIPEDA: 'Клайпеда' }
  const AUCTION_LABEL: Record<AuctionType, string> = { copart: 'Copart', iaai: 'IAAI', bidcars: 'BidCars' }

  function buildShareText() {
    const auctionTotal = result.carPriceUSD + result.auctionFeeUSD
    const deliveryTotal = result.usDomesticUSD + result.oceanFreightUSD + result.insuranceUSD + result.portHandlingUSD + result.inlandUSD
    const servicesUSD = result.ourServicesBYN / usdRate
    const customsUSD = result.totalUSD - auctionTotal - deliveryTotal - servicesUSD
    const totalBYN = Math.round(result.totalUSD * usdRate)
    const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU')
    return [
      '📊 Расчёт PM Cars',
      '',
      `🚗 ${SIZE_LABEL[vehicleSize]}, ${FUEL_LABEL[fuelType]}, ${AGE_LABEL[carAge]}, ${fmt(priceUSD)}$, ${engineLiters}л`,
      `🔨 ${AUCTION_LABEL[auction]}${location ? ' / ' + location : ''}`,
      '',
      `🗺️ США → ${CITY_LABEL[city]} (${PORT_LABEL[euPort]})`,
      '',
      `💰 Аукцион: ${fmt(auctionTotal)}$`,
      `🚢 Доставка: ${fmt(deliveryTotal)}$`,
      `🛃 Растаможка: ${fmt(customsUSD)}$`,
      `🤝 Услуги: ${fmt(servicesUSD)}$`,
      '',
      `✅ ИТОГО: ${fmt(result.totalUSD)}$ (${fmt(totalBYN)} BYN)`,
    ].join('\n')
  }

  function handleShare() {
    if (result.totalUSD === 0) return
    navigator.clipboard.writeText(buildShareText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Fetch exchange rates
  useEffect(() => {
    fetch('https://api.nbrb.by/exrates/rates/145')
      .then(r => r.json())
      .then(d => { if (d?.Cur_OfficialRate) setUsdRate(d.Cur_OfficialRate) })
      .catch(() => {})
    fetch('https://api.nbrb.by/exrates/rates/451')
      .then(r => r.json())
      .then(d => { if (d?.Cur_OfficialRate) setEurRate(d.Cur_OfficialRate) })
      .catch(() => {})
  }, [])

  // Auto-select port based on engine volume
  useEffect(() => {
    if (!portManual && engineLiters > 0) {
      setEuPort(autoSelectPort(engineLiters))
    }
  }, [engineLiters, portManual])

  // Reset location when auction changes
  useEffect(() => {
    setLocation('')
  }, [auction])

  // Recalculate on any input change
  useEffect(() => {
    const input: ExpensesInput = {
      auction, location, priceUSD, engineLiters, carAge,
      vehicleSize, fuelType, city, euPort, decree140, usdRate, eurRate,
    }
    if (priceUSD > 0 && engineLiters > 0) {
      setResult(calculateExpenses(input))
    } else {
      setResult(ZERO_RESULT)
    }
  }, [auction, location, priceUSD, engineLiters, carAge, vehicleSize, fuelType, city, euPort, decree140, usdRate, eurRate])

  const locations = getLocationsForAuction(auction)

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">Калькулятор расходов</h1>
        <p className="text-muted font-montserrat text-lg mb-4 max-w-2xl">
          Полная стоимость авто из США под ключ: аукцион, доставка, таможня
        </p>
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-light-bg border border-gray-200 font-montserrat text-sm text-body">
            🇺🇸 <span className="font-bold">USD</span> {usdRate.toFixed(4)} BYN
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-light-bg border border-gray-200 font-montserrat text-sm text-body">
            🇪🇺 <span className="font-bold">EUR</span> {eurRate.toFixed(4)} BYN
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_440px] lg:gap-8 lg:items-start">

          {/* ===== FORM ===== */}
          <div className="space-y-6 mb-8 lg:mb-0">

            {/* Аукцион */}
            <div className="bg-light-bg rounded-2xl p-6 space-y-5">
              <h2 className="font-muller font-bold text-lg text-body">Аукцион</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Аукцион</label>
                  <div className="relative">
                    <select className={sel} value={auction}
                      onChange={e => setAuction(e.target.value as AuctionType)}>
                      <option value="copart">Copart</option>
                      <option value="iaai">IAAI</option>
                      <option value="bidcars">BidCars</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Площадка</label>
                  <Combobox
                    options={locations}
                    value={location}
                    onChange={setLocation}
                    placeholder="Введите название..."
                    className="focus:border-primary border-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Возраст авто</label>
                  <div className="relative">
                    <select className={sel} value={carAge}
                      onChange={e => setCarAge(e.target.value as CarAge)}>
                      <option value="under3">До 3 лет</option>
                      <option value="3to5">От 3 до 5 лет</option>
                      <option value="over5">Старше 5 лет</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Стоимость авто (USD)</label>
                  <input type="number" min={0} placeholder="15000" className={inp}
                    value={priceUSD || ''}
                    onChange={e => setPriceUSD(+e.target.value)} />
                </div>
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Объём двигателя (л)</label>
                  <input type="number" min={0} step={0.1} placeholder="2.0" className={inp}
                    value={engineLiters || ''}
                    onChange={e => setEngineLiters(+e.target.value)} />
                </div>
              </div>
            </div>

            {/* Доставка */}
            <div className="bg-light-bg rounded-2xl p-6 space-y-5">
              <h2 className="font-muller font-bold text-lg text-body">Доставка</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Город доставки</label>
                  <div className="relative">
                    <select className={sel} value={city}
                      onChange={e => setCity(e.target.value as City)}>
                      <option value="MINSK">Минск</option>
                      <option value="GOMEL">Гомель</option>
                      <option value="VITEBSK">Витебск</option>
                      <option value="MOGILEV">Могилёв</option>
                      <option value="BREST">Брест</option>
                      <option value="GRODNO">Гродно</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">
                    Порт назначения
                    {!portManual && engineLiters > 0 && (
                      <span className="text-muted font-normal ml-1">(авто)</span>
                    )}
                  </label>
                  <div className="relative">
                    <select className={sel} value={euPort}
                      onChange={e => { setEuPort(e.target.value as EUPort); setPortManual(true) }}>
                      <option value="POTI">Поти (Грузия)</option>
                      <option value="KLAIPEDA">Клайпеда (Литва)</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Размер ТС</label>
                  <div className="relative">
                    <select className={sel} value={vehicleSize}
                      onChange={e => setVehicleSize(e.target.value as VehicleSize)}>
                      <option value="regular">Обычный</option>
                      <option value="large">Крупный</option>
                      <option value="oversize">Oversized</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>
              </div>
            </div>

            {/* Растаможка */}
            <div className="bg-light-bg rounded-2xl p-6 space-y-5">
              <h2 className="font-muller font-bold text-lg text-body">Растаможка</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Тип топлива</label>
                  <div className="relative">
                    <select className={sel} value={fuelType}
                      onChange={e => setFuelType(e.target.value as FuelType)}>
                      <option value="gas">Бензин</option>
                      <option value="diesel">Дизель</option>
                      <option value="hybrid">Гибрид</option>
                      <option value="electric">Электро</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary"
                  checked={decree140}
                  onChange={e => setDecree140(e.target.checked)} />
                <span className="font-montserrat text-sm text-body">Льготная растаможка (Указ №140)</span>
              </label>
            </div>
          </div>

          {/* ===== RESULTS ===== */}
          <div className="sticky top-24">
            <div className="bg-dark-bg rounded-2xl p-8 text-white space-y-5">

              <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                <span className="font-muller font-bold text-lg">Итого всех затрат</span>
                <span className="font-muller font-bold text-2xl text-primary">{fmtUSD(result.totalUSD)}</span>
              </div>

              <ResultBlock title="Расходы на аукционе">
                <ResultRow label="Стоимость авто" value={fmtUSD(result.carPriceUSD)} />
                <ResultRow label="Аукционный сбор" value={fmtUSD(result.auctionFeeUSD)} />
              </ResultBlock>

              <ResultBlock title="Расходы на доставке">
                <ResultRow label="Доставка по США до порта" value={fmtUSD(result.usDomesticUSD)} />
                <ResultRow label="Фрахт (океан)" value={fmtUSD(result.oceanFreightUSD)} />
                <ResultRow label="Страховка" value={fmtUSD(result.insuranceUSD)} />
                <ResultRow label="Портовый сбор" value={fmtUSD(result.portHandlingUSD)} />
                <ResultRow label="Доставка до города" value={fmtUSD(result.inlandUSD)} />
              </ResultBlock>

              <ResultBlock title="Наши услуги">
                <ResultRow label="Услуги компании" value={fmtBYN(result.ourServicesBYN)} />
              </ResultBlock>

              <ResultBlock title="Расходы на растаможку">
                <ResultRow label="Таможенная пошлина" value={fmtEUR(result.dutyEUR)} />
                <ResultRow label="Таможенный сбор" value={fmtBYN(result.customsFeeBYN)} />
                <ResultRow label="Утилизационный сбор" value={fmtBYN(result.utilFeeBYN)} />
                <ResultRow label="Расходы на СВХ" value={fmtBYN(result.svxBYN)} />
              </ResultBlock>

              <p className="text-white/30 text-xs font-montserrat pt-2">
                * Расчёт является ориентировочным. Точную стоимость уточняйте у менеджера.
              </p>

              <button
                onClick={handleShare}
                disabled={result.totalUSD === 0}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-montserrat font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white/8 hover:bg-white/12 text-white/70 hover:text-white"
              >
                {copied ? <Check size={15} strokeWidth={2.5} /> : <Copy size={15} />}
                {copied ? 'Скопировано!' : 'Поделиться расчётом'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
