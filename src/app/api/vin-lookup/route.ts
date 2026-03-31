// src/app/api/vin-lookup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { isValidVin, mapFuelType, parseEngineLiters, type VinLookupResult, type VinLookupError } from '@/lib/vin-lookup'

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
}

// --- Copart: two-step search + detail ---
async function fetchCopart(vin: string): Promise<VinLookupResult | null> {
  const searchRes = await fetch('https://www.copart.com/public/lots/search-results', {
    method: 'POST',
    headers: { ...BROWSER_HEADERS, 'Content-Type': 'application/json', 'Referer': 'https://www.copart.com/', 'Origin': 'https://www.copart.com' },
    body: JSON.stringify({ query: { bool: { must: [{ term: { vn: vin } }] } }, size: 1, sort: [] }),
    signal: AbortSignal.timeout(8000),
  })
  if (!searchRes.ok) return null

  const searchJson = await searchRes.json()
  const content = searchJson?.data?.results?.content
  if (!Array.isArray(content) || content.length === 0) return null

  const lotId = content[0].ln
  if (typeof lotId !== 'number' || !lotId) return null

  const detailRes = await fetch(`https://www.copart.com/public/lot/${lotId}/detail`, {
    headers: { ...BROWSER_HEADERS, 'Referer': 'https://www.copart.com/', 'Origin': 'https://www.copart.com' },
    signal: AbortSignal.timeout(8000),
  })
  if (!detailRes.ok) return null

  const detailJson = await detailRes.json()
  const lot = detailJson?.data?.lot
  if (!lot) return null

  return {
    year: Number(lot.y) || 0,
    engineLiters: parseEngineLiters(lot.egn),
    fuelType: mapFuelType(String(lot.ft ?? '')),
    priceUSD: Number(lot.lbv) || 0,
    location: String(lot.yn ?? ''),
    lotNumber: Number(lot.ln) || lotId,
    source: 'copart',
  }
}

// --- IAAI: single-step search ---
async function fetchIAAI(vin: string): Promise<VinLookupResult | null> {
  const res = await fetch(`https://www.iaai.com/Search/GetSearchResults?SearchType=1&VIN=${encodeURIComponent(vin)}`, {
    headers: { ...BROWSER_HEADERS, 'Referer': 'https://www.iaai.com' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) return null

  const json = await res.json()
  const items = json?.Items
  if (!Array.isArray(items) || items.length === 0) return null

  const item = items[0]
  return {
    year: Number(item.Year) || 0,
    engineLiters: parseEngineLiters(item.EngineSize),
    fuelType: mapFuelType(String(item.FuelType ?? '')),
    priceUSD: Number(item.CurrentBid) || 0,
    location: String(item.LocationName ?? ''),
    lotNumber: item.StockNumber,
    source: 'iaai',
  }
}

// --- BidCars: single-step search ---
async function fetchBidCars(vin: string): Promise<VinLookupResult | null> {
  const res = await fetch('https://bidcars.com/api/search', {
    method: 'POST',
    headers: { ...BROWSER_HEADERS, 'Content-Type': 'application/json', 'Referer': 'https://bidcars.com' },
    body: JSON.stringify({ vin, page: 1, limit: 1 }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) return null

  const json = await res.json()
  const items = json?.data
  if (!Array.isArray(items) || items.length === 0) return null

  const item = items[0]
  return {
    year: Number(item.year) || 0,
    engineLiters: parseEngineLiters(item.engine),
    fuelType: mapFuelType(String(item.fuel_type ?? '')),
    priceUSD: Number(item.price) || 0,
    location: String(item.location ?? ''),
    lotNumber: String(item.lot_id ?? ''),
    source: 'bidcars',
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<VinLookupResult | VinLookupError>> {
  const vin = req.nextUrl.searchParams.get('vin')?.trim().toUpperCase() ?? ''

  if (!isValidVin(vin)) {
    return NextResponse.json({ error: 'invalid_vin' }, { status: 400 })
  }

  // Run all three in parallel
  const [copartResult, iaaiResult, bidcarsResult] = await Promise.allSettled([
    fetchCopart(vin),
    fetchIAAI(vin),
    fetchBidCars(vin),
  ])

  // Return first non-null result by priority: Copart → IAAI → BidCars
  for (const settled of [copartResult, iaaiResult, bidcarsResult]) {
    if (settled.status === 'fulfilled' && settled.value !== null) {
      return NextResponse.json(settled.value)
    }
  }

  // Determine 404 (reachable but not found) vs 502 (all unreachable)
  const anyReachable = [copartResult, iaaiResult, bidcarsResult].some(
    (s) => s.status === 'fulfilled'
  )

  return anyReachable
    ? NextResponse.json({ error: 'not_found' }, { status: 404 })
    : NextResponse.json({ error: 'unavailable' }, { status: 502 })
}
