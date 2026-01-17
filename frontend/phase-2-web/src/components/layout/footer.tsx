'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-4 font-semibold text-slate-900">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900">Connect</h4>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-600 transition-colors hover:text-slate-900">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-600 transition-colors hover:text-slate-900">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-600 transition-colors hover:text-slate-900">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-600 transition-colors hover:text-slate-900">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 text-center">
          <p className="text-sm text-slate-600">
            © 2026 Evolution. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
