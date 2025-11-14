import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import StoreProvider from '@/store/provider'
import StoreInjector from './storeInjection'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'FitTrack - Gym Workout Progress Tracker',
  description:
    'Track your gym workouts and monitor your progress with FitTrack, the ultimate workout companion app.',
  icons: {
    icon: '/fittrack-icon.png'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <StoreInjector />
          {children}
          <Toaster position="top-right" richColors />
        </StoreProvider>
      </body>
    </html>
  )
}
