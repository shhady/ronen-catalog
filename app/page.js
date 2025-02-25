import Link from 'next/link';
import Image from 'next/image';
import { Button } from './components/ui/button';
import { getBrands } from './lib/data';
import WhatsAppButton from './components/WhatsAppButton';
import PageViewTracker from './components/PageViewTracker';
import Hero from './models/Hero';
import connectDB from './lib/db';
export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const brands = await getBrands();
  await connectDB();
  const heroImage = await Hero.find();
  console.log(heroImage);
  return (
    <div className="min-h-screen">
      <PageViewTracker />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-primary/20 to-primary/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage[0].imageUrl}
            alt="Hero Background"
            fill
            sizes="100vw"
            priority
            className="object-cover"
            quality={85}
          />
          {/* <div className="absolute inset-0 bg-black/40" /> */}
        </div>
        {/* <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ברוכים הבאים לקטלוג המוצרים שלנו
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            גלו את המגוון הרחב של המוצרים האיכותיים שלנו
          </p> */}
          {/* <Link href="/shop">
            <Button size="lg" className="text-lg bg-white text-black hover:bg-gray-100">
              לצפייה בקטלוג
            </Button>
          </Link> */}
        {/* </div> */}
      </section>

      {/* Content Section */}<section className="pt-16 bg-gray-50">
      <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center ">
            <h2 className="text-3xl font-bold mb-3">Cicilia Import</h2>
            <p className="text-[22px] text-gray-600 ">
            היא בית למצוינות קולינרית, המובילה את תרבות הגסטרונומיה האיטלקית בישראל. מאז היווסדה בשנת 2018, החברה מתמחה בייבוא ושיווק מוצרי פרימיום איטלקיים, הנבחרים בקפידה ממיטב היצרנים והמותגים הידועים באיטליה.
            </p>
          </div>
      </div>
      </section>
      

      {/* Brands Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Brands</h2>
            <p className="text-lg text-gray-600 mb-12">
              המותגים המובילים שלנו נבחרו בקפידה כדי להבטיח את האיכות הגבוהה ביותר
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/shop?brand=${brand._id}`}
                className="block"
              >
                <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="relative w-32 h-32">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{brand.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {brand.description}
                  </p>
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
