import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Anonymous Funding - Help Me Make This Possible',
  description: 'A confidential campaign seeking support. Every contribution brings me closer to my goal.',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕊</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕊️</text></svg>" />
      </head>
      <body className={`${inter.className} antialiased bg-white`} suppressHydrationWarning={true}>
        {children}
        <footer className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()} Anonymous Initiative. All hearts welcome.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}