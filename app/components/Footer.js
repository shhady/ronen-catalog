'use client';
  
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {


  const pathname = usePathname();
  
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null;
  }
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">ניווט</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  עמוד הבית
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  מוצרים
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-white transition-colors">
                  מועדפים
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">צור קשר</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <a href="tel:+972524571173" className="hover:text-white transition-colors">
                0524571173
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <a href="mailto:info@example.com" className="hover:text-white transition-colors">
                  info@example.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>נצרת , ישראל</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4 text-white">שעות פעילות</h3>
            <ul className="space-y-2">
              <li>ראשון - חמישי: 9:00 - 18:00</li>
              <li>שישי: 9:00 - 14:00</li>
              <li>שבת: סגור</li>
            </ul>
          </div> */}

          {/* About Short */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4 text-white">אודותינו</h3>
            <p className="text-sm leading-relaxed">
              אנחנו חברה מובילה בתחום המזון והמשקאות, המתמחה באספקת מוצרים איכותיים
              ממיטב המותגים בעולם. אנו מחויבים לאיכות ושירות ללא פשרות.
            </p>
          </div> */}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} כל הזכויות שמורות לרונן קטלוג
          </p>
        </div>
      </div>
    </footer>
  );
} 