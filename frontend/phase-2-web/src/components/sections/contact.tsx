'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import React, { useState } from 'react'

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@evolution.com',
      href: 'mailto:hello@evolution.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA',
      href: '#',
    },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(r => setTimeout(r, 1500))
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', phone: '', message: '' })
    setIsSubmitting(false)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 px-4 py-24 sm:py-32">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(90deg, rgba(59, 130, 246, .1) 1px, transparent 1px), linear-gradient(rgba(59, 130, 246, .1) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900 font-poppins sm:text-5xl">
            Get in Touch
          </h2>
          <p className="text-lg text-slate-600 font-poppins">
            Have questions? We're here to help.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info Cards - Glass Effect */}
          <div className="grid gap-6 sm:grid-cols-1">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon
              return (
                <motion.a
                  key={idx}
                  href={method.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl border border-blue-200/30 bg-white/20 backdrop-blur-xl p-6 shadow-lg transition-all hover:shadow-2xl hover:bg-white/40"
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-400/5 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 font-poppins">
                      {method.label}
                    </h3>
                    <p className="text-slate-600 font-poppins group-hover:text-slate-900 transition-colors">
                      {method.value}
                    </p>
                  </div>
                </motion.a>
              )
            })}
          </div>

          {/* Contact Form - Glass Effect */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-blue-200/30 bg-white/20 backdrop-blur-xl p-8 shadow-2xl"
          >
            {/* Form Grid */}
            <div className="space-y-6">
              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <label className="mb-2 block text-sm font-semibold text-slate-900 font-poppins">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-blue-200/30 bg-white/30 px-4 py-3 text-slate-900 placeholder-slate-500 backdrop-blur-xl transition-all focus:border-blue-400/50 focus:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-poppins"
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <label className="mb-2 block text-sm font-semibold text-slate-900 font-poppins">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-blue-200/30 bg-white/30 px-4 py-3 text-slate-900 placeholder-slate-500 backdrop-blur-xl transition-all focus:border-blue-400/50 focus:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-poppins"
                />
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <label className="mb-2 block text-sm font-semibold text-slate-900 font-poppins">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-blue-200/30 bg-white/30 px-4 py-3 text-slate-900 placeholder-slate-500 backdrop-blur-xl transition-all focus:border-blue-400/50 focus:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-poppins"
                />
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <label className="mb-2 block text-sm font-semibold text-slate-900 font-poppins">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us about your project..."
                  className="w-full rounded-xl border border-blue-200/30 bg-white/30 px-4 py-3 text-slate-900 placeholder-slate-500 backdrop-blur-xl transition-all focus:border-blue-400/50 focus:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-poppins resize-none"
                />
              </motion.div>

              {/* Submit Button - 3D Effect */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                viewport={{ once: true }}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-poppins"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span> Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
