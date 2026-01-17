'use client'

import { useAuth } from '@/hooks'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const { register, loading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(email, name, password)
      window.location.href = '/dashboard'
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F0F0F] to-[#1a1a1a] py-6 px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="luxury-card p-10 rounded-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-3 bg-gradient-to-br from-[#D4AF37] to-[#F4E4C1] rounded-lg mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-4xl font-bold gold-text mb-2">Join Evolution</h2>
            <p className="text-[#999] text-sm">Create your account to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-200 p-4 rounded-lg mb-6 animate-fade-in flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-semibold text-sm">Error</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="form-container">
            {/* Full Name Field */}
            <div className="form-group">
              <label className="form-label">👤 Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input-luxury w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">📧 Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-luxury w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">🔑 Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-luxury w-full px-4 py-3 border rounded-lg"
                required
              />
              <p className="form-hint">Minimum 8 characters recommended</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="luxury-btn w-full py-3 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            <span className="text-[#999] text-xs">ALREADY MEMBER?</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-[#999] text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-[#D4AF37] hover:text-[#F4E4C1] font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[#666] text-xs mt-6">
          Fast. Secure. Simple.
        </p>
      </div>
    </div>
  )
}
