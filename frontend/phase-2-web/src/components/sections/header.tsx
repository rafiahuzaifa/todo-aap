'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function SaasHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">✓</span>
              </div>
              <span className="font-semibold text-slate-900">Evolution</span>
            </Link>
          </motion.div>

          {/* Nav */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden gap-8 sm:flex"
          >
            <Link href="/" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
              Dashboard
            </Link>
            <a href="#features" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
              Features
            </a>
          </motion.nav>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex gap-3"
          >
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
