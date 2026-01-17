'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-500 opacity-3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center space-y-12 animate-slide-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37] bg-[#D4AF37] bg-opacity-10">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
          <span className="text-sm text-[#D4AF37] font-semibold uppercase tracking-wider">
            Welcome to Excellence
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="gold-text">Evolution</span>
            <br />
            <span className="text-[#E0E0E0]">of Productivity</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#999] max-w-2xl mx-auto leading-relaxed">
            Elevate your task management game with premium features designed for professionals. 
            Organize, prioritize, and conquer your goals with unparalleled elegance.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          {/* Primary Button */}
          <Link
            href="/register"
            className="luxury-btn group px-8 py-4 rounded-xl text-base uppercase tracking-wider font-bold flex items-center gap-3 relative overflow-hidden w-full sm:w-auto justify-center"
          >
            <span className="relative z-10">Get Started Free</span>
            <span className="group-hover:translate-x-1 transition-transform relative z-10">→</span>
          </Link>

          {/* Secondary Button */}
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl text-base uppercase tracking-wider font-bold border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-all duration-300 flex items-center justify-center gap-3 group w-full sm:w-auto"
          >
            <span>Sign In</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 pt-16 pb-16">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Instant task creation and management' },
            { icon: '🔐', title: 'Secure & Safe', desc: 'Military-grade encryption for peace' },
            { icon: '📊', title: 'Smart Analytics', desc: 'Track productivity with insights' },
          ].map((feature, index) => (
            <div
              key={index}
              className="luxury-card p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300 cursor-pointer group"
            >
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[#D4AF37] mb-3">{feature.title}</h3>
              <p className="text-[#999] text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="pt-8 space-y-6 border-t border-[#333]">
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#D4AF37]">10K+</p>
              <p className="text-[#999] text-sm">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#D4AF37]">500K+</p>
              <p className="text-[#999] text-sm">Tasks Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#D4AF37]">99.9%</p>
              <p className="text-[#999] text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-5xl opacity-10 animate-bounce">📝</div>
      <div className="absolute bottom-32 right-10 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}>✓</div>
    </section>
  )
}
