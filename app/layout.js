import './globals.css'
import { Inter } from 'next/font/google'
// Import Client Provider if you use one, otherwise ignore
import SessionProvider from '@/components/SessionProvider'; 

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AppBuild AI',
  description: 'Build Android Apps with AI',
}

// CRITICAL: This fixes the "Desktop View" on mobile devices
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}