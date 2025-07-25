import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: {
    default: 'CinemaHub - Professional Movie Discovery Platform',
    template: '%s | CinemaHub'
  },
  description: 'Discover, rate, and track your favorite movies with our professional movie platform. Browse trending films, create watchlists, and join the ultimate movie community.',
  keywords: ['movies', 'cinema', 'reviews', 'ratings', 'watchlist', 'film', 'entertainment', 'streaming'],
  authors: [{ name: 'CinemaHub Team', url: 'https://cinemahub.com' }],
  creator: 'CinemaHub Team',
  publisher: 'CinemaHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'CinemaHub - Professional Movie Discovery Platform',
    description: 'Discover, rate, and track your favorite movies with our professional movie platform',
    type: 'website',
    locale: 'en_US',
    url: 'https://cinemahub.com',
    siteName: 'CinemaHub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CinemaHub - Movie Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CinemaHub - Professional Movie Discovery Platform',
    description: 'Discover, rate, and track your favorite movies',
    creator: '@cinemahub',
    images: ['/twitter-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFD700" />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen bg-gray-950 dark:bg-gray-950 light:bg-gray-50 text-white dark:text-white light:text-gray-900 transition-colors duration-300">
              <NavBar />
              <main className="flex-1 relative">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'dark:bg-gray-800 dark:text-white',
                style: {
                  background: '#1F2937',
                  color: '#F9FAFB',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: {
                    primary: '#FFD700',
                    secondary: '#000',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFF',
                  },
                },
              }}
            />
        </Providers>
      </body>
    </html>
  )
}
