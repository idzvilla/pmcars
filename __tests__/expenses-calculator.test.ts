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
