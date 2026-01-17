'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-bold text-white">✓</span>
          </div>
          <span className="text-xl font-semibold text-slate-900">Evolution</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
