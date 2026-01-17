'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-t from-[#0F0F0F] to-[#1a1a1a] border-t-2 border-[#D4AF37] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✨</span>
              <h3 className="text-2xl font-bold gold-text">Evolution</h3>
            </div>
            <p className="text-[#999] text-sm leading-relaxed">
              Your premium task management solution for productivity and success.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-[#D4AF37] bg-opacity-10 border border-[#D4AF37] flex items-center justify-center hover:bg-opacity-20 transition-all text-[#D4AF37]">
                f
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[#D4AF37] bg-opacity-10 border border-[#D4AF37] flex items-center justify-center hover:bg-opacity-20 transition-all text-[#D4AF37]">
                𝕏
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[#D4AF37] bg-opacity-10 border border-[#D4AF37] flex items-center justify-center hover:bg-opacity-20 transition-all text-[#D4AF37]">
                in
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-bold text-[#D4AF37] mb-6 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold text-[#D4AF37] mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-bold text-[#D4AF37] mb-6 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#999] hover:text-[#D4AF37] transition-colors text-sm">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#666] text-sm">
            © {currentYear} Evolution Todo. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[#D4AF37] text-xs uppercase tracking-wider font-semibold">Premium. Professional. Productive.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
