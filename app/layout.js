import { Rubik } from 'next/font/google';
import { Providers } from './providers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './globals.css';

const rubik = Rubik({
  subsets: ['hebrew'],
  weights: ['400', '500', '700'],
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
      <body className={rubik.className}>
        <Providers>
          <ScrollToTop />
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
