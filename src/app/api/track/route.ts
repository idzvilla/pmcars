// src/app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { isValidVin, mapAecResponse, type TrackingResult, type AecTrackingResponse } from '@/lib/tracking'

// Simple in-memory cache: VIN → { data, expiresAt }
const cache = new Map<string, { data: TrackingResult; expiresAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export async function GET(req: NextRequest): Promise<NextResponse<TrackingResult>> {
  const vin = req.nextUrl.searchParams.get('vin')?.trim().toUpperCase() ?? ''

  if (!isValidVin(vin)) {
    return NextResponse.json(
      { success: false, error: 'not_found' as const },
      { status: 400 }
    )
  }

  // Check cache
  const cached = cache.get(vin)
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data)
  }

  let raw: AecTrackingResponse
  try {
    const res = await fetch(
      `https://clientbackend.atlanticexpresscorp.com/tracking/vin/${vin}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
        signal: AbortSignal.timeout(8000),
      }
    )
    if (res.status === 404) {
      return NextResponse.json({ success: false, error: 'not_found' as const }, { status: 404 })
    }
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'unavailable' as const }, { status: 502 })
    }
    raw = await res.json()
  } catch {
    return NextResponse.json({ success: false, error: 'unavailable' as const }, { status: 502 })
  }

  try {
    const data = mapAecResponse(raw)
    // Sanitize trackingUrl — only allow https://
    if (data.shipping.trackingUrl && !data.shipping.trackingUrl.startsWith('https://')) {
      data.shipping.trackingUrl = null
    }
    const result: TrackingResult = { success: true, data }
    cache.set(vin, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ success: false, error: 'parse_error' as const }, { status: 500 })
  }
}
