'use client'

import { SaasHeader } from '@/components/sections/header'
import { Hero } from '@/components/sections/hero'
import { InfoCardsGrid } from '@/components/sections/info-cards'
import { FeaturesSection } from '@/components/sections/features'
import { SaasFooter } from '@/components/sections/footer'
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
        backgroundVariant="gradient"
      />

      {/* Info Cards */}
      <InfoCardsGrid
        title="Everything you need"
        subtitle="Powerful features designed for productivity"
        cards={infoCards}
      />

      {/* Features */}
      <FeaturesSection
        title="How it works"
        subtitle="Built for modern workflows"
        features={features}
      />

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-semibold text-slate-900 sm:text-5xl">
            Ready to transform your workflow?
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Join thousands of teams that trust Evolution for their task management.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/register"
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Start Free Trial
            </a>
            <a
              href="#contact"
              className="rounded-lg border border-blue-300 bg-white px-8 py-3 font-semibold text-slate-900 transition-colors hover:bg-blue-50"
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
