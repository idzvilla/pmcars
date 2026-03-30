# Native Vehicle Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stub `/tracking` page with a fully native tracking UI that fetches and parses Atlantic Express Corp data by VIN.

**Architecture:** A Next.js API route at `/api/track` fetches `https://client.atlanticexpresscorp.com/order/{VIN}/track` server-side, parses the HTML with cheerio, and returns structured JSON. The client page calls this API and renders the result using pmcars.by design tokens.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, cheerio (new), Lucide React

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/tracking.ts` | Create | Types + VIN validation + HTML parser |
| `src/app/api/track/route.ts` | Create | API route: fetch AEC + call parser |
| `src/components/tracking/TrackingTimeline.tsx` | Create | Horizontal stage progress bar |
| `src/components/tracking/TrackingPhotos.tsx` | Create | Photo category grid + lightbox |
| `src/components/tracking/TrackingResult.tsx` | Create | Full result layout (hero + timeline + cards + photos) |
| `src/app/tracking/page.tsx` | Modify | Replace stub with `"use client"` form + API call |
| `next.config.mjs` | Modify | Allow AEC image domains |
| `__tests__/tracking.test.ts` | Create | Unit tests for VIN validation + parser |

---

## Task 1: Discovery — verify AEC renders data server-side

Before writing any parser, confirm the HTML contains actual data (not a JS-only SPA shell).

**Files:**
- No files created — this is an investigation step

- [ ] **Step 1: Fetch the AEC tracking page and inspect the HTML**

Run this in terminal (use a real VIN, e.g. the one from the screenshots):

```bash
curl -s "https://client.atlanticexpresscorp.com/order/7SAYGAEE4RF115761/track" | head -200
```

- [ ] **Step 2: Check if data is present in the HTML**

Look for text like "TESLA", "MAERSK", "POTI", or "7SAYGAEE4RF115761" in the output.

**If data IS present** → cheerio parsing will work, proceed to Task 2.

**If data is NOT present** (you see mostly empty `<div>` tags and `<script>` tags) → the page is a client-side SPA. In that case:

```bash
# Find the API endpoint the page calls for its data
curl -s "https://client.atlanticexpresscorp.com/order/7SAYGAEE4RF115761/track" | grep -o '"https://[^"]*api[^"]*"' | head -20
```

Then open the AEC URL in Chrome DevTools → Network tab → filter XHR/Fetch → find the JSON API call that returns the order data. Use that API endpoint in Task 3 instead of parsing HTML.

> **Note for plan executor:** If you discover a JSON API endpoint, skip Task 3's HTML parsing approach and instead implement a direct API fetch that returns JSON. Update the `parseTrackingHtml` function to `fetchTrackingData(vin)` accordingly. The types in Task 2 remain the same.

---

## Task 2: Install cheerio and define types

**Files:**
- Create: `src/lib/tracking.ts`
- Create: `__tests__/tracking.test.ts`

- [ ] **Step 1: Install cheerio**

```bash
npm install cheerio
npm install --save-dev @types/cheerio
```

Expected: `added N packages` — no errors.

- [ ] **Step 2: Create `src/lib/tracking.ts` with types and VIN validation**

```typescript
// src/lib/tracking.ts

export interface TrackingStage {
  name: string
  date: string | null
  isActive: boolean
  hiddenCount?: number
}

export interface TrackingPhotoCategory {
  category: string
  count: number
  thumbnailUrl: string | null
  imageUrls: string[]
}

export interface TrackingData {
  commodity: {
    vin: string
    vehicle: string
    lotNo: string
    insurance: string
  }
  stages: TrackingStage[]
  saleOrigin: {
    origin: string
  }
  delivery: {
    branch: string
    truckingRequired: boolean
  }
  shipping: {
    destination: string
    line: string
    vessel: string
    containerNo: string
    trackingUrl: string | null
  }
  inspection: {
    keys: string
    color: string
    condition: string
    damage: string
  }
  photos: TrackingPhotoCategory[]
}

export type TrackingResult =
  | { success: true; data: TrackingData }
  | { success: false; error: 'not_found' | 'unavailable' | 'parse_error' }

// VIN: 17 chars, A-Z0-9, no I O Q
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i

export function isValidVin(vin: string): boolean {
  return VIN_REGEX.test(vin.trim())
}
```

- [ ] **Step 3: Write failing tests for VIN validation**

```typescript
// __tests__/tracking.test.ts
import { isValidVin } from '@/lib/tracking'

describe('isValidVin', () => {
  test('accepts valid 17-char VIN', () => {
    expect(isValidVin('7SAYGAEE4RF115761')).toBe(true)
  })

  test('accepts lowercase', () => {
    expect(isValidVin('7saygaee4rf115761')).toBe(true)
  })

  test('rejects VIN with letter I', () => {
    expect(isValidVin('7SAYGAEE4RF11576I')).toBe(false)
  })

  test('rejects VIN with letter O', () => {
    expect(isValidVin('7SAYGAEE4RF11576O')).toBe(false)
  })

  test('rejects VIN with letter Q', () => {
    expect(isValidVin('7SAYGAEE4RF11576Q')).toBe(false)
  })

  test('rejects 16-char VIN', () => {
    expect(isValidVin('7SAYGAEE4RF11576')).toBe(false)
  })

  test('rejects 18-char VIN', () => {
    expect(isValidVin('7SAYGAEE4RF1157610')).toBe(false)
  })

  test('rejects empty string', () => {
    expect(isValidVin('')).toBe(false)
  })

  test('trims whitespace before validating', () => {
    expect(isValidVin('  7SAYGAEE4RF115761  ')).toBe(true)
  })
})
```

- [ ] **Step 4: Run tests — expect FAIL (function not yet exported)**

```bash
npm test -- --testPathPattern=tracking --verbose
```

Expected: tests fail because `isValidVin` is not found or returns wrong values... actually with the code from Step 2 already in place, tests should pass. Run now:

```bash
npm test -- --testPathPattern=tracking --verbose
```

Expected: all 9 `isValidVin` tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tracking.ts __tests__/tracking.test.ts
git commit -m "feat: add tracking types and VIN validation"
```

---

## Task 3: HTML parser (or JSON API fetch)

> **Read Task 1 discovery result first.** If AEC returns a JSON API, implement `fetchTrackingFromApi` instead of `parseTrackingHtml`. The exported function signatures remain the same so all other tasks are unaffected.

**Files:**
- Modify: `src/lib/tracking.ts` (add parser)
- Modify: `__tests__/tracking.test.ts` (add parser tests)

### Option A: cheerio HTML parser (if data is in HTML)

- [ ] **Step 1: Inspect the HTML structure to find selectors**

Run:
```bash
curl -s "https://client.atlanticexpresscorp.com/order/7SAYGAEE4RF115761/track" > /tmp/aec-track.html
```

Open `/tmp/aec-track.html` in an editor and find:
- The CSS class or element structure for ORDER STATUS stages
- The class/structure for COMMODITY, SHIPPING, INSPECTION cards
- The structure for photo category items

Note down the actual selectors — you will need them for the next step.

- [ ] **Step 2: Add `parseTrackingHtml` to `src/lib/tracking.ts`**

Add these imports at the top:
```typescript
import * as cheerio from 'cheerio'
```

Then add the function (update selectors based on what you found in Step 1):

```typescript
export function parseTrackingHtml(html: string): TrackingData {
  const $ = cheerio.load(html)

  // --- Stages ---
  // Update these selectors after inspecting the actual HTML
  const stages: TrackingStage[] = []
  $('[class*="stage"], [class*="status-step"], [class*="timeline-step"]').each((_, el) => {
    const name = $(el).find('[class*="stage-name"], [class*="step-title"]').text().trim()
    const date = $(el).find('[class*="date"]').text().trim() || null
    const isActive = $(el).attr('class')?.includes('active') ?? false
    const hiddenText = $(el).find('[class*="hidden"], [class*="collapsed"]').text().trim()
    const hiddenCount = hiddenText ? parseInt(hiddenText.replace(/\D/g, ''), 10) : undefined
    if (name) stages.push({ name, date: date || null, isActive, hiddenCount })
  })

  // Helper to extract a field value from a label
  function getField(label: string): string {
    return $(`*:contains("${label}")`).last().closest('[class*="row"], tr, li')
      .find('[class*="value"], td:last-child, span:last-child').text().trim()
  }

  // --- Commodity ---
  const commodity = {
    vin: getField('VIN') || $('[class*="vin"]').text().trim(),
    vehicle: $('[class*="vehicle"], [class*="car-title"]').first().text().trim(),
    lotNo: getField('Lot no') || getField('Lot'),
    insurance: $('[class*="insurance"]').text().trim() || getField('Insurance'),
  }

  // --- Sale Origin ---
  const saleOrigin = {
    origin: getField('Sale Origin') || $('[class*="sale-origin"]').text().trim(),
  }

  // --- Delivery ---
  const delivery = {
    branch: getField('Receiving Branch') || getField('Branch'),
    truckingRequired: $('*:contains("Trucking Required")').length > 0,
  }

  // --- Shipping ---
  const shipping = {
    destination: getField('Final Destination') || getField('Destination'),
    line: getField('Shipping Line') || getField('Line'),
    vessel: getField('Vessel Name') || getField('Vessel'),
    containerNo: getField('Container No') || getField('Container'),
    trackingUrl: $('a[href*="maersk"], a[href*="tracking"]').attr('href') || null,
  }

  // --- Inspection ---
  const inspection = {
    keys: getField('Keys'),
    color: getField('Color'),
    condition: getField('New/Used') || getField('Condition'),
    damage: getField('Damage'),
  }

  // --- Photos ---
  const photos: TrackingPhotoCategory[] = []
  $('[class*="photo-category"], [class*="photo-group"], [class*="photos-item"]').each((_, el) => {
    const category = $(el).find('[class*="category-name"], [class*="title"]').text().trim()
    const countText = $(el).find('[class*="count"], [class*="photos-count"]').text().trim()
    const count = parseInt(countText.replace(/\D/g, ''), 10) || 0
    const thumbnailUrl = $(el).find('img').first().attr('src') || null
    if (category) photos.push({ category, count, thumbnailUrl, imageUrls: [] })
  })

  return { commodity, stages, saleOrigin, delivery, shipping, inspection, photos }
}
```

> **Important:** The selectors above are best-guess stubs. After running `curl` in Step 1 and inspecting the HTML, replace the selectors with the actual ones found. The function signature must not change.

### Option B: Direct JSON API (if AEC has an API)

If Task 1 found a JSON API endpoint (e.g. `https://client.atlanticexpresscorp.com/api/orders/{VIN}`), implement this instead:

```typescript
export async function fetchTrackingFromApi(vin: string): Promise<TrackingData> {
  // Replace URL with the actual API endpoint discovered in Task 1
  const res = await fetch(`https://client.atlanticexpresscorp.com/api/orders/${vin}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error('api_error')
  const json = await res.json()

  // Map the JSON fields to TrackingData — update field names to match actual API response
  return {
    commodity: {
      vin: json.vin ?? json.commodity?.vin ?? '',
      vehicle: json.vehicle ?? `${json.make} ${json.model} ${json.year}`,
      lotNo: json.lotNo ?? json.lot_no ?? '',
      insurance: json.insurance ?? '',
    },
    stages: (json.stages ?? json.statuses ?? []).map((s: any) => ({
      name: s.name ?? s.title,
      date: s.date ?? null,
      isActive: s.active ?? s.isActive ?? false,
      hiddenCount: s.hiddenCount,
    })),
    saleOrigin: { origin: json.saleOrigin ?? json.sale_origin ?? '' },
    delivery: {
      branch: json.branch ?? json.receivingBranch ?? '',
      truckingRequired: json.truckingRequired ?? false,
    },
    shipping: {
      destination: json.destination ?? json.finalDestination ?? '',
      line: json.shippingLine ?? json.line ?? '',
      vessel: json.vesselName ?? json.vessel ?? '',
      containerNo: json.containerNo ?? json.container ?? '',
      trackingUrl: json.trackingUrl ?? null,
    },
    inspection: {
      keys: json.keys ?? '',
      color: json.color ?? '',
      condition: json.condition ?? json.newUsed ?? '',
      damage: json.damage ?? '',
    },
    photos: (json.photos ?? []).map((p: any) => ({
      category: p.category ?? p.name,
      count: p.count ?? p.photos?.length ?? 0,
      thumbnailUrl: p.thumbnail ?? p.thumbnailUrl ?? null,
      imageUrls: p.images ?? p.imageUrls ?? [],
    })),
  }
}
```

- [ ] **Step 3: Add parser smoke test to `__tests__/tracking.test.ts`**

Add after the existing `isValidVin` tests:

```typescript
import { isValidVin, parseTrackingHtml, type TrackingData } from '@/lib/tracking'

// Minimal HTML fixture — enough to verify the parser doesn't crash and
// returns the correct shape. Update selectors here if you change the parser.
const MINIMAL_HTML = `
<html><body>
  <div class="stage active"><span class="stage-name">Arrive</span><span class="date">01/31/2026</span></div>
  <div class="commodity"><span class="vin">7SAYGAEE4RF115761</span></div>
</body></html>
`

describe('parseTrackingHtml', () => {
  test('returns a TrackingData shape without throwing', () => {
    const result = parseTrackingHtml(MINIMAL_HTML)
    expect(result).toHaveProperty('commodity')
    expect(result).toHaveProperty('stages')
    expect(result).toHaveProperty('shipping')
    expect(result).toHaveProperty('inspection')
    expect(result).toHaveProperty('photos')
    expect(Array.isArray(result.stages)).toBe(true)
    expect(Array.isArray(result.photos)).toBe(true)
  })

  test('does not throw on empty HTML', () => {
    expect(() => parseTrackingHtml('<html><body></body></html>')).not.toThrow()
  })
})
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --testPathPattern=tracking --verbose
```

Expected: all tests pass (parser smoke tests pass because they only check shape, not exact values).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tracking.ts __tests__/tracking.test.ts
git commit -m "feat: add tracking HTML parser"
```

---

## Task 4: API Route

**Files:**
- Create: `src/app/api/track/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
// src/app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { isValidVin, parseTrackingHtml, TrackingResult } from '@/lib/tracking'

export async function GET(req: NextRequest): Promise<NextResponse<TrackingResult>> {
  const vin = req.nextUrl.searchParams.get('vin')?.trim().toUpperCase() ?? ''

  if (!isValidVin(vin)) {
    return NextResponse.json(
      { success: false, error: 'not_found' as const },
      { status: 400 }
    )
  }

  let html: string
  try {
    const res = await fetch(
      `https://client.atlanticexpresscorp.com/order/${vin}/track`,
      { next: { revalidate: 300 } }
    )
    if (res.status === 404) {
      return NextResponse.json({ success: false, error: 'not_found' as const }, { status: 404 })
    }
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'unavailable' as const }, { status: 502 })
    }
    html = await res.text()
  } catch {
    return NextResponse.json({ success: false, error: 'unavailable' as const }, { status: 502 })
  }

  try {
    const data = parseTrackingHtml(html)
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'parse_error' as const }, { status: 500 })
  }
}
```

> **Note:** If Task 1 revealed a JSON API instead of HTML, replace `parseTrackingHtml(html)` with `await fetchTrackingFromApi(vin)` and remove the `html` fetch logic (the `fetchTrackingFromApi` function handles its own fetch).

- [ ] **Step 2: Start dev server and test the route manually**

```bash
npm run dev
```

In a new terminal:
```bash
curl "http://localhost:3000/api/track?vin=7SAYGAEE4RF115761" | head -50
```

Expected: JSON response with `success: true` and a `data` object, or `success: false` with an error.

If `success: true` but all fields are empty strings → go back to Task 3 and fix the selectors using the actual HTML from `/tmp/aec-track.html`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/track/route.ts
git commit -m "feat: add /api/track route"
```

---

## Task 5: TrackingTimeline component

**Files:**
- Create: `src/components/tracking/TrackingTimeline.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/tracking/TrackingTimeline.tsx
'use client'
import { TrackingStage } from '@/lib/tracking'

interface Props {
  stages: TrackingStage[]
}

export default function TrackingTimeline({ stages }: Props) {
  if (!stages.length) return null

  const activeIndex = stages.reduce((last, s, i) => (s.isActive ? i : last), -1)

  return (
    <div className="bg-light-bg rounded-2xl p-6 overflow-x-auto">
      <div className="flex items-start min-w-max gap-0">
        {stages.map((stage, i) => {
          const done = i <= activeIndex
          const current = i === activeIndex
          return (
            <div key={`${stage.name}-${i}`} className="flex items-start">
              {/* Node */}
              <div className="flex flex-col items-center w-28">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${done ? 'bg-primary border-primary' : 'bg-white border-gray-300'}
                    ${current ? 'ring-4 ring-primary/20' : ''}`}
                >
                  {done && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <p className={`mt-2 text-xs font-montserrat font-bold text-center leading-tight
                  ${done ? 'text-body' : 'text-muted'}`}>
                  {stage.name}
                </p>
                {stage.date && (
                  <p className="mt-1 text-xs font-montserrat text-muted text-center">
                    {stage.date}
                  </p>
                )}
                {stage.hiddenCount && (
                  <p className="mt-1 text-xs font-montserrat text-primary text-center">
                    +{stage.hiddenCount}
                  </p>
                )}
              </div>
              {/* Connector (not after last item) */}
              {i < stages.length - 1 && (
                <div className={`h-0.5 w-16 mt-2.5 flex-shrink-0
                  ${i < activeIndex ? 'bg-primary' : 'bg-gray-200'}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify it renders in dev**

Add a temporary import to the tracking page (or just verify the build doesn't error):

```bash
npx tsc --noEmit
```

Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/tracking/TrackingTimeline.tsx
git commit -m "feat: add TrackingTimeline component"
```

---

## Task 6: TrackingPhotos component

**Files:**
- Create: `src/components/tracking/TrackingPhotos.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/tracking/TrackingPhotos.tsx
'use client'
import { useState } from 'react'
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

  function prev() {
    if (!lightbox) return
    const max = lightbox.category.imageUrls.length - 1
    setLightbox({ ...lightbox, index: lightbox.index === 0 ? max : lightbox.index - 1 })
  }

  function next() {
    if (!lightbox) return
    const max = lightbox.category.imageUrls.length - 1
    setLightbox({ ...lightbox, index: lightbox.index === max ? 0 : lightbox.index + 1 })
  }

  return (
    <div>
      <h3 className="font-muller font-bold text-lg text-body mb-4">Фото</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((cat) => (
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
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <button
            className="absolute left-4 text-white hover:text-primary"
            onClick={(e) => { e.stopPropagation(); prev() }}
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
                <button key={i} onClick={() => setLightbox({ ...lightbox, index: i })}>
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
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/tracking/TrackingPhotos.tsx
git commit -m "feat: add TrackingPhotos component with lightbox"
```

---

## Task 7: TrackingResult component

**Files:**
- Create: `src/components/tracking/TrackingResult.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/tracking/TrackingResult.tsx
import { TrackingData } from '@/lib/tracking'
import TrackingTimeline from './TrackingTimeline'
import TrackingPhotos from './TrackingPhotos'
import { ExternalLink } from 'lucide-react'

interface Props {
  data: TrackingData
}

function InfoCard({ title, rows }: { title: string; rows: { label: string; value: string | null; link?: string }[] }) {
  return (
    <div className="bg-light-bg rounded-2xl p-6">
      <h3 className="font-muller font-bold text-base text-body mb-4 uppercase tracking-wide">{title}</h3>
      <div className="space-y-3">
        {rows.filter((r) => r.value).map((row) => (
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
      <div className="bg-dark-bg rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-white/50 font-montserrat text-sm mb-1">VIN: {data.commodity.vin}</p>
          <h2 className="font-muller font-bold text-2xl text-white">{data.commodity.vehicle || data.commodity.vin}</h2>
          {data.commodity.lotNo && (
            <p className="text-white/50 font-montserrat text-sm mt-1">Лот: {data.commodity.lotNo}</p>
          )}
        </div>
        {currentStage && (
          <div className="flex-shrink-0">
            <span className="px-4 py-2 bg-primary text-white font-montserrat font-bold rounded-lg text-sm">
              {currentStage.name}
            </span>
          </div>
        )}
      </div>

      {/* Timeline */}
      {data.stages.length > 0 && <TrackingTimeline stages={data.stages} />}

      {/* Info cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard title="Автомобиль" rows={[
          { label: 'VIN', value: data.commodity.vin },
          { label: 'Авто', value: data.commodity.vehicle },
          { label: 'Лот', value: data.commodity.lotNo },
          { label: 'Страховка', value: data.commodity.insurance },
        ]} />

        <InfoCard title="Доставка" rows={[
          { label: 'Пункт назначения', value: data.shipping.destination },
          { label: 'Линия', value: data.shipping.line },
          { label: 'Судно', value: data.shipping.vessel },
          { label: 'Контейнер', value: data.shipping.containerNo },
          ...(data.shipping.trackingUrl ? [{ label: 'Трекинг судна', value: 'Открыть', link: data.shipping.trackingUrl }] : []),
        ]} />

        <InfoCard title="Инспекция" rows={[
          { label: 'Ключи', value: data.inspection.keys },
          { label: 'Цвет', value: data.inspection.color },
          { label: 'Состояние', value: data.inspection.condition },
          { label: 'Повреждения', value: data.inspection.damage },
        ]} />

        {data.saleOrigin.origin && (
          <InfoCard title="Происхождение" rows={[
            { label: 'Аукцион', value: data.saleOrigin.origin },
          ]} />
        )}

        {data.delivery.branch && (
          <InfoCard title="Отделение" rows={[
            { label: 'Филиал', value: data.delivery.branch },
            { label: 'Трак', value: data.delivery.truckingRequired ? 'Требуется' : 'Не требуется' },
          ]} />
        )}
      </div>

      {/* Photos */}
      {data.photos.length > 0 && <TrackingPhotos photos={data.photos} />}
    </div>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/tracking/TrackingResult.tsx
git commit -m "feat: add TrackingResult component"
```

---

## Task 8: Update tracking page

**Files:**
- Modify: `src/app/tracking/page.tsx`

- [ ] **Step 1: Replace the stub page**

```typescript
// src/app/tracking/page.tsx
'use client'
import { useState } from 'react'
import { isValidVin, TrackingResult as TrackingResultType } from '@/lib/tracking'
import TrackingResult from '@/components/tracking/TrackingResult'
import Button from '@/components/ui/Button'

// Note: metadata can't be exported from 'use client' pages.
// Move metadata to a parent layout if needed, or use a separate layout.tsx.

export default function TrackingPage() {
  const [vin, setVin] = useState('')
  const [vinError, setVinError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackingResultType | null>(null)

  const inputCls = `w-full px-4 py-3 rounded-lg border font-montserrat text-sm focus:outline-none
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
      <div className="container max-w-4xl">
        <h1 className="font-muller font-bold text-4xl md:text-5xl text-body mb-4">
          Отслеживание авто
        </h1>
        <p className="text-muted font-montserrat mb-10">
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
          <div className="bg-dark-bg rounded-2xl p-8 text-center">
            <p className="text-white font-montserrat mb-2 font-bold">
              {result.error === 'not_found'
                ? 'Авто с этим VIN не найдено в системе'
                : 'Сервис временно недоступен, попробуйте позже'}
            </p>
            <p className="text-white/50 font-montserrat text-sm mb-6">
              {result.error === 'not_found'
                ? 'Проверьте VIN или свяжитесь с менеджером'
                : 'Попробуйте через несколько минут или свяжитесь с менеджером'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://t.me/pmcars" target="_blank" rel="noopener noreferrer"
                className="px-5 py-2 bg-[#2AABEE] text-white rounded font-montserrat font-bold text-sm">
                Telegram
              </a>
              <a href="https://wa.me/375XXXXXXXXX" target="_blank" rel="noopener noreferrer"
                className="px-5 py-2 bg-[#25D366] text-white rounded font-montserrat font-bold text-sm">
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create a layout file for the tracking page metadata**

Since `'use client'` pages cannot export `metadata`, create a layout:

```typescript
// src/app/tracking/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Отслеживание авто',
  description: 'Отслеживайте статус доставки вашего автомобиля из США.',
}

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 3: Type check and build**

```bash
npx tsc --noEmit && npm run build
```

Expected: build completes without errors.

- [ ] **Step 4: Manual test in browser**

```bash
npm run dev
```

Open `http://localhost:3000/tracking`.
- Enter an invalid VIN → should show inline error
- Enter `7SAYGAEE4RF115761` → should show loading spinner then result
- Verify hero card, timeline, info cards, photo grid render correctly

- [ ] **Step 5: Commit**

```bash
git add src/app/tracking/page.tsx src/app/tracking/layout.tsx
git commit -m "feat: implement native tracking page with VIN form and result display"
```

---

## Task 9: Allow AEC image domain in Next.js config

**Files:**
- Modify: `next.config.mjs`

> Only needed if you use `<Image>` from `next/image`. The current implementation uses `<img>` tags directly to avoid this config, but if you later switch to `next/image`, update the config here.

- [ ] **Step 1: Update next.config.mjs to allow AEC images (optional — only if switching to next/image)**

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.atlanticexpresscorp.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 2: Commit (only if Step 1 was applied)**

```bash
git add next.config.mjs
git commit -m "feat: allow AEC image domain in Next.js config"
```

---

## Task 10: Run all tests and final build check

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: all tests pass, no failures.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: build completes successfully.

- [ ] **Step 3: Final commit if any cleanup needed**

```bash
git add -A
git status  # verify only tracking files are staged
git commit -m "feat: native vehicle tracking complete"
```
