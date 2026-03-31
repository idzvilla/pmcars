// __tests__/copart-vin-route.test.ts
import { GET } from '@/app/api/copart-vin/route'
import { NextRequest } from 'next/server'

const VALID_VIN = '1HGBH41JXMN109186'

function makeReq(vin: string) {
  return new NextRequest(`http://localhost/api/copart-vin?vin=${vin}`)
}

const MOCK_SEARCH_RESPONSE = {
  data: {
    results: {
      content: [{ ln: 87654321 }],
      totalElements: 1,
    },
  },
}

const MOCK_LOT_DETAIL = {
  data: {
    lot: {
      y: 2019,
      egn: '2000',   // engine in cc as string
      ft: 'GASOLINE',
      lbv: 8500,
      yn: 'Houston - TX',
      ln: 87654321,
    },
  },
}

beforeEach(() => {
  jest.resetAllMocks()
  global.fetch = jest.fn()
})

describe('GET /api/copart-vin', () => {
  test('returns 400 for short VIN', async () => {
    const res = await GET(makeReq('SHORT'))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('invalid_vin')
  })

  test('returns 400 for empty VIN', async () => {
    const res = await GET(makeReq(''))
    expect(res.status).toBe(400)
  })

  test('returns 404 when Copart search returns no results', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { results: { content: [], totalElements: 0 } } }),
    })
    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toBe('not_found')
  })

  test('returns 502 when Copart search fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network error'))
    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(502)
    const json = await res.json()
    expect(json.error).toBe('unavailable')
  })

  test('returns 502 when Copart returns non-ok', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 503 })
    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(502)
  })

  test('returns 502 when lot detail fetch fails', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_SEARCH_RESPONSE })
      .mockRejectedValueOnce(new Error('network error on detail'))
    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(502)
    const json = await res.json()
    expect(json.error).toBe('unavailable')
  })

  test('returns 502 when lot detail returns non-ok', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_SEARCH_RESPONSE })
      .mockResolvedValueOnce({ ok: false, status: 503 })
    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(502)
  })

  test('returns normalized lot data on success', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_SEARCH_RESPONSE })
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_LOT_DETAIL })

    const res = await GET(makeReq(VALID_VIN))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({
      year: 2019,
      engineLiters: 2.0,
      fuelType: 'gas',
      priceUSD: 8500,
      location: 'Houston - TX',
      lotNumber: 87654321,
    })
  })

  test('maps DIESEL fuel type correctly', async () => {
    const dieselDetail = { data: { lot: { ...MOCK_LOT_DETAIL.data.lot, ft: 'DIESEL' } } }
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_SEARCH_RESPONSE })
      .mockResolvedValueOnce({ ok: true, json: async () => dieselDetail })

    const res = await GET(makeReq(VALID_VIN))
    const json = await res.json()
    expect(json.fuelType).toBe('diesel')
  })

  test('maps HYBRID fuel type correctly', async () => {
    const hybridDetail = { data: { lot: { ...MOCK_LOT_DETAIL.data.lot, ft: 'HYBRID' } } }
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_SEARCH_RESPONSE })
      .mockResolvedValueOnce({ ok: true, json: async () => hybridDetail })

    const res = await GET(makeReq(VALID_VIN))
    const json = await res.json()
    expect(json.fuelType).toBe('hybrid')
  })

  test('maps ELECTRIC fuel type correctly', async () => {
    const evDetail = { data: { lot: { ...MOCK_LOT_DETAIL.data.lot, ft: 'ELECTRIC' } } }
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_SEARCH_RESPONSE })
      .mockResolvedValueOnce({ ok: true, json: async () => evDetail })

    const res = await GET(makeReq(VALID_VIN))
    const json = await res.json()
    expect(json.fuelType).toBe('electric')
  })

  test('falls back to gas for unknown fuel type', async () => {
    const unknownDetail = { data: { lot: { ...MOCK_LOT_DETAIL.data.lot, ft: 'UNKNOWN_FUEL' } } }
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_SEARCH_RESPONSE })
      .mockResolvedValueOnce({ ok: true, json: async () => unknownDetail })

    const res = await GET(makeReq(VALID_VIN))
    const json = await res.json()
    expect(json.fuelType).toBe('gas')
  })
})
