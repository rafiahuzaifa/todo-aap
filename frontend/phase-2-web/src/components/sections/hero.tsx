'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HeroProps {
  title: string
  subtitle: string
  description?: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  backgroundVariant?: 'default' | 'gradient' | 'pattern'
}

export function Hero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundVariant = 'default',
}: HeroProps) {
  const backgroundClasses = {
    default: 'bg-slate-50',
    gradient: 'bg-gradient-to-br from-slate-50 to-blue-50',
    pattern: 'bg-slate-50',
  }

  return (
    <section className={cn('relative overflow-hidden px-4 py-24 sm:py-32 lg:py-40', backgroundClasses[backgroundVariant])}>
      {/* Grid Pattern Background */}
      {backgroundVariant === 'pattern' && (
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      )}

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span className="text-sm font-medium text-slate-700">{subtitle}</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-600">
              {description}
            </p>
          )}

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              {primaryCTA && (
                <a
                  href={primaryCTA.href}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {primaryCTA.text}
                </a>
              )}
              {secondaryCTA && (
                <a
                  href={secondaryCTA.href}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  {secondaryCTA.text}
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
