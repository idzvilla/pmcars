// src/lib/vin-lookup.ts

export type FuelType = 'gas' | 'diesel' | 'hybrid' | 'electric'

export interface VinLookupResult {
  year: number
  engineLiters: number
  fuelType: FuelType
  priceUSD: number
  location: string
  lotNumber: number | string
  source: 'copart' | 'iaai' | 'bidcars'
}

export type VinLookupError = { error: 'invalid_vin' | 'not_found' | 'unavailable' }

export function isValidVin(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)
}

export function mapFuelType(raw: string): FuelType {
  const s = raw.toUpperCase()
  if (s.includes('DIESEL')) return 'diesel'
  if (s.includes('HYBRID')) return 'hybrid'
  if (s.includes('ELECTRIC')) return 'electric'
  return 'gas'
}

export function parseEngineLiters(raw: string | number | undefined | null): number {
  if (raw === undefined || raw === null) return 0
  // Strip non-numeric chars (e.g. "2.0L" → "2.0")
  const cleaned = String(raw).replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  if (isNaN(num)) return 0
  // Values > 100 are cc (e.g. 2000) → convert to liters
  // Values ≤ 100 are already liters (e.g. 2.0)
  return num > 100 ? Math.round((num / 1000) * 10) / 10 : Math.round(num * 10) / 10
}
