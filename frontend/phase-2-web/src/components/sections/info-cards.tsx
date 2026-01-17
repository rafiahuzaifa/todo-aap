'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InfoCardProps {
  icon: LucideIcon
  title: string
  description: string
  variant?: 'default' | 'highlighted'
}

interface InfoCardsGridProps {
  title: string
  subtitle?: string
  cards: InfoCardProps[]
}

export function InfoCardBox({
  icon: Icon,
  title,
  description,
  variant = 'default',
}: InfoCardProps) {
  const boxClasses = cn(
    'rounded-lg border p-6 transition-all duration-300',
    variant === 'default' && 'border-slate-200 bg-white hover:shadow-md hover:border-slate-300',
    variant === 'highlighted' && 'border-blue-200 bg-blue-50 hover:shadow-lg hover:border-blue-300'
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={boxClasses}
    >
      <Icon className={cn(
        'mb-4 h-6 w-6',
        variant === 'default' && 'text-blue-600',
        variant === 'highlighted' && 'text-blue-700'
      )} />
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </motion.div>
  )
}

export function InfoCardsGrid({
  title,
  subtitle,
  cards,
}: InfoCardsGridProps) {
  return (
    <section className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <InfoCardBox {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
