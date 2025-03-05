// import { Providers } from './providers';
import { Suspense } from 'react';
import { Rubik } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import { ProductProvider } from '@/contexts/ProductContext';
import AccessibilityWidget from './components/AccessibilityWidget';
import Head from 'next/head';

const rubik = Rubik({
  subsets: ['hebrew'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  metadataBase: new URL('https://www.cicilialtd.com'),
  title: {
    default: 'Cicilia Import - קטלוג מוצרים',
    template: '%s | Cicilia Import'
  },
  description: 'קטלוג מוצרים איכותיים של Cicilia Import - מגוון רחב של מותגים ומוצרים',
  keywords: ['קטלוג מוצרים', 'מוצרי יבוא', 'מותגים', 'Cicilia Import'],
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: 'https://www.cicilialtd.com',
    siteName: 'Cicilia Import',
    images: [{
      url: '/hero1.jpg',
      width: 1200,
      height: 630,
      alt: 'Cicilia Import Catalog Preview',
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cicilia Import - קטלוג מוצרים",
    description: "מגוון רחב של מוצרים איכותיים מהמותגים המובילים",
    images: ["/hero1.jpg"], 
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
         <Head>
        <title>{metadata.title.default}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="robots" content="index, follow" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href={metadata.manifest} />
      </Head>
      <body className={`${rubik.className} bg-white text-gray-900 flex flex-col min-h-screen`}>
        <ScrollToTop />
        <ProductProvider>
          {/* <Providers> */}
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            <main className="mt-16 flex-grow">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <AccessibilityWidget />
          </Suspense>
          {/* </Providers> */}
        </ProductProvider>
      </body>
    </html>
  );
}
