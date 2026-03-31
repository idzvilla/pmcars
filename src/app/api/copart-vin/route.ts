// src/app/api/copart-vin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { isValidVin, mapFuelType, parseEngineLiters } from '@/lib/vin-lookup'

export interface CopartLotData {
  year: number
  engineLiters: number
  fuelType: 'gas' | 'diesel' | 'hybrid' | 'electric'
  priceUSD: number
  location: string
  lotNumber: number
}

type ErrorResponse = { error: 'invalid_vin' | 'not_found' | 'unavailable' | 'parse_error' }

const COPART_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Referer': 'https://www.copart.com/',
  'Origin': 'https://www.copart.com',
}

export async function GET(req: NextRequest): Promise<NextResponse<CopartLotData | ErrorResponse>> {
  const vin = req.nextUrl.searchParams.get('vin')?.trim().toUpperCase() ?? ''

  if (!isValidVin(vin)) {
    return NextResponse.json({ error: 'invalid_vin' }, { status: 400 })
  }

  // Step 1: Search for lot by VIN
  let lotId: number
  try {
    const searchRes = await fetch('https://www.copart.com/public/lots/search-results', {
      method: 'POST',
      headers: { ...COPART_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: { bool: { must: [{ term: { vn: vin } }] } },
        size: 1,
        sort: [],
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!searchRes.ok) {
      return NextResponse.json({ error: 'unavailable' }, { status: 502 })
    }

    const searchJson = await searchRes.json()
    const content = searchJson?.data?.results?.content
    if (!Array.isArray(content) || content.length === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    lotId = content[0].ln
    if (typeof lotId !== 'number' || !lotId) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 })
  }

  // Step 2: Fetch lot details
  try {
    const detailRes = await fetch(`https://www.copart.com/public/lot/${lotId}/detail`, {
      headers: COPART_HEADERS,
      signal: AbortSignal.timeout(8000),
    })

    if (!detailRes.ok) {
      return NextResponse.json({ error: 'unavailable' }, { status: 502 })
    }

    const detailJson = await detailRes.json()
    const lot = detailJson?.data?.lot

    if (!lot) {
      return NextResponse.json({ error: 'parse_error' }, { status: 500 })
    }

    const data: CopartLotData = {
      year: Number(lot.y) || 0,
      engineLiters: parseEngineLiters(lot.egn),
      fuelType: mapFuelType(String(lot.ft ?? '')),
      priceUSD: Number(lot.lbv) || 0,
      location: String(lot.yn ?? ''),
      lotNumber: Number(lot.ln) || lotId,
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 })
  }
}
