// __tests__/copart-vin-block.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import KalkulyatorRashodPage from '@/app/info/kalkulyator-rashod/page'

const MOCK_SUCCESS = {
  year: 2019,
  engineLiters: 2.0,
  fuelType: 'gas',
  priceUSD: 8500,
  location: 'Houston - TX',
  lotNumber: 87654321,
  source: 'copart',
}

beforeEach(() => {
  global.fetch = jest.fn((url: string) => {
    if (String(url).includes('nbrb')) {
      return Promise.resolve({ json: async () => ({ Cur_OfficialRate: 3.0 }) })
    }
    return Promise.reject(new Error('unmocked fetch: ' + url))
  }) as jest.Mock
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('VIN lookup block', () => {
  test('renders VIN input and find button', () => {
    render(<KalkulyatorRashodPage />)
    expect(screen.getByPlaceholderText(/vin/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /найти/i })).toBeInTheDocument()
  })

  test('find button is disabled when VIN input is empty', () => {
    render(<KalkulyatorRashodPage />)
    expect(screen.getByRole('button', { name: /найти/i })).toBeDisabled()
  })

  test('find button is enabled when 17-char VIN is entered', () => {
    render(<KalkulyatorRashodPage />)
    fireEvent.change(screen.getByPlaceholderText(/vin/i), {
      target: { value: '1HGBH41JXMN109186' },
    })
    expect(screen.getByRole('button', { name: /найти/i })).not.toBeDisabled()
  })

  test('shows loading state while fetching', async () => {
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (String(url).includes('nbrb')) {
        return Promise.resolve({ json: async () => ({ Cur_OfficialRate: 3.0 }) })
      }
      return new Promise(() => {})
    })

    render(<KalkulyatorRashodPage />)
    fireEvent.change(screen.getByPlaceholderText(/vin/i), {
      target: { value: '1HGBH41JXMN109186' },
    })
    fireEvent.click(screen.getByRole('button', { name: /найти/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /найти/i })).toBeDisabled()
    })
  })

  test('shows error message when VIN not found', async () => {
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (String(url).includes('nbrb')) {
        return Promise.resolve({ json: async () => ({ Cur_OfficialRate: 3.0 }) })
      }
      if (String(url).includes('vin-lookup')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ error: 'not_found' }),
        })
      }
      return Promise.reject(new Error('unmocked'))
    })

    render(<KalkulyatorRashodPage />)
    fireEvent.change(screen.getByPlaceholderText(/vin/i), {
      target: { value: '1HGBH41JXMN109186' },
    })
    fireEvent.click(screen.getByRole('button', { name: /найти/i }))

    await waitFor(() => {
      expect(screen.getByText(/не найден/i)).toBeInTheDocument()
    })
  })

  test('fills price field on successful lookup', async () => {
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (String(url).includes('nbrb')) {
        return Promise.resolve({ json: async () => ({ Cur_OfficialRate: 3.0 }) })
      }
      if (String(url).includes('vin-lookup')) {
        return Promise.resolve({ ok: true, json: async () => MOCK_SUCCESS })
      }
      return Promise.reject(new Error('unmocked'))
    })

    render(<KalkulyatorRashodPage />)
    fireEvent.change(screen.getByPlaceholderText(/vin/i), {
      target: { value: '1HGBH41JXMN109186' },
    })
    fireEvent.click(screen.getByRole('button', { name: /найти/i }))

    await waitFor(() => {
      const priceInput = screen.getByPlaceholderText('15000') as HTMLInputElement
      expect(priceInput.value).toBe('8500')
    })
  })

  test('shows success message with source name', async () => {
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (String(url).includes('nbrb')) {
        return Promise.resolve({ json: async () => ({ Cur_OfficialRate: 3.0 }) })
      }
      if (String(url).includes('vin-lookup')) {
        return Promise.resolve({ ok: true, json: async () => MOCK_SUCCESS })
      }
      return Promise.reject(new Error('unmocked'))
    })

    render(<KalkulyatorRashodPage />)
    fireEvent.change(screen.getByPlaceholderText(/vin/i), {
      target: { value: '1HGBH41JXMN109186' },
    })
    fireEvent.click(screen.getByRole('button', { name: /найти/i }))

    await waitFor(() => {
      expect(screen.getByText(/данные загружены/i)).toBeInTheDocument()
      expect(screen.getAllByText(/COPART/i).length).toBeGreaterThan(0)
    })
  })

  test('shows IAAI as source when result comes from IAAI', async () => {
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (String(url).includes('nbrb')) {
        return Promise.resolve({ json: async () => ({ Cur_OfficialRate: 3.0 }) })
      }
      if (String(url).includes('vin-lookup')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ ...MOCK_SUCCESS, source: 'iaai' }),
        })
      }
      return Promise.reject(new Error('unmocked'))
    })

    render(<KalkulyatorRashodPage />)
    fireEvent.change(screen.getByPlaceholderText(/vin/i), {
      target: { value: '1HGBH41JXMN109186' },
    })
    fireEvent.click(screen.getByRole('button', { name: /найти/i }))

    await waitFor(() => {
      expect(screen.getByText(/IAAI/i)).toBeInTheDocument()
    })
  })
})
