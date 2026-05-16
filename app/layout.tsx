import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import type { Metadata } from 'next'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: {
    default: 'JEICO — Tienda Outdoor, Supervivencia y Hobbies',
    template: '%s | JEICO',
  },
  description:
    'Armas traumáticas, cuchillos, artículos de pesca, supervivencia y hobbies. Envíos a toda Colombia. Compra segura en JEICO.',
  keywords: [
    'armas traumáticas Colombia',
    'cuchillos tácticos',
    'artículos de pesca',
    'supervivencia',
    'outdoor Colombia',
    'tienda hobbies',
    'JEICO',
  ],
  metadataBase: new URL('https://jeico.store'),
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://jeico.store',
    siteName: 'JEICO',
    title: 'JEICO — Tienda Outdoor, Supervivencia y Hobbies',
    description:
      'Armas traumáticas, cuchillos, artículos de pesca, supervivencia y hobbies. Envíos a toda Colombia.',
    images: [
      {
        url: '/brand/jeico-logo-new.png',
        width: 800,
        height: 600,
        alt: 'JEICO Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEICO — Tienda Outdoor, Supervivencia y Hobbies',
    description:
      'Armas traumáticas, cuchillos, artículos de pesca, supervivencia y hobbies. Envíos a toda Colombia.',
    images: ['/brand/jeico-logo-new.png'],
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
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <Providers>
          <SiteHeader />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <SiteFooter />
          <Toaster />
          <ChunkLoadErrorHandler />
        </Providers>
      </body>
    </html>
  )
}