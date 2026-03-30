import {
  getAuctionFee,
  getUSDomesticEntry,
  normalizeUSPort,
  getOceanFreight,
  getPortHandling,
  getInlandFee,
  getInsurance,
  autoSelectPort,
  getLocationsForAuction,
} from '@/lib/expenses-data'

describe('getAuctionFee', () => {
  test('copart $15000 → base $1000 + fixed $148', () => {
    expect(getAuctionFee('copart', 15000)).toBe(1148)
  })
  test('copart $999 → base $69 + fixed $148', () => {
    expect(getAuctionFee('copart', 999)).toBe(217)
  })
  test('iaai $5000 → base $890 + fixed $290', () => {
    expect(getAuctionFee('iaai', 5000)).toBe(1180)
  })
  test('iaai $10000 → base $1500 + fixed $290', () => {
    expect(getAuctionFee('iaai', 10000)).toBe(1790)
  })
  test('bidcars $1500 → base $200 + fixed $598', () => {
    expect(getAuctionFee('bidcars', 1500)).toBe(798)
  })
  test('bidcars $10000 → base $1000 + fixed $598', () => {
    expect(getAuctionFee('bidcars', 10000)).toBe(1598)
  })
})

describe('getUSDomesticEntry', () => {
  test('finds ACE - Carson - CA for copart', () => {
    const entry = getUSDomesticEntry('ACE - Carson - CA', 'copart')
    expect(entry).toBeDefined()
    expect(entry!.regular).toBe(235)
    expect(entry!.port).toBe('Los Angeles')
  })
  test('returns undefined for unknown location', () => {
    expect(getUSDomesticEntry('NONEXISTENT', 'copart')).toBeUndefined()
  })
})

describe('normalizeUSPort', () => {
  test('Los Angeles → LOS_ANGELES', () => expect(normalizeUSPort('Los Angeles')).toBe('LOS_ANGELES'))
  test('Houston → HOUSTON', () => expect(normalizeUSPort('Houston')).toBe('HOUSTON'))
  test('Sesttle (typo) → SEATTLE', () => expect(normalizeUSPort('Sesttle')).toBe('SEATTLE'))
  test('Chicago (no RORO) → NEW_YORK', () => expect(normalizeUSPort('Chicago')).toBe('NEW_YORK'))
  test('Miami (no RORO) → JACKSONVILLE', () => expect(normalizeUSPort('Miami')).toBe('JACKSONVILLE'))
})

describe('getOceanFreight', () => {
  test('LOS_ANGELES → POTI RORO', () => expect(getOceanFreight('LOS_ANGELES', 'POTI')).toBe(1550))
  test('NEW_YORK → KLAIPEDA RORO', () => expect(getOceanFreight('NEW_YORK', 'KLAIPEDA')).toBe(1100))
  test('HOUSTON → POTI RORO', () => expect(getOceanFreight('HOUSTON', 'POTI')).toBe(1500))
})

describe('getPortHandling', () => {
  test('POTI → 400', () => expect(getPortHandling('POTI')).toBe(400))
  test('KLAIPEDA → 350', () => expect(getPortHandling('KLAIPEDA')).toBe(350))
})

describe('getInlandFee', () => {
  test('POTI → MINSK runner', () => expect(getInlandFee('POTI', 'MINSK')).toBe(1200))
  test('KLAIPEDA → GOMEL runner', () => expect(getInlandFee('KLAIPEDA', 'GOMEL')).toBe(900))
  test('POTI → BREST runner', () => expect(getInlandFee('POTI', 'BREST')).toBe(1400))
})

describe('getInsurance', () => {
  test('1% of price, min $50', () => {
    expect(getInsurance(15000)).toBe(150)
    expect(getInsurance(3000)).toBe(50) // 30 < 50, use min
    expect(getInsurance(5000)).toBe(50) // exactly 50
  })
})

describe('autoSelectPort', () => {
  test('< 2.0л → KLAIPEDA', () => expect(autoSelectPort(1.6)).toBe('KLAIPEDA'))
  test('>= 2.0л → POTI', () => expect(autoSelectPort(2.0)).toBe('POTI'))
  test('3.0л → POTI', () => expect(autoSelectPort(3.0)).toBe('POTI'))
})

describe('getLocationsForAuction', () => {
  test('returns copart locations array', () => {
    const locs = getLocationsForAuction('copart')
    expect(Array.isArray(locs)).toBe(true)
    expect(locs.length).toBeGreaterThan(0)
    expect(locs).toContain('ACE - Carson - CA')
  })
  test('returns empty array for bidcars (not in CSV)', () => {
    expect(getLocationsForAuction('bidcars')).toHaveLength(0)
  })
})
