// __tests__/vin-lookup-lib.test.ts
import { isValidVin, mapFuelType, parseEngineLiters } from '@/lib/vin-lookup'

describe('isValidVin', () => {
  test('accepts valid 17-char VIN', () => {
    expect(isValidVin('1HGBH41JXMN109186')).toBe(true)
  })
  test('rejects short VIN', () => {
    expect(isValidVin('SHORT')).toBe(false)
  })
  test('rejects empty string', () => {
    expect(isValidVin('')).toBe(false)
  })
  test('rejects VIN with I, O, Q characters', () => {
    expect(isValidVin('1HGBH41JXMN10918I')).toBe(false)
    expect(isValidVin('1HGBH41JXMN10918O')).toBe(false)
    expect(isValidVin('1HGBH41JXMN10918Q')).toBe(false)
  })
})

describe('mapFuelType', () => {
  test('maps GASOLINE to gas', () => expect(mapFuelType('GASOLINE')).toBe('gas'))
  test('maps Gasoline (mixed case) to gas', () => expect(mapFuelType('Gasoline')).toBe('gas'))
  test('maps DIESEL to diesel', () => expect(mapFuelType('DIESEL')).toBe('diesel'))
  test('maps HYBRID to hybrid', () => expect(mapFuelType('HYBRID')).toBe('hybrid'))
  test('maps ELECTRIC to electric', () => expect(mapFuelType('ELECTRIC')).toBe('electric'))
  test('maps PLUG-IN HYBRID to hybrid', () => expect(mapFuelType('PLUG-IN HYBRID')).toBe('hybrid'))
  test('falls back to gas for unknown', () => expect(mapFuelType('UNKNOWN')).toBe('gas'))
  test('falls back to gas for empty string', () => expect(mapFuelType('')).toBe('gas'))
})

describe('parseEngineLiters', () => {
  test('converts cc value to liters (2000 → 2.0)', () => expect(parseEngineLiters(2000)).toBe(2.0))
  test('converts cc string to liters ("2000" → 2.0)', () => expect(parseEngineLiters('2000')).toBe(2.0))
  test('parses liters string with L suffix ("2.0L" → 2.0)', () => expect(parseEngineLiters('2.0L')).toBe(2.0))
  test('parses liters string without suffix ("2.0" → 2.0)', () => expect(parseEngineLiters('2.0')).toBe(2.0))
  test('returns 0 for undefined', () => expect(parseEngineLiters(undefined)).toBe(0))
  test('returns 0 for null', () => expect(parseEngineLiters(null)).toBe(0))
  test('returns 0 for NaN string', () => expect(parseEngineLiters('abc')).toBe(0))
  test('rounds to 1 decimal (2500 cc → 2.5)', () => expect(parseEngineLiters(2500)).toBe(2.5))
})
