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

  // Auction fee
  const auctionFeeUSD = getAuctionFee(auction, priceUSD)

  // US domestic delivery
  const entry = location ? getUSDomesticEntry(location, auction) : undefined
  const usDomesticUSD = entry ? entry[vehicleSize] : 0
  const usPortNormalized = entry ? normalizeUSPort(entry.port) : ''

  // Ocean freight and delivery
  const oceanFreightUSD = usPortNormalized ? getOceanFreight(usPortNormalized, euPort) : 0
  const insuranceUSD = getInsurance(priceUSD)
  const portHandlingUSD = getPortHandling(euPort)
  const inlandUSD = getInlandFee(euPort, city)

  // Customs duty: convert USD price to EUR for calculateTotal
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

  // Fixed BYN fees
  const utilFeeBYN = carAge === 'under3' ? RECYCLING_FEE_UNDER3_BYN : RECYCLING_FEE_OVER3_BYN

  // Total in USD
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
