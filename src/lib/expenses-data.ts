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
  return Array.from(new Set(
    usDomesticPrices
      .filter(e => e.auction === auction)
      .map(e => e.location)
  ))
}
