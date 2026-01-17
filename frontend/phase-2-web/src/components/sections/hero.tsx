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
    default: 'bg-white',
    gradient: 'bg-gradient-to-br from-blue-50 to-white',
    pattern: 'bg-white',
  }

  return (
    <section className={cn('relative overflow-hidden px-4 py-24 sm:py-32 lg:py-40', backgroundClasses[backgroundVariant])}>
      {/* Grid Pattern Background */}
      {backgroundVariant === 'pattern' && (
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(90deg, rgba(59, 130, 246, .1) 1px, transparent 1px), linear-gradient(rgba(59, 130, 246, .1) 1px, transparent 1px)',
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
          {/* Badge - Glass Effect */}
          <div className="mb-6 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-white/20 backdrop-blur-xl px-4 py-2 shadow-xl"
            >
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-sm font-medium text-blue-700 font-poppins">{subtitle}</span>
            </motion.div>
          </div>

          {/* Heading - 3D Motion */}
          <motion.h1 
            initial={{ opacity: 0, rotateX: 20, y: 20 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl font-poppins"
            style={{ perspective: 1000 }}
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto mb-12 max-w-2xl text-xl text-slate-600 font-poppins"
            >
              {description}
            </motion.p>
          )}

          {/* CTAs - Glass Effect with 3D */}
          {(primaryCTA || secondaryCTA) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              {primaryCTA && (
                <motion.a
                  href={primaryCTA.href}
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white transition-all shadow-lg hover:shadow-2xl backdrop-blur-sm border border-blue-400/30 font-poppins"
                >
                  {primaryCTA.text}
                </motion.a>
              )}
              {secondaryCTA && (
                <motion.a
                  href={secondaryCTA.href}
                  whileHover={{ scale: 1.05, rotateY: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center rounded-xl border border-blue-300/50 bg-white/20 backdrop-blur-xl px-8 py-3 font-semibold text-slate-900 transition-all shadow-lg hover:shadow-2xl hover:bg-white/30 font-poppins"
                >
                  {secondaryCTA.text}
                </motion.a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
