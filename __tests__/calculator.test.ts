// __tests__/calculator.test.ts
import {
  calculateDutyUnder3Years,
  calculateDuty3To5Years,
  calculateDutyOver5Years,
  calculateDutyMoto,
  calculateTotal,
  type CalculatorInput,
} from '@/lib/calculator'

describe('calculateDutyUnder3Years', () => {
  test('стоимость <= 8500, маленький объём (побеждает процент)', () => {
    // 5000 * 0.54 = 2700; 1200 * 2.5 = 3000 → max = 3000
    expect(calculateDutyUnder3Years(5000, 1200)).toBe(3000)
  })

  test('стоимость <= 8500, большой объём (побеждает объём)', () => {
    // 8000 * 0.54 = 4320; 2500 * 2.5 = 6250 → max = 6250
    expect(calculateDutyUnder3Years(8000, 2500)).toBe(6250)
  })

  test('стоимость > 8500 (ставка 48%)', () => {
    // 10000 * 0.48 = 4800; 1000 * 3.5 = 3500 → max = 4800
    expect(calculateDutyUnder3Years(10000, 1000)).toBe(4800)
  })

  test('стоимость > 169000 (макс ставка по объёму)', () => {
    // 200000 * 0.48 = 96000; 3500 * 20 = 70000 → max = 96000
    expect(calculateDutyUnder3Years(200000, 3500)).toBe(96000)
  })
})

describe('calculateDuty3To5Years', () => {
  test('объём <= 1000', () => expect(calculateDuty3To5Years(1000)).toBe(1500))
  test('объём <= 1500', () => expect(calculateDuty3To5Years(1500)).toBe(2550))
  test('объём <= 1800', () => expect(calculateDuty3To5Years(1800)).toBe(4500))
  test('объём <= 2300', () => expect(calculateDuty3To5Years(2000)).toBe(5400))
  test('объём <= 3000', () => expect(calculateDuty3To5Years(2500)).toBe(7500))
  test('объём > 3000',  () => expect(calculateDuty3To5Years(3500)).toBe(12600))
})

describe('calculateDutyOver5Years', () => {
  test('объём <= 1000', () => expect(calculateDutyOver5Years(1000)).toBe(3000))
  test('объём <= 1500', () => expect(calculateDutyOver5Years(1200)).toBe(3840))
  test('объём <= 1800', () => expect(calculateDutyOver5Years(1800)).toBe(6300))
  test('объём <= 2300', () => expect(calculateDutyOver5Years(2000)).toBe(9600))
  test('объём <= 3000', () => expect(calculateDutyOver5Years(2800)).toBe(14000))
  test('объём > 3000',  () => expect(calculateDutyOver5Years(4000)).toBe(22800))
})

describe('calculateDutyMoto', () => {
  test('объём <= 800', () => {
    // firstIndicator = 5000 * 0.15 = 750; second = (5000 + 750) * 0.2 = 1150; total = 1900
    expect(calculateDutyMoto(5000, 800)).toBe(1900)
  })
  test('объём > 800', () => {
    // firstIndicator = 5000 * 0.10 = 500; second = (5000 + 500) * 0.2 = 1100; total = 1600
    expect(calculateDutyMoto(5000, 1000)).toBe(1600)
  })
})

describe('calculateTotal', () => {
  test('электромобиль — пошлина 0', () => {
    const input: CalculatorInput = {
      carCost: 20000,
      engineVolume: 0,
      carType: 'auto',
      engineType: 'electric',
      carAge: 'under3',
      decree140: false,
      eurRate: 3.38,
    }
    const result = calculateTotal(input)
    expect(result.duty).toBe(0)
    expect(result.total).toBeGreaterThan(0) // сборы всё равно есть
  })

  test('указ 140 делит пошлину на 2', () => {
    const base: CalculatorInput = {
      carCost: 10000, engineVolume: 2000, carType: 'auto',
      engineType: 'ice', carAge: 'under3', decree140: false, eurRate: 3.38,
    }
    const with140: CalculatorInput = { ...base, decree140: true }
    const r1 = calculateTotal(base)
    const r2 = calculateTotal(with140)
    expect(r2.duty).toBeCloseTo(r1.duty / 2, 2)
  })

  test('итог = сумма всех компонентов', () => {
    const input: CalculatorInput = {
      carCost: 15000, engineVolume: 2000, carType: 'auto',
      engineType: 'ice', carAge: '3to5', decree140: false, eurRate: 3.38,
    }
    const r = calculateTotal(input)
    expect(r.total).toBeCloseTo(r.duty + r.customsFee + r.recyclingFee + r.eptsFee, 2)
  })

  test('мото + указ 140 — пошлина делится на 2', () => {
    const base: CalculatorInput = {
      carCost: 5000, engineVolume: 800, carType: 'moto',
      engineType: 'ice', carAge: 'under3', decree140: false, eurRate: 3.38,
    }
    const with140: CalculatorInput = { ...base, decree140: true }
    const r1 = calculateTotal(base)
    const r2 = calculateTotal(with140)
    expect(r2.duty).toBeCloseTo(r1.duty / 2, 2)
  })

  test('авто старше 5 лет — верный путь расчёта', () => {
    const input: CalculatorInput = {
      carCost: 8000, engineVolume: 2000, carType: 'auto',
      engineType: 'ice', carAge: 'over5', decree140: false, eurRate: 3.38,
    }
    const r = calculateTotal(input)
    // over5, 2000 cc: 2000 * 4.8 = 9600
    expect(r.duty).toBe(9600)
    expect(r.total).toBeCloseTo(r.duty + r.customsFee + r.recyclingFee + r.eptsFee, 2)
  })

  test('мото — нет утилизационного сбора', () => {
    const input: CalculatorInput = {
      carCost: 5000, engineVolume: 600, carType: 'moto',
      engineType: 'ice', carAge: 'under3', decree140: false, eurRate: 3.38,
    }
    const r = calculateTotal(input)
    expect(r.recyclingFee).toBe(0)
  })
})
