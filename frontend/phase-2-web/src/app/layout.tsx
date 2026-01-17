import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Evolution Todo - Professional Task Management',
  description: 'Production-grade full-stack todo application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
