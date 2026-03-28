'use client'

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-opacity disabled:opacity-50 rounded-input'
  const variants = {
    primary: 'bg-[#0A0A0A] text-white dark:bg-white dark:text-[#0A0A0A] hover:opacity-80',
    ghost: 'bg-transparent text-[#0A0A0A] dark:text-white hover:bg-[#F2F2F2] dark:hover:bg-zinc-800',
    danger: 'bg-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-950',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
