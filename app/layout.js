import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import siteConfig from '@/config/site'
import MotionProvider from '@/components/MotionProvider'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111110',
}

export const metadata = {
  title: `${siteConfig.businessName} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.seo.author }],
  openGraph: {
    title: `${siteConfig.businessName} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.businessName,
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <MotionProvider>
          <Navbar />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </MotionProvider>
      </body>
    </html>
  )
}

