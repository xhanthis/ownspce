'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Button from '@/components/ui/Button'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (session?.user?.theme as 'dark' | 'light') ?? 'dark'
  )
  const [driveToast, setDriveToast] = useState(false)

  async function toggleTheme() {
    const next: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    await fetch('/api/user/theme', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: next }),
    })
    // Update session + toggle html class
    await update({ theme: next })
    document.documentElement.classList.toggle('dark', next === 'dark')
    document.documentElement.classList.toggle('light', next === 'light')
  }

  function showDriveToast() {
    setDriveToast(true)
    setTimeout(() => setDriveToast(false), 3000)
  }

  return (
    <div className="p-8 max-w-lg mx-auto fade-in">
      <h1 className="text-xl font-semibold mb-8">Profile</h1>

      {session?.user && (
        <div className="mb-6 px-4 py-3 rounded-card bg-[#F2F2F2] dark:bg-zinc-900 border border-[#E0E0E0] dark:border-zinc-800">
          <p className="text-sm font-medium">{session.user.name}</p>
        </div>
      )}

      {/* Theme toggle */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold mb-3">Appearance</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-[#E0E0E0]'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
        </div>
      </section>

      {/* Drive */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold mb-3">Storage</h2>
        <div className="flex items-center justify-between p-4 rounded-card border border-[#E0E0E0] dark:border-zinc-800">
          <div>
            <p className="text-sm font-medium">Google Drive</p>
            <p className="text-xs text-zinc-400 mt-0.5">Currently using local storage</p>
          </div>
          <Button variant="ghost" size="sm" onClick={showDriveToast}>Connect</Button>
        </div>
        {driveToast && (
          <div className="mt-2 px-3 py-2 rounded-input bg-zinc-900 dark:bg-white text-white dark:text-[#0A0A0A] text-xs fade-in">
            Google Drive integration coming soon
          </div>
        )}
      </section>

      {/* Sign out */}
      <Button variant="danger" onClick={() => signOut({ callbackUrl: '/login' })}>
        Sign out
      </Button>
    </div>
  )
}
