'use client'

import { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={ref}
        className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-900 rounded-card border border-[#E0E0E0] dark:border-zinc-700 shadow-xl fade-in"
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E0E0] dark:border-zinc-700">
            <h2 className="font-semibold text-sm">{title}</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-[#0A0A0A] dark:hover:text-white transition-colors text-lg leading-none">×</button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
