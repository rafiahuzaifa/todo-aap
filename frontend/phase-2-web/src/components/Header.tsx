'use client'

import { useAuthStore } from '@/lib/store'
import Link from 'next/link'

export default function Header() {
  const { isLoggedIn, user } = useAuthStore()

  return (
    <header className="bg-gradient-to-r from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] border-b-2 border-[#D4AF37] shadow-2xl sticky top-0 z-50 backdrop-filter backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-4xl group-hover:scale-110 transition-transform">✨</span>
          <h1 className="text-3xl font-bold gold-text hover:text-[#F4E4C1] transition-all">Evolution</h1>
        </Link>
        <nav className="space-x-8 flex items-center">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#999] uppercase tracking-wider">Welcome</span>
                <span className="text-sm text-[#D4AF37] font-bold">{user?.name || 'User'}</span>
              </div>
              <Link href="/dashboard" className="text-[#E0E0E0] hover:text-[#D4AF37] transition-colors font-medium text-sm uppercase tracking-wider">
                Dashboard
              </Link>
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/' }} 
                className="text-[#E0E0E0] hover:text-red-400 transition-colors font-medium text-sm uppercase tracking-wider"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[#E0E0E0] hover:text-[#D4AF37] transition-colors font-medium text-sm uppercase tracking-wider">
                Login
              </Link>
              <Link href="/register" className="luxury-btn px-6 py-2 rounded-lg text-sm uppercase tracking-wider">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
