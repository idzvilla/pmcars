// src/components/ui/Button.tsx
import { ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'outline'
  href?: string
  size?: 'sm' | 'md' | 'lg'
}

const base = 'inline-flex items-center justify-center font-montserrat font-bold rounded transition-colors'
const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
}
const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls} {...props}>{children}</button>
}
