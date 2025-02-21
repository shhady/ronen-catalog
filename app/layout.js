// import { Providers } from './providers';
import { Rubik } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

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
        {/* <Providers> */}
          <Navbar />
          <main className="mt-16 flex-grow">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        {/* </Providers> */}
      </body>
    </html>
  );
}
