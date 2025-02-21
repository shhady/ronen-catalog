import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'רונן קטלוג - מוצרים',
  description: 'קטלוג מוצרים מקצועי',
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${inter.className} bg-white text-gray-900 flex flex-col min-h-screen`}>
        <Navbar />
        <main className="mt-16 flex-grow">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
