import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Layout } from '@/components/layout/layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TIANyu - Project Management Platform',
  description: 'A modern project management platform built with Next.js 14',
  keywords: ['project management', 'team collaboration', 'task tracking'],
  authors: [{ name: 'TIANyu Team' }],
  openGraph: {
    title: 'TIANyu - Project Management Platform',
    description: 'Manage your projects effectively with TIANyu',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
