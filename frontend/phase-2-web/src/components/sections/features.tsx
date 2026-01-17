'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureRowProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  image?: React.ReactNode
  reverse?: boolean
}

export function FeatureRow({
  icon: Icon,
  title,
  description,
  features,
  image,
  reverse = false,
}: FeatureRowProps) {
  const containerOrder = reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={cn('flex flex-col gap-12', containerOrder)}
    >
      {/* Content */}
      <div className="flex flex-1 flex-col justify-center">
        <Icon className="mb-4 h-8 w-8 text-blue-600" />
        <h3 className="mb-4 text-3xl font-semibold text-slate-900">
          {title}
        </h3>
        <p className="mb-8 text-lg text-slate-600">
          {description}
        </p>

        {/* Features List */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-slate-700"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Image/Visual */}
      {image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 p-8"
        >
          {image}
        </motion.div>
      )}
    </motion.div>
  )
}

interface FeaturesGridProps {
  title: string
  subtitle?: string
  features: FeatureRowProps[]
}

export function FeaturesSection({
  title,
  subtitle,
  features,
}: FeaturesGridProps) {
  return (
    <section className="bg-white px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
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

        {/* Features */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <FeatureRow
              key={index}
              {...feature}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
