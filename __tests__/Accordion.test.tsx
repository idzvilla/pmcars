// __tests__/Accordion.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Accordion from '@/components/ui/Accordion'

const items = [
  { question: 'Сколько стоит доставка?', answer: 'От 990 BYN.' },
  { question: 'Какие сроки?', answer: '2–3 месяца.' },
]

test('renders all questions', () => {
  render(<Accordion items={items} />)
  expect(screen.getByText('Сколько стоит доставка?')).toBeInTheDocument()
  expect(screen.getByText('Какие сроки?')).toBeInTheDocument()
})

test('answer hidden by default', () => {
  render(<Accordion items={items} />)
  const answerDiv = screen.getByText('От 990 BYN.').closest('[aria-hidden]')
  expect(answerDiv).toHaveAttribute('aria-hidden', 'true')
})

test('clicking question shows answer', () => {
  render(<Accordion items={items} />)
  fireEvent.click(screen.getByText('Сколько стоит доставка?'))
  const answerDiv = screen.getByText('От 990 BYN.').closest('[aria-hidden]')
  expect(answerDiv).toHaveAttribute('aria-hidden', 'false')
})

test('clicking open question closes it', () => {
  render(<Accordion items={items} />)
  fireEvent.click(screen.getByText('Сколько стоит доставка?'))
  fireEvent.click(screen.getByText('Сколько стоит доставка?'))
  const answerDiv = screen.getByText('От 990 BYN.').closest('[aria-hidden]')
  expect(answerDiv).toHaveAttribute('aria-hidden', 'true')
})
