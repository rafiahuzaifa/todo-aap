'use client'

import { SaasHeader } from '@/components/sections/header'
import { Hero } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/sections/features'
import { SaasFooter } from '@/components/sections/footer'
import { ContactSection } from '@/components/sections/contact'
import { motion } from 'framer-motion'
import {
  Zap,
  BarChart3,
  Shield,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export default function Home() {
  const infoCards = [
    {
      icon: CheckCircle2,
      title: 'Smart Task Management',
      description: 'Organize tasks with intelligent prioritization and filtering',
    },
    {
      icon: Clock,
      title: 'Real-time Sync',
      description: 'Instant synchronization across all your devices',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for speed with instant search and navigation',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track productivity with detailed insights',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'End-to-end encryption and compliance',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless teamwork with real-time updates',
    },
  ]

  const features = [
    {
      icon: CheckCircle2,
      title: 'Intelligent Task Prioritization',
      description:
        'Our AI-powered system automatically prioritizes your tasks based on deadlines, dependencies, and importance. Stay focused on what matters most.',
      features: [
        'Auto-prioritization with AI',
        'Deadline tracking',
        'Dependency management',
        'Smart reminders',
      ],
    },
    {
      icon: Users,
      title: 'Collaborative Workflows',
      description:
        'Work together seamlessly with your team. Assign tasks, leave comments, and track progress in real-time.',
      features: [
        'Team assignments',
        'Comment threads',
        'Activity feeds',
        'Shared workspaces',
      ],
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description:
        'Gain insights into your productivity patterns. Track completion rates, bottlenecks, and team performance.',
      features: [
        'Performance metrics',
        'Trend analysis',
        'Team dashboards',
        'Custom reports',
      ],
    },
  ]

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Security', href: '#security' },
        { label: 'Roadmap', href: '#roadmap' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Careers', href: '#careers' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#privacy' },
        { label: 'Terms', href: '#terms' },
        { label: 'Cookie Policy', href: '#cookies' },
        { label: 'Compliance', href: '#compliance' },
      ],
    },
  ]

  return (
    <div className="bg-white">
      <SaasHeader />

      {/* Hero */}
      <Hero
        title="Task management built for teams"
        subtitle="Introducing Evolution"
        description="Collaborate smarter. Execute faster. Ship more. Experience the difference with Evolution's professional-grade task management platform."
        primaryCTA={{ text: 'Get Started Free', href: '/register' }}
        secondaryCTA={{ text: 'View Demo', href: '#demo' }}
        backgroundVariant="default"
      />

      {/* Info Cards Grid - Glass Effect */}
      <section className="bg-white px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-4 text-4xl font-bold text-slate-900 font-poppins sm:text-5xl"
            >
              Everything you need
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-slate-600 font-poppins"
            >
              Powerful features designed for productivity
            </motion.p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infoCards.map((card, idx) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, rotateX: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  viewport={{ once: true }}
                  className="group relative rounded-2xl border border-blue-200/30 bg-gradient-to-br from-white/40 to-blue-50/40 backdrop-blur-xl p-8 shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  
                  <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900 font-poppins">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 font-poppins group-hover:text-slate-900 transition-colors">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <FeaturesSection
        title="How it works"
        subtitle="Built for modern workflows"
        features={features}
      />

      {/* Contact Section */}
      <ContactSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white font-poppins sm:text-5xl">
            Ready to transform your workflow?
          </h2>
          <p className="mb-8 text-lg text-blue-100 font-poppins">
            Join thousands of teams that trust Evolution for their task management.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/register"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50 font-poppins"
            >
              Start Free Trial
            </a>
            <a
              href="#contact"
              className="rounded-lg border border-white bg-transparent px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:bg-opacity-10 font-poppins"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SaasFooter sections={footerSections} />
    </div>
  )
}
