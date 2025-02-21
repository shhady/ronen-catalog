// import { Providers } from './providers';
import { Suspense } from 'react';
import { Rubik } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

const rubik = Rubik({
  subsets: ['hebrew'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'רונן קטלוג',
  description: 'קטלוג מוצרים של רונן',
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${rubik.className} bg-white text-gray-900 flex flex-col min-h-screen`}>
        <ScrollToTop />
        {/* <Providers> */}
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <main className="mt-16 flex-grow">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </Suspense>
        {/* </Providers> */}
      </body>
    </html>
  );
}
