'use client'
import { useState, useRef, useEffect } from 'react'

interface ComboboxProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function Combobox({ options, value, onChange, placeholder = 'Выберите...', className = '' }: ComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync display text with selected value
  useEffect(() => {
    if (!open) setQuery(value)
  }, [value, open])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery(value)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [value])

  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase())).slice(0, 50)
    : options.slice(0, 50)

  function handleSelect(option: string) {
    onChange(option)
    setQuery(option)
    setOpen(false)
  }

  const inputBase = `w-full px-4 py-3 rounded-lg border font-montserrat text-sm focus:outline-none bg-white ${className}`

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={open ? query : value}
        placeholder={placeholder}
        className={`${inputBase} ${open ? 'border-primary' : 'border-gray-200'}`}
        onFocus={() => { setOpen(true); setQuery('') }}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setQuery(value) } }}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.map(option => (
            <li key={option}>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm font-montserrat hover:bg-light-bg transition-colors"
                onMouseDown={() => handleSelect(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm font-montserrat text-muted">
          Не найдено
        </div>
      )}
    </div>
  )
}
