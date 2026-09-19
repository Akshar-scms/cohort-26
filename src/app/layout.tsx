import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Placement Hub - MCA '26 | Nirma University",
  description: "Centralized Placement & Mentoring Hub for MCA '26 Batch, Nirma University",
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`dark ${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}
      >
        <body
          suppressHydrationWarning
          className="min-h-full bg-[#0A0A0B] text-[#EDEDEF] flex flex-col font-sans"
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}