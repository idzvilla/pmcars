// __tests__/protsess.test.tsx
import { render, screen } from '@testing-library/react'
import ProtsessPageClient from '@/app/protsess/ProtsessPageClient'

// Mock IntersectionObserver (отсутствует в jsdom)
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver
})

describe('ProtsessPageClient', () => {
  it('renders all 6 section headings', () => {
    render(<ProtsessPageClient />)
    // 'Процесс покупки' appears in both h1 and section h2, so use getAllByText
    expect(screen.getAllByText('Процесс покупки').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Как мы работаем')).toBeInTheDocument()
    expect(screen.getByText('Оплата и договор')).toBeInTheDocument()
    expect(screen.getByText('Доставка и растаможка')).toBeInTheDocument()
    expect(screen.getByText('Получение авто в РБ')).toBeInTheDocument()
    expect(screen.getByText('Полезная информация')).toBeInTheDocument()
  })

  it('renders sidebar navigation links', () => {
    render(<ProtsessPageClient />)
    const links = screen.getAllByRole('link', { name: /Как мы работаем/i })
    expect(links.length).toBeGreaterThanOrEqual(1)
  })
})
