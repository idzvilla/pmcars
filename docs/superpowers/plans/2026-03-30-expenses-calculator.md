# Калькулятор расходов — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full expenses calculator at `/info/kalkulyator-rashod` that shows the complete cost of importing a car from the USA to Belarus — auction fees, shipping, customs, and company service fee — with live reactive recalculation.

**Architecture:** Pure calculation logic lives in `src/lib/expenses-data.ts` (lookups) and `src/lib/expenses-calculator.ts` (orchestration), both fully tested. Static data files (JSON) are bundled in `src/data/` and imported directly. The page component wires form state to calculations via `useEffect`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, Jest (existing config), no new npm dependencies.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `scripts/convert-csv.js` | Create | One-time CSV→JSON converter (not bundled) |
| `src/data/auction-fees.json` | Create | Auction fee tiers (Copart/IAAI/BidCars) |
| `src/data/shipping-config.json` | Create | Ocean freight, port handling, inland routes |
| `src/data/us-domestic-prices.json` | Create | US domestic delivery prices (converted from CSV) |
| `src/lib/expenses-data.ts` | Create | Types + lookup functions for all data tables |
| `src/lib/expenses-calculator.ts` | Create | Orchestrator: `calculateExpenses()` |
| `__tests__/expenses-data.test.ts` | Create | Tests for lookup functions |
| `__tests__/expenses-calculator.test.ts` | Create | Tests for calculateExpenses |
| `src/components/ui/Combobox.tsx` | Create | Searchable dropdown for auction yard selection |
| `src/app/info/kalkulyator-rashod/layout.tsx` | Create | Page metadata |
| `src/app/info/kalkulyator-rashod/page.tsx` | Create | Full page: form + reactive results |
| `src/components/layout/Header.tsx` | Modify | Add "Калькулятор расходов" to `infoLinks` |
| `src/components/layout/MobileMenu.tsx` | Modify | Add to `navItems` children |
| `src/app/sitemap.ts` | Modify | Add `/info/kalkulyator-rashod` |

---

## Task 1: Prepare static data files

**Files:**
- Create: `scripts/convert-csv.js`
- Create: `src/data/auction-fees.json`
- Create: `src/data/shipping-config.json`
- Create: `src/data/us-domestic-prices.json`

- [ ] **Step 1: Create the CSV→JSON converter script**

Create `scripts/convert-csv.js`:

```javascript
// scripts/convert-csv.js
// Run with: node scripts/convert-csv.js
const fs = require('fs')
const path = require('path')

const csvPath = path.join(__dirname, '../references/extension/dist/config/us-domestic-prices.csv')
const outPath = path.join(__dirname, '../src/data/us-domestic-prices.json')

const content = fs.readFileSync(csvPath, 'utf-8')
const lines = content.split('\n').filter(line => line.trim())

// Skip 2 header rows, then parse data
const entries = lines.slice(2).map(line => {
  const cols = line.split(',')
  const location = cols[1]?.trim()
  const auction = cols[2]?.trim().toLowerCase()
  const port = cols[3]?.trim()
  const regular = parseInt(cols[4]) || 0
  const large = parseInt(cols[5]) || 0
  const oversize = parseInt(cols[6]) || 0
  if (!location || !auction || !port) return null
  return { location, auction, port, regular, large, oversize }
}).filter(Boolean)

fs.writeFileSync(outPath, JSON.stringify(entries, null, 2))
console.log(`Converted ${entries.length} entries to ${outPath}`)
```

- [ ] **Step 2: Create src/data/ directory and run converter**

```bash
mkdir -p src/data
node scripts/convert-csv.js
```

Expected output: `Converted NNN entries to .../src/data/us-domestic-prices.json`

Verify the file exists and spot-check a few entries:
```bash
head -c 500 src/data/us-domestic-prices.json
```

Expected (first entry): `{ "location": "ABILENE - Texas", "auction": "copart", "port": "Houston", "regular": 425, "large": 425, "oversize": 495 }`

- [ ] **Step 3: Copy auction-fees.json to src/data/**

```bash
cp references/extension/dist/config/auction-fees.json src/data/auction-fees.json
```

- [ ] **Step 4: Copy shipping-config to src/data/**

```bash
cp references/extension/dist/config/default.json src/data/shipping-config.json
```

- [ ] **Step 5: Commit data files**

```bash
git add src/data/ scripts/convert-csv.js
git commit -m "feat: add static data files for expenses calculator"
```

---

## Task 2: Types and lookup functions (`expenses-data.ts`)

**Files:**
- Create: `src/lib/expenses-data.ts`
- Create: `__tests__/expenses-data.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/expenses-data.test.ts`:

```typescript
import {
  getAuctionFee,
  getUSDomesticEntry,
  normalizeUSPort,
  getOceanFreight,
  getPortHandling,
  getInlandFee,
  getInsurance,
  autoSelectPort,
} from '@/lib/expenses-data'

describe('getAuctionFee', () => {
  test('copart $15000 → base $1000 + fixed $148', () => {
    expect(getAuctionFee('copart', 15000)).toBe(1148)
  })
  test('copart $999 → base $69 + fixed $148', () => {
    expect(getAuctionFee('copart', 999)).toBe(217)
  })
  test('iaai $5000 → base $890 + fixed $290', () => {
    expect(getAuctionFee('iaai', 5000)).toBe(1180)
  })
  test('iaai $10000 → base $1500 + fixed $290', () => {
    expect(getAuctionFee('iaai', 10000)).toBe(1790)
  })
  test('bidcars $1500 → base $200 + fixed $598', () => {
    expect(getAuctionFee('bidcars', 1500)).toBe(798)
  })
  test('bidcars $10000 → base $1000 + fixed $598', () => {
    expect(getAuctionFee('bidcars', 10000)).toBe(1598)
  })
})

describe('getUSDomesticEntry', () => {
  test('finds ACE - Carson - CA for copart', () => {
    const entry = getUSDomesticEntry('ACE - Carson - CA', 'copart')
    expect(entry).toBeDefined()
    expect(entry!.regular).toBe(235)
    expect(entry!.port).toBe('Los Angeles')
  })
  test('returns undefined for unknown location', () => {
    expect(getUSDomesticEntry('NONEXISTENT', 'copart')).toBeUndefined()
  })
})

describe('normalizeUSPort', () => {
  test('Los Angeles → LOS_ANGELES', () => expect(normalizeUSPort('Los Angeles')).toBe('LOS_ANGELES'))
  test('Houston → HOUSTON', () => expect(normalizeUSPort('Houston')).toBe('HOUSTON'))
  test('Sesttle (typo) → SEATTLE', () => expect(normalizeUSPort('Sesttle')).toBe('SEATTLE'))
  test('Chicago (no RORO) → NEW_YORK', () => expect(normalizeUSPort('Chicago')).toBe('NEW_YORK'))
  test('Miami (no RORO) → JACKSONVILLE', () => expect(normalizeUSPort('Miami')).toBe('JACKSONVILLE'))
})

describe('getOceanFreight', () => {
  test('LOS_ANGELES → POTI RORO', () => expect(getOceanFreight('LOS_ANGELES', 'POTI')).toBe(1550))
  test('NEW_YORK → KLAIPEDA RORO', () => expect(getOceanFreight('NEW_YORK', 'KLAIPEDA')).toBe(1100))
  test('HOUSTON → POTI RORO', () => expect(getOceanFreight('HOUSTON', 'POTI')).toBe(1500))
})

describe('getPortHandling', () => {
  test('POTI → 400', () => expect(getPortHandling('POTI')).toBe(400))
  test('KLAIPEDA → 350', () => expect(getPortHandling('KLAIPEDA')).toBe(350))
})

describe('getInlandFee', () => {
  test('POTI → MINSK runner', () => expect(getInlandFee('POTI', 'MINSK')).toBe(1200))
  test('KLAIPEDA → GOMEL runner', () => expect(getInlandFee('KLAIPEDA', 'GOMEL')).toBe(900))
  test('POTI → BREST runner', () => expect(getInlandFee('POTI', 'BREST')).toBe(1400))
})

describe('getInsurance', () => {
  test('1% of price, min $50', () => {
    expect(getInsurance(15000)).toBe(150)
    expect(getInsurance(3000)).toBe(50) // 30 < 50, use min
    expect(getInsurance(5000)).toBe(50) // exactly 50
  })
})

describe('autoSelectPort', () => {
  test('< 2.0л → KLAIPEDA', () => expect(autoSelectPort(1.6)).toBe('KLAIPEDA'))
  test('>= 2.0л → POTI', () => expect(autoSelectPort(2.0)).toBe('POTI'))
  test('3.0л → POTI', () => expect(autoSelectPort(3.0)).toBe('POTI'))
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern=expenses-data --no-coverage
```

Expected: Multiple "Cannot find module" or "is not a function" errors.

- [ ] **Step 3: Implement expenses-data.ts**

Create `src/lib/expenses-data.ts`:

```typescript
import auctionFeesRaw from '@/data/auction-fees.json'
import shippingConfigRaw from '@/data/shipping-config.json'
import usDomesticRaw from '@/data/us-domestic-prices.json'

export type AuctionType = 'copart' | 'iaai' | 'bidcars'
export type VehicleSize = 'regular' | 'large' | 'oversize'
export type FuelType = 'gas' | 'diesel' | 'hybrid' | 'electric'
export type CarAge = 'under3' | '3to5' | 'over5'
export type EUPort = 'POTI' | 'KLAIPEDA'
export type City = 'MINSK' | 'GOMEL' | 'VITEBSK' | 'MOGILEV' | 'BREST' | 'GRODNO'

export interface USDomesticEntry {
  location: string
  auction: string
  port: string
  regular: number
  large: number
  oversize: number
}

const auctionFees = auctionFeesRaw as {
  copart: { baseFee: { public: { min: number; max: number | null; fee: number }[] }; fixedFees: Record<string, number> }
  iaai: { buyerFee: { public: { min: number; max: number | null; fee: number }[] }; fixedFees: Record<string, number> }
  bidcars: { baseFee: { public: { min: number; max: number | null; fee: number }[] }; fixedFees: Record<string, number> }
}

const shippingConfig = shippingConfigRaw as {
  ocean: Record<string, { RORO: number; CONTAINER: number }>
  portHandling: Record<string, number>
  inlandToBY: Record<string, { runner: number; nonRunner: number }>
  insurance: { ratePct: number; minUSD: number }
}

const usDomesticPrices = usDomesticRaw as USDomesticEntry[]

function lookupTieredFee(tiers: { min: number; max: number | null; fee: number }[], price: number): number {
  const tier = tiers.find(t => price >= t.min && (t.max === null || price <= t.max))
  return tier?.fee ?? 0
}

export function getAuctionFee(auction: AuctionType, priceUSD: number): number {
  if (auction === 'iaai') {
    const base = lookupTieredFee(auctionFees.iaai.buyerFee.public, priceUSD)
    const fixed = Object.values(auctionFees.iaai.fixedFees).reduce((a, b) => a + b, 0)
    return base + fixed
  }
  if (auction === 'bidcars') {
    const base = lookupTieredFee(auctionFees.bidcars.baseFee.public, priceUSD)
    const fixed = Object.values(auctionFees.bidcars.fixedFees).reduce((a, b) => a + b, 0)
    return base + fixed
  }
  // copart
  const base = lookupTieredFee(auctionFees.copart.baseFee.public, priceUSD)
  const fixed = Object.values(auctionFees.copart.fixedFees).reduce((a, b) => a + b, 0)
  return base + fixed
}

export function getUSDomesticEntry(location: string, auction: AuctionType): USDomesticEntry | undefined {
  return usDomesticPrices.find(
    e => e.location === location && e.auction === auction
  )
}

const PORT_NORMALIZE: Record<string, string> = {
  'Houston': 'HOUSTON',
  'Los Angeles': 'LOS_ANGELES',
  'Long Beach': 'LONG_BEACH',
  'New York': 'NEW_YORK',
  'Savannah': 'SAVANNAH',
  'Norfolk': 'NORFOLK',
  'Baltimore': 'BALTIMORE',
  'Charleston': 'CHARLESTON',
  'Wilmington': 'WILMINGTON',
  'Mobile': 'MOBILE',
  'Gulfport': 'GULFPORT',
  'New Orleans': 'NEW_ORLEANS',
  'Seattle': 'SEATTLE',
  'Sesttle': 'SEATTLE',
  'Portland': 'PORTLAND',
  'Indianapolis': 'INDIANAPOLIS',
  'Jacksonville': 'JACKSONVILLE',
  'Chicago': 'NEW_YORK',
  'Miami': 'JACKSONVILLE',
  'Toronto': 'NEW_YORK',
}

export function normalizeUSPort(csvPort: string): string {
  return PORT_NORMALIZE[csvPort] ?? csvPort.toUpperCase().replace(/ /g, '_')
}

export function getOceanFreight(usPort: string, euPort: EUPort): number {
  const key = `${usPort}-${euPort}`
  return shippingConfig.ocean[key]?.RORO ?? 0
}

export function getPortHandling(euPort: EUPort): number {
  return shippingConfig.portHandling[euPort] ?? 0
}

export function getInlandFee(euPort: EUPort, city: City): number {
  const key = `${euPort}-${city}`
  return shippingConfig.inlandToBY[key]?.runner ?? 0
}

export function getInsurance(priceUSD: number): number {
  const { ratePct, minUSD } = shippingConfig.insurance
  return Math.max(priceUSD * ratePct / 100, minUSD)
}

export function autoSelectPort(engineLiters: number): EUPort {
  return engineLiters < 2.0 ? 'KLAIPEDA' : 'POTI'
}

export function getLocationsForAuction(auction: AuctionType): string[] {
  return usDomesticPrices
    .filter(e => e.auction === auction)
    .map(e => e.location)
}
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npm test -- --testPathPattern=expenses-data --no-coverage
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/expenses-data.ts __tests__/expenses-data.test.ts
git commit -m "feat: add expenses data types and lookup functions"
```

---

## Task 3: Expenses calculator orchestrator

**Files:**
- Create: `src/lib/expenses-calculator.ts`
- Create: `__tests__/expenses-calculator.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/expenses-calculator.test.ts`:

```typescript
import { calculateExpenses, type ExpensesInput, type ExpensesResult } from '@/lib/expenses-calculator'

const BASE_INPUT: ExpensesInput = {
  auction: 'copart',
  location: 'ACE - Carson - CA',
  priceUSD: 10000,
  engineLiters: 2.0,
  carAge: 'under3',
  vehicleSize: 'regular',
  fuelType: 'gas',
  city: 'MINSK',
  euPort: 'POTI',
  decree140: false,
  usdRate: 3.0,
  eurRate: 3.3,
}

describe('calculateExpenses', () => {
  test('returns all required fields', () => {
    const result = calculateExpenses(BASE_INPUT)
    const fields: (keyof ExpensesResult)[] = [
      'carPriceUSD', 'auctionFeeUSD', 'usDomesticUSD', 'oceanFreightUSD',
      'insuranceUSD', 'portHandlingUSD', 'inlandUSD',
      'ourServicesBYN', 'dutyEUR', 'customsFeeBYN', 'utilFeeBYN', 'svxBYN',
      'totalUSD',
    ]
    fields.forEach(f => expect(result).toHaveProperty(f))
  })

  test('carPriceUSD equals input price', () => {
    expect(calculateExpenses(BASE_INPUT).carPriceUSD).toBe(10000)
  })

  test('auctionFeeUSD for copart $10000 = 1148', () => {
    // baseFee 10000+ = $1000, fixed = $59+$79+$10 = $148
    expect(calculateExpenses(BASE_INPUT).auctionFeeUSD).toBe(1148)
  })

  test('usDomesticUSD for ACE Carson CA regular = 235', () => {
    expect(calculateExpenses(BASE_INPUT).usDomesticUSD).toBe(235)
  })

  test('oceanFreightUSD for LOS_ANGELES-POTI RORO = 1550', () => {
    expect(calculateExpenses(BASE_INPUT).oceanFreightUSD).toBe(1550)
  })

  test('portHandlingUSD for POTI = 400', () => {
    expect(calculateExpenses(BASE_INPUT).portHandlingUSD).toBe(400)
  })

  test('inlandUSD for POTI-MINSK runner = 1200', () => {
    expect(calculateExpenses(BASE_INPUT).inlandUSD).toBe(1200)
  })

  test('insuranceUSD = 1% of price, min 50', () => {
    expect(calculateExpenses(BASE_INPUT).insuranceUSD).toBe(100) // 1% of 10000
  })

  test('ourServicesBYN = 1000', () => {
    expect(calculateExpenses(BASE_INPUT).ourServicesBYN).toBe(1000)
  })

  test('customsFeeBYN = 120', () => {
    expect(calculateExpenses(BASE_INPUT).customsFeeBYN).toBe(120)
  })

  test('utilFeeBYN = 544 for under3 car', () => {
    expect(calculateExpenses(BASE_INPUT).utilFeeBYN).toBe(544)
  })

  test('utilFeeBYN = 1089 for car over 3 years', () => {
    const result = calculateExpenses({ ...BASE_INPUT, carAge: 'over5' })
    expect(result.utilFeeBYN).toBe(1089)
  })

  test('svxBYN = 650', () => {
    expect(calculateExpenses(BASE_INPUT).svxBYN).toBe(650)
  })

  test('decree140 halves the duty', () => {
    const without = calculateExpenses(BASE_INPUT)
    const with140 = calculateExpenses({ ...BASE_INPUT, decree140: true })
    expect(with140.dutyEUR).toBeCloseTo(without.dutyEUR / 2, 1)
  })

  test('electric car has zero duty', () => {
    const result = calculateExpenses({ ...BASE_INPUT, fuelType: 'electric' })
    expect(result.dutyEUR).toBe(0)
  })

  test('totalUSD is a positive number', () => {
    const result = calculateExpenses(BASE_INPUT)
    expect(result.totalUSD).toBeGreaterThan(BASE_INPUT.priceUSD)
  })

  test('totalUSD accounts for all components', () => {
    const r = calculateExpenses(BASE_INPUT)
    const usdRate = BASE_INPUT.usdRate
    const eurRate = BASE_INPUT.eurRate
    const expected =
      r.carPriceUSD +
      r.auctionFeeUSD +
      r.usDomesticUSD +
      r.oceanFreightUSD +
      r.insuranceUSD +
      r.portHandlingUSD +
      r.inlandUSD +
      r.ourServicesBYN / usdRate +
      r.dutyEUR * eurRate / usdRate +
      (r.customsFeeBYN + r.utilFeeBYN + r.svxBYN) / usdRate
    expect(r.totalUSD).toBeCloseTo(expected, 2)
  })

  test('returns zeros when location is empty', () => {
    const result = calculateExpenses({ ...BASE_INPUT, location: '' })
    expect(result.usDomesticUSD).toBe(0)
    expect(result.oceanFreightUSD).toBe(0)
  })
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test -- --testPathPattern=expenses-calculator --no-coverage
```

Expected: "Cannot find module '@/lib/expenses-calculator'"

- [ ] **Step 3: Implement expenses-calculator.ts**

Create `src/lib/expenses-calculator.ts`:

```typescript
import {
  getAuctionFee,
  getUSDomesticEntry,
  normalizeUSPort,
  getOceanFreight,
  getPortHandling,
  getInlandFee,
  getInsurance,
  type AuctionType,
  type VehicleSize,
  type FuelType,
  type CarAge,
  type EUPort,
  type City,
} from '@/lib/expenses-data'
import { calculateTotal } from '@/lib/calculator'

const OUR_SERVICES_BYN = 1000
const CUSTOMS_FEE_BYN = 120
const SVX_BYN = 650
const RECYCLING_FEE_UNDER3_BYN = 544
const RECYCLING_FEE_OVER3_BYN = 1089

export interface ExpensesInput {
  auction: AuctionType
  location: string
  priceUSD: number
  engineLiters: number
  carAge: CarAge
  vehicleSize: VehicleSize
  fuelType: FuelType
  city: City
  euPort: EUPort
  decree140: boolean
  usdRate: number   // BYN per 1 USD (from NBRB)
  eurRate: number   // BYN per 1 EUR (from NBRB)
}

export interface ExpensesResult {
  carPriceUSD: number
  auctionFeeUSD: number
  usDomesticUSD: number
  oceanFreightUSD: number
  insuranceUSD: number
  portHandlingUSD: number
  inlandUSD: number
  ourServicesBYN: number
  dutyEUR: number
  customsFeeBYN: number
  utilFeeBYN: number
  svxBYN: number
  totalUSD: number
}

export function calculateExpenses(input: ExpensesInput): ExpensesResult {
  const {
    auction, location, priceUSD, engineLiters, carAge,
    vehicleSize, fuelType, city, euPort, decree140, usdRate, eurRate,
  } = input

  // Аукцион
  const auctionFeeUSD = getAuctionFee(auction, priceUSD)

  // Доставка по США
  const entry = location ? getUSDomesticEntry(location, auction) : undefined
  const usDomesticUSD = entry ? entry[vehicleSize] : 0
  const usPortNormalized = entry ? normalizeUSPort(entry.port) : ''

  // Фрахт и доставка
  const oceanFreightUSD = usPortNormalized ? getOceanFreight(usPortNormalized, euPort) : 0
  const insuranceUSD = getInsurance(priceUSD)
  const portHandlingUSD = getPortHandling(euPort)
  const inlandUSD = getInlandFee(euPort, city)

  // Таможня: пересчитываем цену в EUR для calculateTotal
  const carCostEUR = usdRate > 0 && eurRate > 0 ? priceUSD * usdRate / eurRate : 0
  const engineVolumeCC = Math.round(engineLiters * 1000)
  const engineType = fuelType === 'electric' ? 'electric' : 'ice'
  const customsResult = calculateTotal({
    carCost: carCostEUR,
    engineVolume: engineVolumeCC,
    carType: 'auto',
    engineType,
    carAge,
    decree140,
    eurRate,
  })
  const dutyEUR = customsResult.duty

  // Сборы в BYN (фиксированные)
  const utilFeeBYN = carAge === 'under3' ? RECYCLING_FEE_UNDER3_BYN : RECYCLING_FEE_OVER3_BYN

  // Итого в USD
  const totalUSD =
    priceUSD +
    auctionFeeUSD +
    usDomesticUSD +
    oceanFreightUSD +
    insuranceUSD +
    portHandlingUSD +
    inlandUSD +
    OUR_SERVICES_BYN / usdRate +
    dutyEUR * eurRate / usdRate +
    (CUSTOMS_FEE_BYN + utilFeeBYN + SVX_BYN) / usdRate

  return {
    carPriceUSD: priceUSD,
    auctionFeeUSD,
    usDomesticUSD,
    oceanFreightUSD,
    insuranceUSD,
    portHandlingUSD,
    inlandUSD,
    ourServicesBYN: OUR_SERVICES_BYN,
    dutyEUR,
    customsFeeBYN: CUSTOMS_FEE_BYN,
    utilFeeBYN,
    svxBYN: SVX_BYN,
    totalUSD: usdRate > 0 ? totalUSD : 0,
  }
}
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npm test -- --testPathPattern=expenses-calculator --no-coverage
```

Expected: All tests PASS.

- [ ] **Step 5: Run full test suite to confirm no regressions**

```bash
npm test --no-coverage
```

Expected: All existing tests still pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/expenses-calculator.ts __tests__/expenses-calculator.test.ts
git commit -m "feat: add expenses calculator orchestrator with tests"
```

---

## Task 4: Combobox component

**Files:**
- Create: `src/components/ui/Combobox.tsx`

No TDD here — UI component tested manually. Functionality: searchable dropdown with filtering, keyboard dismiss, click-outside close.

- [ ] **Step 1: Create Combobox.tsx**

Create `src/components/ui/Combobox.tsx`:

```tsx
'use client'
import { useState, useRef, useEffect } from 'react'

interface ComboboxProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function Combobox({ options, value, onChange, placeholder = 'Выберите...', className = '' }: ComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync display text with selected value
  useEffect(() => {
    if (!open) setQuery(value)
  }, [value, open])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery(value)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [value])

  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase())).slice(0, 50)
    : options.slice(0, 50)

  function handleSelect(option: string) {
    onChange(option)
    setQuery(option)
    setOpen(false)
  }

  const inputBase = `w-full px-4 py-3 rounded-lg border font-montserrat text-sm focus:outline-none bg-white ${className}`

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={open ? query : value}
        placeholder={placeholder}
        className={`${inputBase} ${open ? 'border-primary' : 'border-gray-200'}`}
        onFocus={() => { setOpen(true); setQuery('') }}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setQuery(value) } }}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.map(option => (
            <li key={option}>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm font-montserrat hover:bg-light-bg transition-colors"
                onMouseDown={() => handleSelect(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm font-montserrat text-muted">
          Не найдено
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Combobox.tsx
git commit -m "feat: add Combobox searchable dropdown component"
```

---

## Task 5: Page layout and metadata

**Files:**
- Create: `src/app/info/kalkulyator-rashod/layout.tsx`

- [ ] **Step 1: Create layout**

```bash
mkdir -p src/app/info/kalkulyator-rashod
```

Create `src/app/info/kalkulyator-rashod/layout.tsx`:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Калькулятор расходов',
  description: 'Рассчитайте полную стоимость покупки и доставки автомобиля из США в Беларусь: аукцион, доставка, таможня.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/info/kalkulyator-rashod/layout.tsx
git commit -m "feat: add expenses calculator page layout and metadata"
```

---

## Task 6: Build page with form and reactive results

**Files:**
- Create: `src/app/info/kalkulyator-rashod/page.tsx`

- [ ] **Step 1: Create page.tsx**

Create `src/app/info/kalkulyator-rashod/page.tsx`:

```tsx
'use client'
import { useState, useEffect } from 'react'
import { calculateExpenses, type ExpensesInput, type ExpensesResult } from '@/lib/expenses-calculator'
import { autoSelectPort, getLocationsForAuction, type AuctionType, type VehicleSize, type FuelType, type CarAge, type EUPort, type City } from '@/lib/expenses-data'
import Combobox from '@/components/ui/Combobox'

const USD_RATE_FALLBACK = 3.0
const EUR_RATE_FALLBACK = 3.38

function fmtUSD(n: number) {
  return new Intl.NumberFormat('ru-BY', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}
function fmtEUR(n: number) {
  return new Intl.NumberFormat('ru-BY', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
function fmtBYN(n: number) {
  return new Intl.NumberFormat('ru-BY', { style: 'currency', currency: 'BYN', maximumFractionDigits: 0 }).format(n)
}

const ZERO_RESULT: ExpensesResult = {
  carPriceUSD: 0, auctionFeeUSD: 0, usDomesticUSD: 0, oceanFreightUSD: 0,
  insuranceUSD: 0, portHandlingUSD: 0, inlandUSD: 0, ourServicesBYN: 0,
  dutyEUR: 0, customsFeeBYN: 0, utilFeeBYN: 0, svxBYN: 0, totalUSD: 0,
}

const sel = 'w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary bg-white'
const inp = 'w-full px-4 py-3 rounded-lg border border-gray-200 font-montserrat text-sm focus:outline-none focus:border-primary'

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

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-6xl">
        <h1 className="font-muller font-bold text-4xl text-body mb-2">Калькулятор расходов</h1>
        <p className="text-muted font-montserrat mb-2">
          Полная стоимость авто из США под ключ: аукцион, доставка, таможня
        </p>
        <p className="text-xs text-muted font-montserrat mb-10">
          USD: {usdRate.toFixed(4)} BYN · EUR: {eurRate.toFixed(4)} BYN (НБРБ)
        </p>

        <div className="lg:grid lg:grid-cols-[1fr_440px] lg:gap-8 lg:items-start">

          {/* ===== FORM ===== */}
          <div className="space-y-6 mb-8 lg:mb-0">

            {/* Аукцион */}
            <div className="bg-light-bg rounded-2xl p-6 space-y-5">
              <h2 className="font-muller font-bold text-lg text-body">Аукцион</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Аукцион</label>
                  <select className={sel} value={auction}
                    onChange={e => setAuction(e.target.value as AuctionType)}>
                    <option value="copart">Copart</option>
                    <option value="iaai">IAAI</option>
                    <option value="bidcars">BidCars</option>
                  </select>
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
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Возраст авто</label>
                  <select className={sel} value={carAge}
                    onChange={e => setCarAge(e.target.value as CarAge)}>
                    <option value="under3">До 3 лет</option>
                    <option value="3to5">От 3 до 5 лет</option>
                    <option value="over5">Старше 5 лет</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Доставка */}
            <div className="bg-light-bg rounded-2xl p-6 space-y-5">
              <h2 className="font-muller font-bold text-lg text-body">Доставка</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Размер ТС</label>
                  <select className={sel} value={vehicleSize}
                    onChange={e => setVehicleSize(e.target.value as VehicleSize)}>
                    <option value="regular">Обычный</option>
                    <option value="large">Крупный</option>
                    <option value="oversize">Oversized</option>
                  </select>
                </div>
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Город доставки</label>
                  <select className={sel} value={city}
                    onChange={e => setCity(e.target.value as City)}>
                    <option value="MINSK">Минск</option>
                    <option value="GOMEL">Гомель</option>
                    <option value="VITEBSK">Витебск</option>
                    <option value="MOGILEV">Могилёв</option>
                    <option value="BREST">Брест</option>
                    <option value="GRODNO">Гродно</option>
                  </select>
                </div>
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">
                    Порт назначения
                    {!portManual && engineLiters > 0 && (
                      <span className="text-muted font-normal ml-1">(авто)</span>
                    )}
                  </label>
                  <select className={sel} value={euPort}
                    onChange={e => { setEuPort(e.target.value as EUPort); setPortManual(true) }}>
                    <option value="POTI">Поти (Грузия)</option>
                    <option value="KLAIPEDA">Клайпеда (Литва)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Растаможка */}
            <div className="bg-light-bg rounded-2xl p-6 space-y-5">
              <h2 className="font-muller font-bold text-lg text-body">Растаможка</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat font-bold text-sm text-body mb-1">Тип топлива</label>
                  <select className={sel} value={fuelType}
                    onChange={e => setFuelType(e.target.value as FuelType)}>
                    <option value="gas">Бензин</option>
                    <option value="diesel">Дизель</option>
                    <option value="hybrid">Гибрид</option>
                    <option value="electric">Электро</option>
                  </select>
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
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the dev server compiles the page**

```bash
npm run dev
```

Open `http://localhost:3000/info/kalkulyator-rashod` in browser.
Expected: Page renders with form and results panel. Fill in values and confirm results update live.

- [ ] **Step 3: Commit**

```bash
git add src/app/info/kalkulyator-rashod/page.tsx
git commit -m "feat: add expenses calculator page with reactive form and results"
```

---

## Task 7: Update navigation and sitemap

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/MobileMenu.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add to Header infoLinks**

In `src/components/layout/Header.tsx`, find:

```typescript
const infoLinks: { label: string; href: string }[] = [
  { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
```

Replace with:

```typescript
const infoLinks: { label: string; href: string }[] = [
  { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
  { label: 'Калькулятор расходов', href: '/info/kalkulyator-rashod' },
```

- [ ] **Step 2: Add to MobileMenu navItems**

In `src/components/layout/MobileMenu.tsx`, find:

```typescript
      { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
```

Replace with:

```typescript
      { label: 'Таможенный калькулятор', href: '/info/kalkulyator' },
      { label: 'Калькулятор расходов', href: '/info/kalkulyator-rashod' },
```

- [ ] **Step 3: Add to sitemap**

In `src/app/sitemap.ts`, find:

```typescript
    '/info/kalkulyator',
```

Replace with:

```typescript
    '/info/kalkulyator',
    '/info/kalkulyator-rashod',
```

- [ ] **Step 4: Run full test suite and build check**

```bash
npm test --no-coverage && npm run build
```

Expected: All tests pass, build succeeds with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/MobileMenu.tsx src/app/sitemap.ts
git commit -m "feat: add expenses calculator to navigation and sitemap"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Separate page `/info/kalkulyator-rashod` — Task 5
- ✅ Auction section (auction, yard combobox, price, engine, age) — Task 6
- ✅ Delivery section (vehicle size, city, port with auto-detect) — Task 6
- ✅ Customs section (fuel type, decree140) — Task 6
- ✅ USD + EUR rates from NBRB — Task 6
- ✅ Results: 4 blocks with line-by-line breakdown — Task 6
- ✅ Our services 1000 BYN — Task 3 constant
- ✅ SVX 650 BYN — Task 3 constant
- ✅ Reactive recalculation, no button — Task 6 `useEffect`
- ✅ Combobox for 600+ locations filtered by auction — Task 4, Task 6
- ✅ Port auto-selects based on engine volume — Task 2 `autoSelectPort`, Task 6
- ✅ Runner tariff for inland — Task 2 `getInlandFee` uses `.runner`
- ✅ Reuses existing `calculateTotal()` for customs duty — Task 3
- ✅ Navigation updated (Header + MobileMenu) — Task 7
- ✅ Sitemap updated — Task 7
- ✅ Pure functions tested — Tasks 2, 3
