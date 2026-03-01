import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portfolio | Accounting Professional',
  description: 'Professional portfolio for accounting student — Financial Report, Tax & Audit.',
  keywords: ['accounting', 'portfolio', 'financial report', 'tax', 'audit'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}