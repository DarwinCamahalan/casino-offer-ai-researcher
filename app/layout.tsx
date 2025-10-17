/**
 * Root Layout - Modern Dashboard Layout with Sidebar
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { ReactQueryProvider } from '@/lib/providers/react-query-provider'
import { ThemeProvider } from '@/lib/providers/theme-provider'
import Sidebar from './_components/Sidebar'
import Footer from './_components/Footer'
import SplashScreen from './_components/SplashScreen'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Casino Offer AI Researcher',
  description: 'AI-powered casino and promotional offer discovery system for NJ, MI, PA, and WV',
  keywords: ['casino', 'offers', 'AI', 'research', 'promotions'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ReactQueryProvider>
            {/* Splash Screen */}
            <SplashScreen />
            
            <div className="flex min-h-screen bg-background">
              {/* Sidebar */}
              <Sidebar />
              
              {/* Main Content Area */}
              <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                <main className="flex-1 p-4 md:p-8">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
