// __tests__/vin-lookup-route.test.ts
import { GET } from '@/app/api/vin-lookup/route'
import { NextRequest } from 'next/server'

const VALID_VIN = '1HGBH41JXMN109186'

function makeReq(vin: string) {
  return new NextRequest(`http://localhost/api/vin-lookup?vin=${vin}`)
}

// --- Mock data ---
const COPART_SEARCH_FOUND = {
  data: { results: { content: [{ ln: 11111111 }], totalElements: 1 } },
}
const COPART_DETAIL = {
  data: { lot: { y: 2019, egn: '2000', ft: 'GASOLINE', lbv: 8500, yn: 'Houston - TX', ln: 11111111 } },
}
const COPART_SEARCH_EMPTY = {
  data: { results: { content: [], totalElements: 0 } },
}
const IAAI_FOUND = {
  Items: [{ Year: 2020, EngineSize: '2.0L', FuelType: 'Gasoline', CurrentBid: 9000, LocationName: 'Dallas - TX', StockNumber: 22222222 }],
}
const IAAI_EMPTY = { Items: [] }
const BIDCARS_FOUND = {
  data: [{ year: 2018, engine: '1.5', fuel_type: 'Gasoline', price: 6500, location: 'Atlanta - GA', lot_id: '33333333' }],
}
const BIDCARS_EMPTY = { data: [] }

// Helper: build a URL-routing fetch mock
// copartSearch: response for Copart search-results endpoint
// copartDetail: response for Copart lot detail endpoint (null = not reached / reject)
// iaai: response for IAAI endpoint
// bidcars: response for BidCars endpoint
function mockFetch({
  copartSearch = { ok: true, json: async () => COPART_SEARCH_EMPTY },
  copartDetail = null as null | { ok: boolean; json: () => Promise<unknown> },
  iaai = { ok: true, json: async () => IAAI_EMPTY },
  bidcars = { ok: true, json: async () => BIDCARS_EMPTY },
}: {
  copartSearch?: { ok: boolean; json: () => Promise<unknown> }
  copartDetail?: { ok: boolean; json: () => Promise<unknown> } | null
  iaai?: { ok: boolean; json: () => Promise<unknown> }
  bidcars?: { ok: boolean; json: () => Promise<unknown> }
}) {
  global.fetch = jest.fn((url: string, opts?: RequestInit) => {
    const u = String(url)
    if (u.includes('copart.com/public/lots/search-results')) return Promise.resolve(copartSearch)
    if (u.includes('copart.com/public/lot/')) return Promise.resolve(copartDetail ?? { ok: false, json: async () => ({}) })
    if (u.includes('iaai.com')) return Promise.resolve(iaai)
    if (u.includes('bidcars.com')) return Promise.resolve(bidcars)
    return Promise.reject(new Error('unmocked url: ' + u))
  }) as jest.Mock
}

beforeEach(() => {
  jest.resetAllMocks()
  global.fetch = jest.fn()
})

describe('GET /api/vin-lookup', () => {
  test('returns 400 for invalid VIN', async () => {
    const res = await GET(makeReq('SHORT'))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('invalid_vin')
  })

  test('returns Copart result when Copart finds the VIN first', async () => {
    mockFetch({
      copartSearch: { ok: true, json: async () => COPART_SEARCH_FOUND },
      copartDetail: { ok: true, json: async () => COPART_DETAIL },
      iaai: { ok: true, json: async () => IAAI_FOUND },
      bidcars: { ok: true, json: async () => BIDCARS_FOUND },
    })

    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.source).toBe('copart')
    expect(json.year).toBe(2019)
    expect(json.engineLiters).toBe(2.0)
    expect(json.fuelType).toBe('gas')
    expect(json.priceUSD).toBe(8500)
    expect(json.location).toBe('Houston - TX')
    expect(json.lotNumber).toBe(11111111)
  })

  test('falls back to IAAI when Copart returns empty', async () => {
    mockFetch({
      copartSearch: { ok: true, json: async () => COPART_SEARCH_EMPTY },
      iaai: { ok: true, json: async () => IAAI_FOUND },
      bidcars: { ok: true, json: async () => BIDCARS_FOUND },
    })

    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.source).toBe('iaai')
    expect(json.year).toBe(2020)
    expect(json.engineLiters).toBe(2.0)
    expect(json.fuelType).toBe('gas')
    expect(json.priceUSD).toBe(9000)
    expect(json.location).toBe('Dallas - TX')
    expect(json.lotNumber).toBe(22222222)
  })

  test('falls back to BidCars when Copart and IAAI return empty', async () => {
    mockFetch({
      copartSearch: { ok: true, json: async () => COPART_SEARCH_EMPTY },
      iaai: { ok: true, json: async () => IAAI_EMPTY },
      bidcars: { ok: true, json: async () => BIDCARS_FOUND },
    })

    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.source).toBe('bidcars')
    expect(json.year).toBe(2018)
    expect(json.engineLiters).toBe(1.5)
    expect(json.priceUSD).toBe(6500)
    expect(json.location).toBe('Atlanta - GA')
    expect(json.lotNumber).toBe('33333333')
  })

  test('returns 404 when all three return empty', async () => {
    mockFetch({})  // all default to empty

    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toBe('not_found')
  })

  test('returns 502 when all three fail with network errors', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network error'))

    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(502)
    const json = await res.json()
    expect(json.error).toBe('unavailable')
  })

  test('succeeds when only BidCars works (others throw)', async () => {
    global.fetch = jest.fn((url: string) => {
      const u = String(url)
      if (u.includes('bidcars.com')) return Promise.resolve({ ok: true, json: async () => BIDCARS_FOUND })
      return Promise.reject(new Error('timeout'))
    }) as jest.Mock

    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.source).toBe('bidcars')
  })

  test('Copart two-step fetch: uses detail endpoint with lotId from search', async () => {
    mockFetch({
      copartSearch: { ok: true, json: async () => COPART_SEARCH_FOUND },
      copartDetail: { ok: true, json: async () => COPART_DETAIL },
    })

    await GET(makeReq(VALID_VIN))

    const calls = (global.fetch as jest.Mock).mock.calls
    const detailCall = calls.find((c: unknown[]) => String(c[0]).includes('/public/lot/11111111/detail'))
    expect(detailCall).toBeDefined()
  })
})
