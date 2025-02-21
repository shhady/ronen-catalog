import Link from 'next/link';
import Image from 'next/image';
import { Button } from './components/ui/button';
import { getBrands } from './lib/data';
import WhatsAppButton from './components/WhatsAppButton';
import PageViewTracker from './components/PageViewTracker';

export default async function HomePage() {
  const brands = await getBrands();

  return (
    <div className="min-h-screen">
      <PageViewTracker />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-primary/20 to-primary/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dypltfq4l/image/upload/v1740168396/af81e8c6-8697-4003-beae-ed45eb57a577_siyjys.webp"
            alt="Hero Background"
            fill
            sizes="100vw"
            priority
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ברוכים הבאים לקטלוג המוצרים שלנו
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            גלו את המגוון הרחב של המוצרים האיכותיים שלנו
          </p>
          <Link href="/shop">
            <Button size="lg" className="text-lg bg-white text-black hover:bg-gray-100">
              לצפייה בקטלוג
            </Button>
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">למה לבחור בנו?</h2>
            <p className="text-lg text-gray-600 mb-12">
              אנחנו מציעים מגוון רחב של מוצרים איכותיים מהמותגים המובילים בשוק
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">איכות מובטחת</h3>
              <p className="text-gray-600">
                כל המוצרים שלנו נבחרים בקפידה ועוברים בקרת איכות קפדנית
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">מגוון רחב</h3>
              <p className="text-gray-600">
                מבחר עצום של מוצרים ממיטב המותגים המובילים בתחום
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">שירות מקצועי</h3>
              <p className="text-gray-600">
                צוות המומחים שלנו זמין לכל שאלה ומספק ייעוץ מקצועי
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">מותגים</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/shop?brand=${brand._id}&query=&sort=newest`}
                className="block"
              >
                <div className="bg-white rounded-lg border border-gray-500 p-4 hover:shadow-md transition-shadow">
                  <div className="relative h-40 mb-4">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1">
                      <span className="text-lg">+</span>
                      <h3 className="text-lg font-medium text-right">{brand.name}</h3>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm">
                      {brand.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
}
