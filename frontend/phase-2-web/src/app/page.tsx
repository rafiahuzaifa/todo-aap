import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, Zap, BarChart3, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              <span className="text-sm font-medium text-blue-700">New: Real-time collaboration</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Task management that
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                scales with you
              </span>
            </h1>

            <p className="mb-8 text-lg text-slate-600">
              The simplest way to manage tasks, collaborate with teams, and track progress. Built for modern teams.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              No credit card required • 30-day free trial
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-900">
                Everything you need
              </h2>
              <p className="text-lg text-slate-600">
                Powerful features designed to help you work smarter
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={CheckCircle2}
                title="Smart Task Management"
                description="Create, organize, and track tasks with intelligent prioritization"
              />
              <FeatureCard
                icon={Clock}
                title="Real-time Sync"
                description="All changes sync instantly across all your devices"
              />
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                description="Built for speed with instant search and filtering"
              />
              <FeatureCard
                icon={BarChart3}
                title="Analytics"
                description="Track productivity with detailed insights and reports"
              />
              <FeatureCard
                icon={Shield}
                title="Secure"
                description="Enterprise-grade security with end-to-end encryption"
              />
              <FeatureCard
                icon={Users}
                title="Collaboration"
                description="Work together seamlessly with your team"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-slate-200 bg-slate-900 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              Ready to get productive?
            </h2>
            <p className="mb-8 text-lg text-slate-300">
              Join thousands of teams that trust Evolution for their task management.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Card>
      <CardHeader>
        <Icon className="mb-3 h-8 w-8 text-blue-600" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
