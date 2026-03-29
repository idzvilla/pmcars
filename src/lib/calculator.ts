// src/lib/calculator.ts

export interface CalculatorInput {
  carCost: number        // в EUR
  engineVolume: number   // в куб. см
  carType: 'auto' | 'moto'
  engineType: 'ice' | 'electric'
  carAge: 'under3' | '3to5' | 'over5'
  decree140: boolean
  eurRate: number        // курс BYN/EUR от НБРБ
}

export interface CalculatorResult {
  carCost: number
  duty: number
  customsFee: number
  recyclingFee: number
  eptsFee: number
  total: number
}

// Константы в BYN
const CUSTOMS_FEE_BYN = 120
const EPTS_FEE_BYN = 70
const RECYCLING_FEE_UNDER_3_BYN = 544
const RECYCLING_FEE_OVER_3_BYN = 1089

export function calculateDutyUnder3Years(carCost: number, engineVolume: number): number {
  const byPrice = carCost <= 8500 ? carCost * 0.54 : carCost * 0.48

  let byEngine: number
  if (carCost <= 8500)        byEngine = engineVolume * 2.5
  else if (carCost <= 16700)  byEngine = engineVolume * 3.5
  else if (carCost <= 42300)  byEngine = engineVolume * 5.5
  else if (carCost <= 84500)  byEngine = engineVolume * 7.5
  else if (carCost <= 169000) byEngine = engineVolume * 15
  else                        byEngine = engineVolume * 20

  return Math.max(byPrice, byEngine)
}

export function calculateDuty3To5Years(engineVolume: number): number {
  if (engineVolume <= 1000) return engineVolume * 1.5
  if (engineVolume <= 1500) return engineVolume * 1.7
  if (engineVolume <= 1800) return engineVolume * 2.5
  if (engineVolume <= 2300) return engineVolume * 2.7
  if (engineVolume <= 3000) return engineVolume * 3.0
  return engineVolume * 3.6
}

export function calculateDutyOver5Years(engineVolume: number): number {
  if (engineVolume <= 1000) return engineVolume * 3.0
  if (engineVolume <= 1500) return engineVolume * 3.2
  if (engineVolume <= 1800) return engineVolume * 3.5
  if (engineVolume <= 2300) return engineVolume * 4.8
  if (engineVolume <= 3000) return engineVolume * 5.0
  return engineVolume * 5.7
}

export function calculateDutyMoto(carCost: number, engineVolume: number): number {
  const first = engineVolume <= 800 ? carCost * 0.15 : carCost * 0.10
  const second = (carCost + first) * 0.2
  return first + second
}

export function calculateTotal(input: CalculatorInput): CalculatorResult {
  const { carCost, engineVolume, carType, engineType, carAge, decree140, eurRate } = input

  let duty = 0

  if (engineType !== 'electric') {
    if (carType === 'moto') {
      duty = calculateDutyMoto(carCost, engineVolume)
    } else {
      if (carAge === 'under3') duty = calculateDutyUnder3Years(carCost, engineVolume)
      else if (carAge === '3to5') duty = calculateDuty3To5Years(engineVolume)
      else duty = calculateDutyOver5Years(engineVolume)
    }
  }

  if (decree140) duty /= 2

  const bynToEur = 1 / eurRate
  const customsFee = CUSTOMS_FEE_BYN * bynToEur
  const eptsFee = EPTS_FEE_BYN * bynToEur
  const recyclingFee = carType === 'moto'
    ? 0
    : (carAge === 'under3' ? RECYCLING_FEE_UNDER_3_BYN : RECYCLING_FEE_OVER_3_BYN) * bynToEur

  const total = duty + customsFee + recyclingFee + eptsFee

  return { carCost, duty, customsFee, recyclingFee, eptsFee, total }
}
